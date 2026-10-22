"""
Voice Verdict & Self-Correction Synthesis Tool.
Synthesizes voice-first summaries with calibrated abstention and Q3/Q4 self-correction.
"""

import html
import json
import logging
import os
import re
from typing import Any, Dict, List, Optional
from google import genai
from google.genai import types

logger = logging.getLogger("claim_check.verdict")

VERDICT_SYNTHESIS_PROMPT = """You are the Voice Synthesis Director for Alexa+.
Your task is to take an original statement and verified factual claims, then produce a natural, conversational spoken verdict.

Instructions:
1. If any claim was contradicted, generate a clear, calm correction that explains what was accurate and explicitly corrects what was false.
2. Tone: Friendly, conversational, authoritative without being condescending, suitable for a voice assistant (Alexa).
3. Keep the spoken response between 2 to 4 sentences (under 60 words) so it sounds great spoken aloud.

Output JSON format strictly:
{
  "spoken_response": "Natural spoken response here..."
}
"""


def safe_ssml_text(text: str) -> str:
    """Escapes XML reserved characters to prevent Alexa SSML parser crashes."""
    if not text:
        return ""
    return html.escape(text, quote=False)


def _clean_json_response(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
    return cleaned.strip()


async def spoken_verdict_logic(
    original_text: str,
    verified_claims: List[Dict[str, Any]],
    abstention_threshold: float = 0.65
) -> Dict[str, Any]:
    """
    Computes overall trust score, evaluates calibrated abstention and self-correction,
    and returns a voice-ready verdict with self-correction diff if applicable.
    """
    if not verified_claims:
        return {
            "overall_trust_score": 0,
            "status": "abstained",
            "abstained": True,
            "spoken_response": "I didn't detect any verifiable claims in that statement.",
            "self_correction_diff": None
        }

    total_claims = len(verified_claims)
    contradicted_claims = [c for c in verified_claims if c.get("verdict") == "contradicted"]
    unsure_or_low_conf = [
        c for c in verified_claims
        if c.get("verdict") == "unsure" or float(c.get("confidence", 0.0)) < abstention_threshold
    ]
    supported_claims = [c for c in verified_claims if c.get("verdict") == "supported"]

    # 1. Check Calibrated Abstention first
    # If any claim falls below abstention threshold or verdict is unsure, and not directly contradicted
    if unsure_or_low_conf and not contradicted_claims:
        avg_conf = sum(float(c.get("confidence", 0.5)) for c in verified_claims) / total_claims
        trust_score = max(20, min(60, round(avg_conf * 100)))

        unsure_topic = unsure_or_low_conf[0].get("atomic_text", "some of these points")
        spoken_response = (
            f"I cannot verify this completely. While part of the information may be factual, "
            f"reliable sources do not provide sufficient evidence to confirm whether {unsure_topic.lower().rstrip('.')}. "
            "I recommend checking verified sources before relying on this."
        )

        return {
            "overall_trust_score": trust_score,
            "status": "abstained",
            "abstained": True,
            "spoken_response": safe_ssml_text(spoken_response),
            "self_correction_diff": None
        }

    # 2. Check Q3/Q4 Self-Correction
    if contradicted_claims:
        # Calculate trust score based on proportion of supported claims
        trust_score = round((len(supported_claims) / total_claims) * 100) if total_claims > 0 else 0

        # Construct self_correction_diff
        first_bad = contradicted_claims[0]
        bad_text = first_bad.get("atomic_text", "")
        correction = first_bad.get("correction") or "This statement is not supported by verified evidence."

        self_correction_diff = {
            "removed_claim": bad_text.rstrip("."),
            "injected_correction": correction
        }

        # Try generating conversational spoken verdict with Gemini if available
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        spoken_response = None

        if api_key and api_key != "your_gemini_api_key_here":
            try:
                client = genai.Client(api_key=api_key)
                user_prompt = f"""Generate a short conversational voice response for Alexa correcting the error:
Original Statement: "{original_text}"
Contradicted Fact: "{bad_text}"
Correction: "{correction}"
Supported Facts: {[s.get('atomic_text') for s in supported_claims]}

Output JSON with 'spoken_response'."""

                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    system_instruction=VERDICT_SYNTHESIS_PROMPT,
                    temperature=0.2
                )

                resp = await client.aio.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=user_prompt,
                    config=config
                )
                parsed = json.loads(_clean_json_response(resp.text or ""))
                spoken_response = parsed.get("spoken_response")
            except Exception as e:
                logger.debug(f"Gemini spoken verdict synthesis fallback: {e}")

        # Natural fallback voice template
        if not spoken_response:
            if supported_claims:
                supp_text = ", and ".join([s.get("atomic_text", "").rstrip(".") for s in supported_claims[:2]])
                spoken_response = (
                    f"Hold on—part of that is true, but one part is inaccurate. "
                    f"{supp_text}. However, {correction}"
                )
            else:
                spoken_response = f"Actually, that is not accurate. {correction}"

        return {
            "overall_trust_score": trust_score,
            "status": "self_corrected",
            "abstained": False,
            "spoken_response": safe_ssml_text(spoken_response),
            "self_correction_diff": self_correction_diff
        }

    # 3. All claims are supported -> Verified Safe
    avg_conf = sum(float(c.get("confidence", 0.95)) for c in supported_claims) / max(len(supported_claims), 1)
    trust_score = max(95, min(100, round(avg_conf * 100)))

    spoken_response = "That information is verified and accurate. Reliable external sources confirm all stated facts."

    return {
        "overall_trust_score": trust_score,
        "status": "verified_safe",
        "abstained": False,
        "spoken_response": safe_ssml_text(spoken_response),
        "self_correction_diff": None
    }
