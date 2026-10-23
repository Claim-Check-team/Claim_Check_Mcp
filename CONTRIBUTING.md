# Contributing to Claim-Check MCP

Thank you for your interest in contributing to **Claim-Check MCP**! This project is an open-source Epistemic Safety Guardrail and Model Context Protocol (MCP) server engineered for Amazon Alexa+ and multimodal voice interfaces.

We welcome contributions of all kinds: new epistemic verification tools, external grounding adapters (e.g., PubMed, ArXiv, Wikidata), UI improvements to the Echo Show hardware simulator, bug fixes, and documentation improvements.

---

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors, regardless of experience level, background, or identity. Please be respectful and constructive in all discussions, pull requests, and issue reports.

---

## How to Contribute

### 1. Fork and Clone
```bash
git clone https://github.com/Claim-Check-team/Claim_Check_Mcp.git
cd Claim_Check_Mcp
```

### 2. Set Up Local Environment
```bash
# Python 3.10+ recommended
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Launch Backend FastMCP Daemon
python server.py

# In another terminal, launch Next.js Frontend
cd frontend
npm install
npm run dev
```

### 3. Run the Automated Test Suite
Before submitting any changes, ensure all automated tests pass:
```bash
# Run edge-case resilience test suite (6/6 tests)
python tests/test_edge_cases.py

# Run comprehensive dynamic system audit (5/5 tests)
python tests/test_audit_comprehensive.py

# Run frontend production build check
cd frontend
npm run build
```

---

## Architectural Guidelines

When adding or modifying components:

1. **Epistemic Integrity Over Action Guardrails:** Our mission is verifying *factual truth* and *clinical safety*, not merely action authorization.
2. **Sub-1.4s Voice SLA:** Amazon Alexa+ enforces a strict 1.8-second Time-to-First-Audio (TTFA) ceiling. All tool calls must be optimized with batching and async IO to avoid blocking TTS pipelines.
3. **Spec-Compliant FastMCP:** Tool schemas must adhere strictly to the Model Context Protocol (Spec 2025-11-25) over Streamable HTTP (`/mcp/`).
4. **Alexa APL 2.0 Compliance:** Any multimodal UI changes must maintain compatibility with official `Alexa.Presentation.APL.RenderDocument` v2024.2 directives.

---

## Pull Request Guidelines

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Write Clean, Documented Code:** Include docstrings and type annotations for all new Python functions and TypeScript components.
3. **Commit Messages:** Use conventional commits (e.g., `feat: add pubmed grounding provider`, `fix: sanitize ampersands in ssml renderer`).
4. **Submit PR:** Open a Pull Request against the `main` branch with a clear description of the problem solved, testing methodology, and any relevant screenshots or audio samples.

---

## Questions & Support

Feel free to open an issue or reach out via our GitHub repository discussions. Thank you for helping build safe, grounded, and trustworthy voice AI!
