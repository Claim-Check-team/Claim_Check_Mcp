"""
Atomic Claim Extraction Tool.
Decomposes complex, multi-clause responses into atomic, independently verifiable facts
following the FActScore methodology.
"""

import json
import logging
import os
import re
from typing import Any, Dict, List, Optional
from google import genai
from google.genai import types

logger = logging.getLogger("claim_check.extract")

EXTRACTION_SYSTEM_PROMPT = """You are an Epistemic Claim Decomposition Engine adhering to FActScore methodology.
Your task is to decompose a conversational response into atomic, self-contained factual claims.

Rules:
1. Break down compound sentences into atomic units containing a single subject-predicate-object fact.
2. Resolve pronouns (e.g., replace 'it', 'they', 'he' with the explicit entity name).
3. Retain the exact factual meaning without exaggeration or omission.
4. Categorize each claim into one of: 'medical_fact', 'medical_advice', 'scientific_fact', 'historical_fact', 'geographical_fact', 'general_fact'.
5. Assign check_worthiness: 'critical' (high stakes/safety/medical recommendations), 'high' (specific verifiable facts), 'medium' (secondary facts), 'low' (trivial/commonplace).
6. Assign sequential claim IDs starting with 'c1', 'c2', 'c3', etc.

Output JSON format strictly:
{
  "total_claims": 2,
  "claims": [
    {
      "claim_id": "c1",
      "atomic_text": "Clear standalone atomic statement",
      "category": "medical_fact",
      "check_worthiness": "high"
    }
  ]
}
"""


def _heuristic_extract(response_text: str) -> Dict[str, Any]:
    """
    Rule-based sentence/clause boundary splitter fallback when Gemini API
    is unavailable or rate-limited.
    """
    raw_text = response_text.strip()
    if not raw_text:
        return {"total_claims": 0, "claims": []}

    # Split on sentence boundaries and list punctuation
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", raw_text) if s.strip()]
    
    split_chunks: List[str] = []
    for s in sentences:
        # Split predicate-based conjunctions, relative pronouns, and semicolons
        raw_clauses = [
            c.strip()
            for c in re.split(
                r",\s*(?:and\s+)?(?=(?:is|was|are|were|has|have|had|can|should|could|would|will|who|which|won|invented|created|discovered)\b|[A-Z])|;\s*|\s+and\s+(?=[A-Z])",
                s
            )
            if c.strip()
        ]
        if not raw_clauses:
            continue

        # Extract subject from first clause (e.g. "Marie Curie" or "Aspirin")
        subject_match = re.match(
            r"^(?:The\s+)?([A-Z][a-zA-Z\s]+?)(?=\s+(?:is|was|are|were|has|have|had|can|should|could|would|will|reduces|creates|causes|won|invented|discovered)\b)",
            raw_clauses[0]
        )
        subject = subject_match.group(0) if subject_match else raw_clauses[0].split()[0]

        for idx, clause in enumerate(raw_clauses):
            cleaned = clause.strip().rstrip(".,")
            if idx > 0:
                if re.match(r"^(?:who|which)\s+", cleaned, re.IGNORECASE):
                    cleaned = re.sub(r"^(?:who|which)\s+", f"{subject} ", cleaned, flags=re.IGNORECASE)
                elif re.match(r"^(?:is|was|are|were|has|have|had|can|should|could|would|will|won|invented|created|discovered)\b", cleaned, re.IGNORECASE):
                    cleaned = f"{subject} {cleaned}"
            if len(cleaned) > 5:
                split_chunks.append(cleaned + ".")

    if not split_chunks:
        split_chunks = [raw_text if raw_text.endswith(".") else raw_text + "."]

    claims: List[Dict[str, Any]] = []
    medical_keywords = {"fever", "aspirin", "dengue", "dose", "treat", "medication", "doctor", "health", "bleed", "drug", "blood"}
    science_keywords = {"moon", "space", "orbit", "earth", "physics", "gravity", "biology", "chemical"}
    history_keywords = {"dynasty", "century", "bc", "ad", "war", "ancient", "historical", "built"}

    for idx, chunk in enumerate(split_chunks, start=1):
        lower_chunk = chunk.lower()
        if any(w in lower_chunk for w in medical_keywords):
            if any(w in lower_chunk for w in {"recommend", "should", "take", "treat", "avoid", "must"}):
                category = "medical_advice"
                worthiness = "critical"
            else:
                category = "medical_fact"
                worthiness = "high"
        elif any(w in lower_chunk for w in science_keywords):
            category = "scientific_fact"
            worthiness = "high"
        elif any(w in lower_chunk for w in history_keywords):
            category = "historical_fact"
            worthiness = "medium"
        else:
            category = "general_fact"
            worthiness = "medium"

        claims.append({
            "claim_id": f"c{idx}",
            "atomic_text": chunk,
            "category": category,
            "check_worthiness": worthiness
        })

    return {
        "total_claims": len(claims),
        "claims": claims
    }


def _clean_json_response(text: str) -> str:
    """Extract and parse valid JSON from LLM output, stripping markdown fences."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
    return cleaned.strip()


async def extract_claims_logic(response_text: str, query_context: str = "") -> Dict[str, Any]:
    """
    Decomposes response_text into atomic claims using Gemini 2.5 Flash,
    falling back to rule-based heuristic extraction if API is unavailable.
    """
    if not response_text or not response_text.strip():
        return {"total_claims": 0, "claims": []}

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY missing or placeholder. Using heuristic atomic extraction.")
        return _heuristic_extract(response_text)

    try:
        client = genai.Client(api_key=api_key)
        user_prompt = f"""Decompose the following conversational response into atomic claims:
Query Context: {query_context or "General Query"}
Response Text to Decompose:
\"\"\"{response_text}\"\"\"

Provide only JSON matching the requested schema."""

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            system_instruction=EXTRACTION_SYSTEM_PROMPT,
            temperature=0.1
        )

        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config=config
        )

        raw_content = response.text or ""
        parsed = json.loads(_clean_json_response(raw_content))

        # Validate structure
        if isinstance(parsed, dict) and "claims" in parsed and isinstance(parsed["claims"], list):
            formatted_claims = []
            for idx, c in enumerate(parsed["claims"], start=1):
                formatted_claims.append({
                    "claim_id": c.get("claim_id", f"c{idx}"),
                    "atomic_text": str(c.get("atomic_text", "")).strip(),
                    "category": str(c.get("category", "general_fact")),
                    "check_worthiness": str(c.get("check_worthiness", "medium"))
                })
            return {
                "total_claims": len(formatted_claims),
                "claims": formatted_claims
            }
        else:
            logger.warning("Gemini output missing expected keys. Falling back to heuristic.")
            return _heuristic_extract(response_text)

    except Exception as e:
        logger.warning(f"Gemini claim extraction failed or rate limited: {e}. Using heuristic fallback.")
        return _heuristic_extract(response_text)
