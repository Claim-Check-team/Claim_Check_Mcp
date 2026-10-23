# Claim-Check MCP: Epistemic Safety & Atomic Fact Verification for Alexa+

> **Voice-first atomic claim decomposition, evidence-grounded verification, self-correction, and calibrated abstention built on the Model Context Protocol (MCP).**

[![MCP Spec](https://img.shields.io/badge/MCP_Spec-2025--11--25-blue)](#)
[![Transport](https://img.shields.io/badge/Transport-Streamable_HTTP-success)](#)
[![Track](https://img.shields.io/badge/Track-Alexa%2B_Integration-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

---

## 1. Executive Summary (TL;DR)

Modern voice assistants like **Alexa+** excel at conversational fluency, but fluency is a double-edged sword: **when a voice assistant hallucinates or repeats a debunked myth, it speaks with the exact same confident tone as when it states a proven fact.**

While almost all safety projects in the Alexa+ ecosystem focus on **Action Safety** (confirming purchases, bookings, or smart-home state changes), **Claim-Check MCP** introduces **Epistemic Safety** (verifying whether the *information itself* is factually true before or after it is spoken).

Powered by **FActScore-style atomic claim extraction**, a **step-by-step grounded reasoning judge**, and a **Q3/Q4 Self-Correction Stress Test**, Claim-Check MCP breaks complex answers into individual verifiable facts, checks each against trusted evidence sources, automatically rewrites false claims, and explicitly says *"I'm not sure"* when confidence falls below a safe threshold.

---

## 2. The Problem: The "Linear Voice Blindspot"

Independent investigations (including **Full Fact’s audits of voice assistant factual reliability**) have highlighted a structural vulnerability in voice interfaces:

1. **No Visual Citations by Default:** Unlike web search, a spoken response gives the user a single linear audio stream with zero inline source links.
2. **The Compound Claim Trap:** If an assistant gives a 4-part answer where **3 claims are true and 1 claim is dangerously false**, human listeners cognitively accept the entire response as trustworthy because the first 3 facts sounded accurate.
3. **Action Safety $\neq$ Information Safety:** Existing MCP guardrails prevent an agent from *clicking the wrong button*, but nothing stops an agent from *confidently stating a debunked medical, financial, or scientific claim*.
4. **Lack of Calibrated Abstention:** Standard LLMs are trained to be helpful and complete, often guessing on ambiguous facts rather than abstaining in voice.

---

## 3. The Solution: How Claim-Check MCP Works

Claim-Check MCP acts as an **Epistemic Verification Layer** over **Streamable HTTP (`/mcp`)** supporting two core Alexa+ workflows:

### Mode A: Pre-Speech Self-Correction Guardrail (Agentic Loop)
Before Alexa+ speaks a response to a high-stakes query (health, finance, science, history), it passes its draft response through Claim-Check MCP:
1. **Decompose:** Splits the draft into atomic, self-contained facts (`extract_claims`).
2. **Verify:** Grounds each atomic claim against external evidence (`verify_claim`).
3. **Self-Correct or Abstain:** Removes or corrects contradicted sub-claims and generates a natural, voice-friendly spoken summary (`spoken_verdict`).

### Mode B: User-Invoked Fact-Checker ("Alexa, Claim-Check This!")
A user hears a viral rumor or multi-part statement and asks:
> *"Alexa, claim-check this: Aspirin reduces fever, comes from willow bark, and should be taken daily to treat dengue fever."*

Claim-Check MCP verifies each part independently and replies via voice while showing a color-coded claim card on the Echo Show screen.

---

## 4. Core Research Novelty (Why This Is Not a Generic Wrapper)

Generic fact-check wrappers pass an entire paragraph to an LLM and ask *"Is this true?"*—which fails on compound sentences and suffers from LLM confirmation bias. **Claim-Check MCP brings three research-grade innovations adapted from our BDVision truthfulness research:**

| Innovation | How Generic Wrappers Fail | How Claim-Check MCP Solves It |
| :--- | :--- | :--- |
| **1. FActScore-Style Atomic Decomposition** | Evaluates whole paragraphs at once; misses subtle errors buried inside mostly-true answers. | Isolates every independent subject-predicate-object assertion into an atomic unit before verification. |
| **2. Grounded Step-by-Step Judge** | Relies purely on LLM parametric memory (using one hallucinating LLM to check another). | Pairs live evidence retrieval (Wikipedia REST API + curated reference snippets) with structured chain-of-thought verification. |
| **3. Q3/Q4 Self-Correction & Calibrated Voice Abstention** | Gives binary "True/False" labels or hallucinated corrections even under low confidence. | Enforces strict confidence thresholds (`< 0.65` triggers explicit voice abstention: *"I cannot verify this part"*) and stress-tests whether the agent can repair its own flawed draft without losing true claims. |

---

## 5. System Architecture & Data Flow

```text
+-------------------------------------------------------------------------+
|                   USER / ALEXA+ MULTIMODAL SIMULATOR                    |
|  [Voice Mic Input (Web Speech API)]  <--->  [Echo Show Multimodal UI]   |
+------------------------------------+------------------------------------+
                                     |
                        Streamable HTTP POST /mcp
                         (MCP Spec 2025-11-25)
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        CLAIM-CHECK MCP SERVER                           |
|                                                                         |
|  +-----------------------+    +--------------------------------------+  |
|  | Tool 1:               |    | Tool 2:                              |  |
|  | extract_claims()      |--->| verify_claim()                       |  |
|  | (FActScore Atomic     |    | - Step-by-step reasoning judge       |  |
|  |  Decomposition)       |    | - Verdict: supported / contradicted  |  |
|  +-----------------------+    |            / unsure                  |  |
|                               +------------------+-------------------+  |
|                                                  |                      |
|                                                  v                      |
|  +-------------------------------------------------------------------+  |
|  | Tool 3: spoken_verdict()                                          |  |
|  | - Q3/Q4 Self-Correction (Rewrites contradicted sub-claims)        |  |
|  | - Calibrated Voice Abstention (Triggers if confidence < 0.65)     |  |
|  | - Outputs SSML/Voice-ready concise summary + Trust Score          |  |
|  +-------------------------------------------------------------------+  |
+------------------------------------+------------------------------------+
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
      +-----------------------------+ +-----------------------------+
      | Live Evidence Grounding     | | Deterministic Demo Cache    |
      | - Wikipedia REST API        | | - Instant zero-latency      |
      | - Gemini 2.5 Flash Judge    | |   fallback for 429 resilience|
      +-----------------------------+ +-----------------------------+
```

---

## 6. MCP Tools Specification

The server exposes **3 composable MCP tools** over Streamable HTTP (`/mcp`):

### Tool 1: `extract_claims`
Breaks a draft response or user statement into atomic, independently verifiable claims.

* **Input Schema:**
```json
{
  "response_text": "Aspirin reduces fever and inflammation, was derived from willow bark, and is recommended for treating dengue fever.",
  "query_context": "Tell me about aspirin and dengue fever."
}
```
* **Output Schema:**
```json
{
  "total_claims": 3,
  "claims": [
    {
      "claim_id": "c1",
      "atomic_text": "Aspirin reduces fever and inflammation.",
      "category": "medical_fact",
      "check_worthiness": "high"
    },
    {
      "claim_id": "c2",
      "atomic_text": "Aspirin was historically derived from compounds found in willow bark.",
      "category": "historical_fact",
      "check_worthiness": "medium"
    },
    {
      "claim_id": "c3",
      "atomic_text": "Aspirin is recommended for treating dengue fever.",
      "category": "medical_advice",
      "check_worthiness": "critical"
    }
  ]
}
```

---

### Tool 2: `verify_claim`
Verifies one or more atomic claims against grounded evidence using step-by-step reasoning.

* **Input Schema:**
```json
{
  "claim_id": "c3",
  "atomic_text": "Aspirin is recommended for treating dengue fever."
}
```
* **Output Schema:**
```json
{
  "claim_id": "c3",
  "atomic_text": "Aspirin is recommended for treating dengue fever.",
  "verdict": "contradicted",
  "confidence": 0.96,
  "evidence_source": "World Health Organization (WHO) / Wikipedia (Dengue Fever)",
  "evidence_snippet": "NSAIDs such as ibuprofen and aspirin should be avoided in dengue due to the increased risk of internal bleeding and hemorrhage.",
  "reasoning_steps": [
    "1. Identified target medical condition (dengue fever) and intervention (aspirin).",
    "2. Retrieved clinical guideline snippet on dengue fever management.",
    "3. Evidence explicitly states aspirin is contraindicated due to bleeding risk.",
    "4. Concluded claim is directly contradicted with high confidence (0.96)."
  ],
  "correction": "Aspirin should be avoided during dengue fever because its blood-thinning effect increases the risk of severe bleeding; acetaminophen (paracetamol) is typically used instead."
}
```

---

### Tool 3: `spoken_verdict`
Synthesizes claim-level verdicts into a concise, natural voice response with automatic self-correction and calibrated abstention.

* **Input Schema:**
```json
{
  "original_text": "Aspirin reduces fever and inflammation, was derived from willow bark, and is recommended for treating dengue fever.",
  "verifications": [
    {"claim_id": "c1", "verdict": "supported", "confidence": 0.98},
    {"claim_id": "c2", "verdict": "supported", "confidence": 0.95},
    {
      "claim_id": "c3",
      "verdict": "contradicted",
      "confidence": 0.96,
      "correction": "Aspirin must be avoided in dengue fever due to bleeding risks."
    }
  ],
  "abstention_threshold": 0.65
}
```
* **Output Schema:**
```json
{
  "overall_trust_score": 67,
  "status": "self_corrected",
  "abstained": false,
  "spoken_response": "Hold on—two parts of that are true, but one is dangerous. Aspirin does reduce fever and comes from willow bark. However, you should never take aspirin for dengue fever because it increases the risk of severe bleeding.",
  "self_correction_diff": {
    "removed_claim": "is recommended for treating dengue fever",
    "injected_correction": "should never be taken for dengue fever due to severe bleeding risk"
  }
}
```

---

## 7. The 6 Curated Demo Scenarios (Tested Examples)

Our interactive simulator includes **6 one-click presets** designed to showcase every verdict state (`supported`, `contradicted`, `unsure` / `abstained`, and `self-corrected`):

| # | Scenario Name | Simulated Draft Answer / Claim | Atomic Claims | Verdict Breakdown | Key Capability Shown |
| :- | :--- | :--- | :---: | :--- | :--- |
| **1** | **The Dengue Aspirin Trap** *(Compound Medical Myth)* | "Aspirin reduces fever, comes from willow bark, and should be taken daily for dengue fever." | 3 | 2 Supported<br>1 Contradicted | **Q3/Q4 Self-Correction:** Catches 1 dangerous error buried inside 2 true facts. |
| **2** | **The Great Wall From Space** *(Popular Misconception)* | "The Great Wall of China is over 13,000 miles long, was built across several dynasties, and is the only human-made structure visible from the Moon with the naked eye." | 3 | 2 Supported<br>1 Contradicted | **Debunking Viral Myths:** Corrects the space visibility myth using NASA evidence. |
| **3** | **Unverified Future Policy / Rumor** *(Abstention Trigger)* | "The Federal Reserve will abolish physical cash by November 2027 and replace all checking accounts with a mandatory biometric token." | 2 | 2 Unsure (`conf: 0.32`) | **Calibrated Voice Abstention:** Refuses to guess; says *"I'm not sure—there is no verified evidence supporting this."* |
| **4** | **Microwave & Nutrient Science** *(100% Accurate Control)* | "Microwave ovens heat food using non-ionizing electromagnetic radiation, and because cooking times are short, they often retain more Vitamin C than boiling." | 3 | 3 Supported | **Zero False Positives:** Confirms completely accurate scientific answers with a 98% Trust Badge. |
| **5** | **EV Battery Cold Weather Range** *(Nuanced Partial Truth)* | "Lithium-ion EV batteries lose temporary range in freezing weather, use thermal management systems, and permanently lose 50% capacity after one winter freeze." | 3 | 2 Supported<br>1 Contradicted | **Quantitative Fact-Checking:** Separates temporary range drop from false permanent degradation claims. |
| **6** | **Smart Home Carbon Monoxide Placement** *(Safety Critical)* | "Carbon monoxide detectors last 5 to 10 years, sound an audible alarm, and must only be installed flat on the floor because CO is much heavier than air." | 3 | 2 Supported<br>1 Contradicted | **Physical Safety Guardrail:** Corrects the floor-placement myth (CO mixes evenly with air; detectors belong at breathing/wall height). |

---

## 8. Multimodal UX Design (Echo Show Simulator)

The browser-based HTML simulator emulates an **Amazon Echo Show / Alexa+ multimodal display** split into two interactive panels:

1. **Left Panel — Alexa+ Voice & Display Card:**
   * Animated voice orb + Web Speech API (`speechSynthesis` & `SpeechRecognition`).
   * **Original Draft vs. Self-Corrected Spoken Output** toggle.
   * Color-coded **Epistemic Trust Score Badge** (e.g., `Trust Score: 67% — 1 Claim Corrected`).
2. **Right Panel — Atomic Claim Breakdown & Live MCP Inspector:**
   * Itemized cards for each atomic claim (`c1`, `c2`, `c3`) with **Supported**, **Contradicted**, or **Unsure (Abstained)** badges.
   * Expandable **Step-by-Step Judge Reasoning** and **Evidence Citation** snippet.
   * **Live MCP JSON-RPC Protocol Log** showing real-time calls to `/mcp` (`tools/list`, `tools/call: extract_claims`, `verify_claim`, `spoken_verdict`).

---

## 9. Tech Stack & Zero-Crash Architecture

* **MCP Server:** Python (`mcp` official SDK / FastAPI Streamable HTTP `/mcp`, Spec `2025-11-25`)
* **Reasoning & Decomposition Engine:** Google Gemini API (`gemini-2.5-flash` free tier) with structured JSON outputs
* **External Grounding:** Wikipedia REST API (`/api/rest_v1/page/summary/`) + curated domain verification corpus
* **Frontend Simulator:** Single-file Vanilla HTML/CSS/JS + Browser Web Speech API (zero frontend build step required)
* **Rate-Limit Resilience (429 Protection):**
  * **Batch Claim Verification:** Evaluates extracted claims in a single batched grounding pass when possible to reduce API calls from $N+2$ to $2$.
  * **Deterministic Fallback Cache:** All 6 preset scenarios are backed by a deterministic JSON verification cache so judges can test the full MCP pipeline even without a Gemini API key or under strict rate limits.

---

## 10. Repository Structure & Quickstart

```text
Claim_Check_Mcp/
├── server.py                  # FastMCP Streamable HTTP Server (/mcp) + REST API (/api/check)
├── tools/                     # Modular FastMCP Epistemic Safety Tools
│   ├── extract.py             # FActScore-style atomic claim decomposition
│   ├── verify.py              # Step-by-step grounded judge + Wikipedia REST lookup
│   ├── verdict.py             # Voice abstention + Q3/Q4 self-correction synthesis
│   └── apl_generator.py       # Amazon Alexa APL 2.0 Karaoke Document Renderer
├── alexa_skill/               # Production AWS Lambda Skill Handler (ask-sdk-core)
│   ├── lambda_function.py     # Python AWS Lambda Handler
│   └── interaction_model.json # Skill interaction schema
├── frontend/                  # Next.js 14 Multimodal Hardware Simulator
├── data/
│   └── preset_cache.json      # Deterministic fallback cache for benchmark cases
├── docs/                      # Architectural specifications & audit reports
├── FRICTION_LOG.md            # Developer Friction Log & Feedback for Amazon Teams
├── LICENSE                    # MIT Open-Source License
└── README.md                  # Master documentation & live links
```

### Production Live Deployment (HTTPS)
- **Web Simulator:** [https://claimcheck.165.99.219.253.sslip.io/](https://claimcheck.165.99.219.253.sslip.io/)
- **FastMCP SSE Wire:** [https://claimcheck.165.99.219.253.sslip.io/mcp/](https://claimcheck.165.99.219.253.sslip.io/mcp/)
- **API Health Endpoint:** [https://claimcheck.165.99.219.253.sslip.io/api/check](https://claimcheck.165.99.219.253.sslip.io/api/check)

### Run Locally in 60 Seconds

```bash
# 1. Clone the repository
git clone https://github.com/Israt-Jahan-Eshita/Claim_Check_Mcp.git
cd Claim_Check_Mcp

# 2. Install Python dependencies and launch FastMCP backend
pip install -r requirements.txt
python server.py

# 3. Launch Next.js Hardware Simulator (in another terminal)
cd frontend
npm install
npm run dev
```

* **MCP Streamable HTTP Endpoint:** `http://localhost:8000/mcp`
* **Interactive Alexa+ Simulator UI:** `http://localhost:3000/`

---

## 11. 3-Minute Demo Video Script (Storyboard)

* **0:00 – 0:25 | The Hook (Live Failure Catch):**
  * Immediately click **Preset #1 (Dengue & Aspirin)** in the simulator.
  * Show the unverified draft containing 2 true facts and 1 dangerous medical myth.
  * Watch Claim-Check MCP decompose the response into 3 atomic claims, flag Claim #3 as `CONTRADICTED (0.96)`, self-correct the answer, and speak the safe warning aloud.
* **0:25 – 0:55 | Why Epistemic Safety Matters for Alexa+:**
  * Briefly contrast **Action Safety** (confirming a purchase) with **Epistemic Safety** (verifying truth). Explain the "Compound Claim Trap" in linear voice interfaces.
* **0:55 – 1:45 | Inside the 3 MCP Tools & BDVision Research:**
  * Open the **Live MCP JSON-RPC Inspector** on the right pane.
  * Walk through `extract_claims` (FActScore atomic decomposition), `verify_claim` (Wikipedia grounding + step-by-step reasoning judge), and `spoken_verdict`.
* **1:45 – 2:20 | Calibrated Voice Abstention & Stress Test:**
  * Run **Preset #3 (Unverified Future Policy)** to show confidence dropping to `0.32` and Alexa+ explicitly saying *"I'm not sure"* instead of hallucinating.
  * Run **Preset #6 (Carbon Monoxide Detector Placement)** to show real-time Q3/Q4 self-correction.
* **2:20 – 2:50 | Architecture & Closing:**
  * Show the clean Python MCP SDK Streamable HTTP code (`server.py`) and wrap up how Claim-Check MCP brings verifiable trust to Alexa+.

---

## 12. Product Feedback & Friction Log (MCP + Alexa+ Ecosystem)

*(Also available in `FRICTION_LOG.md` for the hackathon product feedback bonus)*

1. **Latency Budgets in Multi-Step Voice MCP Pipelines:**
   * **Friction:** Voice interfaces require sub-2-second time-to-first-audio (TTFA) to feel natural, but epistemic verification (`extract` $\rightarrow$ `verify` $\rightarrow$ `spoken_verdict`) is inherently sequential.
   * **Recommendation for Alexa+ MCP Host:** Support **Progressive / Streaming Voice Acknowledgements** natively in the Alexa+ MCP client so an MCP tool can emit an immediate interim status token (e.g., *"Let me double-check one detail on that..."*) while `verify_claim` completes grounding.
2. **Pre-Speech Guardrail Hook in Alexa+ Orchestration:**
   * **Friction:** Standard MCP tools are invoked *before* the host LLM generates its final response. However, fact-checking and self-correction require inspecting the *candidate response* before TTS synthesis.
   * **Recommendation for Alexa+ MCP Host:** Introduce a dedicated **Post-Generation / Pre-TTS MCP Hook** (similar to an output guardrail middleware) so third-party epistemic safety MCP servers can validate high-stakes responses prior to audio playback.
3. **Multimodal Citation Cards via MCP Resource Templates:**
   * **Friction:** Returning structured claim-level badges (`supported` / `contradicted`) via plain text MCP tool results requires custom parsing on the frontend.
   * **Recommendation:** Standardize an Alexa+ APL (Alexa Presentation Language) or Multimodal Card schema within MCP `resources` so verification servers can natively render source badges on Echo Show devices.

---

## License

Distributed under the **MIT License**. See `LICENSE` for full details.
