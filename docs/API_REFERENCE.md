# Claim-Check MCP: API & Wire Protocol Reference Specification

> **Official Model Context Protocol (MCP Spec 2025-11-25) & REST API Documentation**  
> *Target Architecture: Amazon Alexa+ Epistemic Safety & Guardrail Ecosystem*

---

## 1. Overview & Transport Protocol

Claim-Check MCP provides dual-mode access:
1. **Model Context Protocol (MCP):** State-of-the-art **Streamable HTTP transport** over Server-Sent Events (SSE) and JSON-RPC 2.0 at `/mcp/`. Compliant with the official MCP Specification (2025-11-25).
2. **Standard REST API:** High-performance JSON endpoints at `/api/` for web applications, edge runtimes, and health monitors.

### Production Base URLs
- **Live HTTPS Gateway:** `https://claimcheck.165.99.219.253.sslip.io`
- **MCP Streamable Wire:** `https://claimcheck.165.99.219.253.sslip.io/mcp/`
- **REST Check Endpoint:** `https://claimcheck.165.99.219.253.sslip.io/api/check`
- **Local Dev Server:** `http://localhost:8000`

---

## 2. FastMCP Tool Specifications (`/mcp/`)

The FastMCP server advertises **4 core epistemic safety tools** via `tools/list`:

```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
```

---

### Tool 1: `extract_claims`
Breaks compound, multi-clause voice transcripts into discrete, self-contained Subject-Verb-Object (SVO) factual propositions following the FActScore methodology.

#### Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | **Yes** | The raw voice utterance or draft LLM response to decompose. |
| `query_context` | `string` | No | Optional conversation context or previous user turn. |

#### Example Request
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "extract_claims",
    "arguments": {
      "text": "Aspirin reduces fever, was derived from willow bark, and is recommended for treating dengue fever."
    }
  },
  "id": 2
}
```

#### Example Response
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[\"Aspirin reduces fever and inflammation.\", \"Aspirin was historically derived from compounds found in willow bark.\", \"Aspirin is recommended for treating dengue fever.\"]"
      }
    ]
  },
  "id": 2
}
```

---

### Tool 2: `verify_claim`
Cross-references a single atomic proposition against live external reference knowledge (Wikipedia REST APIs) and executes step-by-step epistemic reasoning.

#### Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| `claim` | `string` | **Yes** | The atomic statement to verify. |
| `source` | `string` | No | Target domain hint (e.g., `medical`, `historical`, `general`). |

#### Example Response
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"claim\": \"Aspirin is recommended for treating dengue fever.\", \"status\": \"contradicted\", \"confidence\": 0.96, \"evidence_source\": \"Wikipedia (Dengue Fever)\", \"evidence_snippet\": \"NSAIDs such as ibuprofen and aspirin should be avoided in dengue due to the increased risk of internal bleeding and hemorrhage.\", \"reasoning\": \"Evidence explicitly contraindicates aspirin in dengue due to platelet aggregation inhibition and hemorrhagic risk.\", \"correction\": \"Aspirin must be strictly avoided in dengue fever due to hemorrhagic bleeding risks; acetaminophen is recommended instead.\"}"
      }
    ]
  },
  "id": 3
}
```

---

### Tool 3: `compute_verdict`
Synthesizes verified claims into an overall FActScore epistemic confidence score, evaluates calibrated voice abstention thresholds, and formats self-corrected spoken audio.

#### Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| `claims` | `array[object]` | **Yes** | List of evaluated claim dictionaries from `verify_claim`. |
| `original_text` | `string` | **Yes** | Original unverified draft text. |

#### Return Schema
```json
{
  "trust_score": 67,
  "verdict": "contradicted",
  "calibrated_abstention": false,
  "spoken_response": "Hold on—two parts of that are true, but one is dangerous. Aspirin does reduce fever and comes from willow bark. However, you should never take aspirin for dengue fever because it increases the risk of severe bleeding.",
  "self_correction_diff": {
    "removed": "is recommended for treating dengue fever",
    "injected": "should never be taken for dengue fever due to severe bleeding risk"
  }
}
```

---

### Tool 4: `export_alexa_apl`
Generates a complete, compliant **Amazon Alexa Presentation Language (APL v2024.2)** `RenderDocument` directive with real-time `SpeakItem` karaoke highlighting for Echo Show 8, 10, and 15 devices.

#### Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| `claims` | `array[object]` | **Yes** | Verified claims payload. |
| `trust_score` | `integer` | **Yes** | Computed trust score (0 - 100). |
| `spoken_text` | `string` | **Yes** | Sanitized speech audio transcript. |

#### Output Structure
- Directive Type: `Alexa.Presentation.APL.RenderDocument`
- Document Schema: `apl`, version `2024.2`
- Visual Theme: Midnight Velvet & Alexa Electric Cyan Neumorphism
- Synchronized Component: `SpeakItem` audio-karaoke text element with auto-scroll.

---

## 3. REST API Endpoints (`/api/`)

### `POST /api/check`
Unified high-speed verification pipeline combining atomic extraction, Wikipedia search, epistemic judging, and APL directive generation into a single sub-1.4s call.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "response_text": "Aspirin reduces fever, comes from willow bark, and treats dengue.",
  "query_context": "Medical query regarding fever management"
}
```

#### Response (`200 OK`)
```json
{
  "trust_score": 67,
  "verdict": "contradicted",
  "claims": [
    {
      "claim_id": "c1",
      "text": "Aspirin reduces fever and inflammation.",
      "status": "supported",
      "confidence": 0.98,
      "source": "Wikipedia (Aspirin)",
      "snippet": "Aspirin is used to reduce pain, fever, or inflammation."
    },
    {
      "claim_id": "c2",
      "text": "Aspirin was derived from willow bark.",
      "status": "supported",
      "confidence": 0.95,
      "source": "Wikipedia (Aspirin)",
      "snippet": "The active substance in willow bark, salicin, was synthesized into acetylsalicylic acid."
    },
    {
      "claim_id": "c3",
      "text": "Aspirin treats dengue.",
      "status": "contradicted",
      "confidence": 0.96,
      "source": "Wikipedia (Dengue Fever)",
      "snippet": "NSAIDs like aspirin should not be used in dengue as they aggravate bleeding risks."
    }
  ],
  "spoken_summary": "Hold on—aspirin relieves fever and originates from willow bark, but it must strictly never be used for dengue fever due to hemorrhagic risk.",
  "calibrated_abstention": false,
  "latency_ms": 1340,
  "apl_directive": {
    "type": "Alexa.Presentation.APL.RenderDocument",
    "token": "claim-check-apl-token",
    "document": { ... },
    "datasources": { ... }
  }
}
```

---

### `GET /api/presets`
Returns the 6 curated failure-mode benchmark scenarios with pre-computed epistemic graphs.

#### Response (`200 OK`)
```json
[
  {
    "id": "dengue_aspirin",
    "title": "Medical Sycophancy (Dengue Aspirin Trap)",
    "draft_text": "Aspirin reduces fever, comes from willow bark, and should be taken daily for dengue fever.",
    "expected_verdict": "contradicted",
    "trust_score": 67
  },
  ...
]
```

---

### `GET /api/custom-scenarios`
Returns all dynamically verified user scenarios persisted during the active session.

---

### `POST /api/custom-scenarios`
Saves a verified custom scenario into the server's persistent storage.

---

### `DELETE /api/custom-scenarios/{scenario_id}`
Removes a saved custom scenario by its unique identifier.

---

### `GET /health`
Returns the health status of the FastMCP daemon, Groq LLM integration, and external Wikipedia REST gateways.

```json
{
  "status": "healthy",
  "service": "claim-check-mcp",
  "version": "2.4.0",
  "spec": "FastMCP 2025-11-25",
  "transport": "Streamable HTTP (/mcp/)"
}
```

---

## 4. Error Handling & Status Codes

| HTTP Status | Reason | Mitigation |
|---|---|---|
| `200 OK` | Successful execution | Normal operation. |
| `400 Bad Request` | Missing required parameters or empty input | Handled gracefully with zero-division safeguard fallback. |
| `429 Too Many Requests` | Upstream rate-limit exceeded | Server automatically serves deterministic grounding fallback with zero user interruption. |
| `500 Internal Error` | Unhandled runtime exception | Server watchdogs auto-recover and return sanitized SSML response. |
