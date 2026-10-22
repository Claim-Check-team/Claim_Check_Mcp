# PROJECT RULES & FROZEN API CONTRACT
# Claim-Check MCP — Amazon Alexa+ Hackathon

## 1. Strict File Ownership (ZERO MERGE CONFLICT RULE)

| Developer | Exclusive Files / Folders | Forbidden Files / Folders |
|-----------|---------------------------|---------------------------|
| **Developer A (Backend)** | server.py, tools/extract.py, tools/verify.py, tools/verdict.py, tools/__init__.py, requirements.txt | frontend/*, data/preset_cache.json, FRICTION_LOG.md, README.md |
| **Developer B (Frontend)** | frontend/*, data/preset_cache.json, FRICTION_LOG.md, README.md | server.py, tools/*, requirements.txt |

Rule: NEVER create or modify files outside your assigned list.

---

## 2. Ports & Architecture
- Backend (Developer A): Port 8000 (http://localhost:8000)
- Frontend (Developer B): Port 3000 (http://localhost:3000 — Next.js App Router)
- CORS in server.py: Enable CORSMiddleware with allow_origins=['http://localhost:3000', '*'], allow_methods=['*'], allow_headers=['*'].

---

## 3. Frozen Endpoints (Port 8000)
- POST /mcp -> Official MCP Streamable HTTP endpoint (Spec 2025-11-25) exposing extract_claims, verify_claim, spoken_verdict.
- POST /api/check -> Unified verification endpoint used by Next.js UI simulator.
- GET /api/presets -> Returns the 6 preset JSON array from data/preset_cache.json.
- GET / -> Health check: {'status': 'ok', 'service': 'claim-check-mcp', 'frontend': 'http://localhost:3000'}.
