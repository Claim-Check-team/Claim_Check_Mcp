# Claim-Check MCP: Epistemic Safety & Atomic Fact Verification for Alexa+

> Voice-first atomic claim decomposition, evidence-grounded verification, self-correction, and calibrated abstention built on the Model Context Protocol (MCP).

---

## 1. Executive Summary

Modern voice assistants like Alexa+ excel at conversational fluency, but fluency is a double-edged sword: when an assistant hallucinates or repeats a debunked myth, it speaks with the exact same confident tone as when it states a proven fact.

While most safety initiatives in voice AI focus on Action Safety (preventing unintended purchases, smart-home toggles, or calendar bookings), Claim-Check MCP introduces Epistemic Safety (verifying whether the spoken information is factually true before it reaches the user).

Powered by FActScore-style atomic claim extraction, a step-by-step grounded reasoning judge, and a Q3/Q4 self-correction stress test, Claim-Check MCP decomposes draft answers into isolated verifiable assertions, validates each against live Wikipedia REST APIs, automatically rewrites contradicted claims, and executes calibrated abstention when confidence falls below safe thresholds.

---

## 2. Core Problem: The Linear Voice Blindspot

1. Absence of Default Visual Citations: Spoken responses provide a linear audio stream with zero inline hyperlinks.
2. Compound Claim Trap: In a multi-part answer where three statements are true and one is dangerously false, human listeners cognitively accept the whole statement because the initial facts sound credible.
3. Action Safety != Information Safety: Guardrails prevent unwanted button clicks, but do not stop an agent from repeating debunked medical or technical advice.
4. Lack of Calibrated Abstention: Standard LLMs tend to guess rather than explicitly acknowledge uncertainty in voice interfaces.

---

## 3. System Architecture & Endpoints

- Backend runs on Port 8000 (FastAPI + FastMCP at /mcp)
- Frontend runs on Port 3000 (Next.js App Router with Neumorphism, Skeuomorphism, and Glassmorphism)
- MCP Tools exposed:
  1. extract_claims: Decomposes draft responses into atomic assertions.
  2. verify_claim: Grounds assertions against Wikipedia REST API and step-by-step judge.
  3. spoken_verdict: Generates self-corrected spoken output with calibrated abstention.

---

## 4. Tested Demo Scenarios

1. The Dengue Aspirin Trap: Catches 1 dangerous medical myth inside 2 true facts.
2. Great Wall from Space: Debunks viral space myth using NASA verification.
3. Unverified 2027 Policy: Low confidence triggers calibrated voice abstention.
4. Microwave Radiation: Confirms completely accurate science with 98% Trust Score.
5. EV Battery Cold Range: Distinguishes temporary seasonal range loss from permanent damage.
6. CO Detector Placement: Corrects physical safety myth regarding carbon monoxide placement.

---

## 5. Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Start the MCP Server (Port 8000)
`ash
cd D:\claim-check-mcp
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python server.py
`

### Step 2: Start the Next.js Echo Show Simulator (Port 3000)
`ash
cd D:\claim-check-mcp\frontend
npm install
npm run dev
`

Open http://localhost:3000 to interact with the simulator.

---

## 6. License
Distributed under the MIT License.
