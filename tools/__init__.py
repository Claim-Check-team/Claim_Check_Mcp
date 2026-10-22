"""
Claim-Check MCP Tools Package.
Exposes logic functions for claim extraction, evidence-grounded verification,
and voice verdict synthesis.
"""

from .extract import extract_claims_logic
from .verify import verify_claim_logic, verify_all_claims_logic
from .verdict import spoken_verdict_logic

__all__ = [
    "extract_claims_logic",
    "verify_claim_logic",
    "verify_all_claims_logic",
    "spoken_verdict_logic",
]
