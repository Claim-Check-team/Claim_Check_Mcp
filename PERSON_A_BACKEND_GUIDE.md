# DEVELOPER GUIDER PERSON A (BACKEND & MCP CORE ENGINEER)
# Project: Claim-Check MCP (Amazon Alexa+ Track)

## 1. Role and Boundaries
- Role: Responsible for Python MCO Server, Gemini Epistemic Judge, and Wikipedia grounding engine.
- Partner (Person B): Developing Next.js frontend UI (Port 3000) inside the frontend/ directory.
- Strict File Ownership: You may only create/edit:
  - server.py
  - tools/__init__.py
  - tools/extract.py
  - tools/verify.py
  - tools/verdict.py
  - requirements.txt
- Forbidden Files/Directories: Do NOT edit frontend/, data/preset_cache.json, README.md, or FRICTION_LOG.md.

---

## 2. Environment Setup

Run the following commands in PowerShell:

```bash
cd D:\claim-check-mcp
git checkout -b feat/mcp-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
$env:GEMINI_API_KEY = "your_gemini_api_key_here"
```

---

## 3. Agent Execution Prompt

Copy and paste the prompt below into your AI coding agent (Cursor, Windsurf, Copilot, or Claude Code):

```text
You are Developer A (Backend & MCP Core Engineer) building Claim-Check MCP for the Amazon Alexa+ Hackathon.

Working directory: D:\claim-check-mcp
Git branch: feat/mcp-backend
STRICT FILE BOUNDARY RULE:
You may ONLY create or edit these exact files:
1. requirements.txt
2. tools/__init__.py
3. tools/extract.py
4. tools/verify.py
5. tools/verdict.py
6. server.py
DO NOT touch anything in frontend/ or data/preset_cache.json (Developer B owns those).
Read CLAUDE.md for the frozen API contract before writing any code.
ARCHITECTURE AND PORTS:
- Backend runs on Port 8000 (FastAPI + FastMCP at /mcp).
- Frontend runs on Port 3000 (Next.js App Router).
- In server.py, configure CORSMiddleware allowing origins ['http://localhost:3000', '*'].

IMPLEMENTATION SPECIFICATIONS:

1. requirements.txt:
   Include: fastapi>=0.115.0, uvicorn[standard]>=0.30.0, mcp>=1.9.0, google-genai>=0.8.0, httpx>=0.27.0, pydantic>=2.7.0, python-multipart>=0.0.9, aiofiles>=23.0.0

2. tools/__init__.py:
   Package initialization exposing extract_claims_logic, verify_claim_logic, verify_all_claims_logic, spoken_verdict_logic.

3. tools/extract.py:
   - Implement async def extract_claims_logic(response_text: str, query_context: str = "") -> dict
   - Uses FActScore-style atomic claim decomposition via google-genai (gemini-2.5-flash with structured JSON output).
   - Splits response_text into independent subject-predicate-object atomic facts.
   - Output fields per claim: claim_id ('c1', 'c2', ...), atomic_text, category, check_worthiness.
   - Heuristic fallback: if GEMINI_API_KEY is unset or raises an error (including 429), split on sentence boundaries and assign sequential claim IDs.
   - Return: {'total_claims': N, 'claims': [...]}

4. tools/verify.py:
   - Implement async def verify_claim_logic(claim_id: str, atomic_text: str, query_context: str = "") -> dict
   - Implement async def verify_all_claims_logic(claims: list, query_context: str = "") -> list (batches verification in 1 Gemini call to avoid free-tier 15 RPM rate limits).
   - Grounding: query Wikipedia REST API (GET https://en.wikipedia.org/api/rest_v1/page/summary/{key_term}) with User-Agent header. Fallback to Wikipedia search API if 404.
   - Reasoning: prompt gemini-2.5-flash as a Step-by-Step Epistemic Judge comparing claim against retrieved evidence.
   - Output fields per claim: claim_id, atomic_text, category, check_worthiness, verdict ('supported'|'contradicted'|'unsure'), confidence (float 0.0-1.0), evidence_source, evidence_snippet, reasoning_steps (list of strings), correction (string if contradicted, else null).
   - Heuristic fallback: keyword and pattern analysis if Gemini is unavailable.

5. tools/verdict.py:
   - Implement async def spoken_verdict_logic(original_text: str, verified_claims: list, abstention_threshold: float = 0.65) -> dict
   - Implement calibrated voice abstention: if any claim has confidence < abstention_threshold or verdict == 'unsure', set abstained=True, status='abstained', and generate spoken_response explicitly stating uncertainty.
   - Implement Q3/Q4 self-correction: if any claim is contradicted (and not abstained), set status='self_corrected', populate self_correction_diff (removed_claim, injected_correction), and synthesize natural spoken_response correcting the error while preserving true facts.
   - If all claims are supported, set status='verified_safe', abstained=False, overall_trust_score >= 95.
   - Return: {'overall_trust_score': int, 'status': str, 'abstained': bool, 'spoken_response': str, 'self_correction_diff': dict_or_null}

6. server.py:
   - Unified FastAPI and Python MCP SDK (FastMCP) server on port 8000.
   - Mount FastMCP at /mcp using Streamable HTTP transport.
   - Register 3 MCP tools: extract_claims, verify_claim, spoken_verdict.
   - REST Endpoints:
     - GET /: health-check JSON returning {'status': 'ok', 'service': 'claim-check-mcp', 'frontend': 'http://localhost:3000'}.
     - GET /api/presets: loads and returns data/preset_cache.json.
     - POST /api/check: accepts {'preset_id': str, 'query_context': str, 'response_text': str}, runs extraction, batch verification, and verdict synthesis, returning unified JSON with mcp_trace. Gracefully falls back to data/preset_cache.json on Gemini errors or rate limits.
   - Entry point: uvicorn.run(app, host='0.0.0.0', port=8000).

Write complete, production-ready, well-tested code for all 6 files.
```

---

## 4. Verification and Testing

```bash
python server.py

# in separate terminal:
curl http://localhost:8000/api/presets
curl -X POST https://localhost:8000/api/check -H "Content-Type: application/json" -d '{"preset_id": "dengue_aspirin"}'
```

---

## 5. Git Commit and Branch Instructions

```bash
git checkout -b feat/mcp-backend
git add server.py tools/ requirements.txt
git commit -m "feat: implement Streamable HTTP MCP server and epistemic AI tools"
git push origin feat/mcp-backend
```
