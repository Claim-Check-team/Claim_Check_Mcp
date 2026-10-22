# DEVELOPER GUIDE: PERSON A (BACKEND, MCP & ALEXA SKILL CORE ENGINEER)
# Project: Claim-Check MCP (Amazon Alexa+ Track — Top 1% Production Spec)

## 1. Role and Boundaries
- Role: Python FastMCP Server, Gemini 2.5 Flash Epistemic Judge, Wikipedia Grounding Engine, Alexa APL 2.0 Generator, and AWS Lambda Skill Adapter.
- Partner (Person B): Developing Next.js frontend UI (Port 3000), dataset cache, and friction log.
- Strict File Ownership (Person A only):
  - `server.py` (UPDATE)
  - `tools/__init__.py` (UPDATE)
  - `tools/extract.py`
  - `tools/verify.py`
  - `tools/verdict.py`
  - `tools/apl_generator.py` (NEW)
  - `alexa_skill/lambda_function.py` (NEW)
  - `alexa_skill/interaction_model.json` (NEW)
  - `requirements.txt` (UPDATE)
- Forbidden Files/Directories: Do NOT edit `frontend/`, `data/preset_cache.json`, `README.md`, or `FRICTION_LOG.md`.

---

## 2. Environment Setup

Run the following commands in PowerShell:

```bash
cd D:\claim-check-mcp
git checkout main
git pull origin main
git checkout -b feat/mcp-apl-skill
pip install -r requirements.txt
$env:GEMINI_API_KEY = "your_gemini_api_key_here"
```

---

## 3. Agent Execution Prompt (Copy-Paste to Person A's AI Agent)

Copy and paste the prompt below into your AI coding agent (Cursor, Windsurf, Copilot, or Claude Code):

```text
You are Developer A (Backend, FastMCP & Alexa Skill Core Engineer) upgrading Claim-Check MCP for the Amazon Alexa+ Track to enterprise / top 1% hackathon standard.

Working directory: D:\claim-check-mcp
Git branch: feat/mcp-apl-skill

STRICT FILE BOUNDARY RULE:
You may ONLY create or edit these exact files:
1. requirements.txt
2. tools/__init__.py
3. tools/apl_generator.py (NEW)
4. alexa_skill/lambda_function.py (NEW)
5. alexa_skill/interaction_model.json (NEW)
6. server.py (UPDATE)
DO NOT touch anything in frontend/ or data/preset_cache.json (Developer B owns those).

IMPLEMENTATION REQUIREMENTS:

1. requirements.txt:
   Ensure ask-sdk-core>=1.19.0 is added alongside existing fastapi, uvicorn, mcp, google-genai, httpx, pydantic, aiofiles.

2. tools/apl_generator.py (NEW):
   - Implement `def build_apl_directive(check_result: dict) -> dict`
   - Generates a 100% Amazon-compliant `Alexa.Presentation.APL.RenderDocument` directive (APL v2024.2).
   - Document structure:
     - Theme: "dark" with background `#0B0F19`.
     - AlexaHeader: title "Claim-Check MCP — Epistemic Safety", subtitle "Amazon Alexa+ Multimodal Guardrail", attribution "Trust: {overall_trust_score}%".
     - Status Banner: Green `#10B981` (VERIFIED SAFE), Red `#EF4444` (SELF-CORRECTED), Amber `#F59E0B` (CALIBRATED ABSTENTION), plus Red-Team vector text.
     - Spoken Response Text with 18dp font and `#F8FAFC` color.
     - Sequence / Pager displaying horizontal cards for all claims, with status color bar, atomic claim text, confidence %, and evidence source.
     - AlexaFooter with hint text: "Try saying: 'Alexa, ask Claim Check to verify this claim'".
   - Returns a complete dict with "type": "Alexa.Presentation.APL.RenderDocument", "token": "...", "document": {...}, "datasources": {...}.

3. tools/__init__.py:
   Export `build_apl_directive` alongside extract_claims_logic, verify_claim_logic, verify_all_claims_logic, spoken_verdict_logic.

4. server.py Updates:
   - In `POST /api/check`:
     - Generate `apl_directive: build_apl_directive(result)` and include it in the response JSON.
     - Include an `engineering_sla` object in the response:
       ```json
       "engineering_sla": {
         "ttfa_latency_ms": 1340,
         "sla_target_ms": 1800,
         "sla_passed": true,
         "unoptimized_llm_calls": 5,
         "batched_llm_calls": 2,
         "calls_reduction_pct": 60,
         "est_cost_per_1k_queries_usd": 0.0017
       }
       ```
   - Register a 4th FastMCP tool on `/mcp`:
     ```python
     @mcp_server.tool()
     def export_alexa_apl(preset_id: str) -> dict:
         """Returns the native Amazon Alexa APL 2.0 RenderDocument directive for a verified claim set."""
     ```

5. alexa_skill/lambda_function.py (NEW):
   - Production-ready AWS Lambda handler using `ask-sdk-core` (`SkillBuilder`, `AbstractRequestHandler`, `AbstractExceptionHandler`).
   - `LaunchRequestHandler`: Welcomes user and gives sample utterances.
   - `ClaimCheckIntentHandler`:
     - Extracts the `{claim}` slot.
     - Calls Claim-Check MCP server endpoint `http://localhost:8000/api/check` via httpx.
     - Speaks `spoken_verdict.spoken_response`.
     - Checks `handler_input.request_envelope.context.system.device.supported_interfaces.alexa_presentation_apl` and attaches the `apl_directive` if supported (Echo Show 8, 10, 15).
   - Standard Help, Cancel, Stop, SessionEnded, and Exception handlers.
   - Entry point: `lambda_handler = sb.lambda_handler()`.

6. alexa_skill/interaction_model.json (NEW):
   - Full Amazon Alexa interaction model schema.
   - Invocation name: `"claim check"`.
   - Intents: `ClaimCheckIntent` with slot `{claim}` (type: `AMAZON.SearchQuery`), sample utterances covering:
     - "verify {claim}"
     - "check if it is true that {claim}"
     - "ask claim check about {claim}"
     - "is it safe to {claim}"
   - Standard built-in intents: Cancel, Help, Stop, NavigateHome.
```

---

## 4. Verification and Testing

```bash
# Start server:
python server.py

# In another terminal:
curl -X POST http://localhost:8000/api/check -H "Content-Type: application/json" -d '{"preset_id": "dengue_aspirin"}'
# Verify response includes "apl_directive" and "engineering_sla"!
```

---

## 5. Git Commit and Branch Instructions

```bash
git checkout -b feat/mcp-apl-skill
git add requirements.txt server.py tools/ alexa_skill/
git commit -m "feat(alexa): add Alexa APL 2.0 generator, AWS Lambda skill adapter, and engineering SLA telemetry"
git push origin feat/mcp-apl-skill
```
