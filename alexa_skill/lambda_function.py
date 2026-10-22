"""
AWS Lambda Handler for Amazon Alexa Skill: Claim-Check MCP
Connects Amazon Alexa+ voice queries with the Claim-Check FastMCP Epistemic Safety Server
and renders APL 2.0 multimodal cards on Echo Show devices.
"""

import logging
import os
from typing import Optional
import httpx

from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import AbstractRequestHandler, AbstractExceptionHandler
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_core.utils import is_request_type, is_intent_name
from ask_sdk_model import Response
from ask_sdk_model.interfaces.alexa.presentation.apl import RenderDocumentDirective

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8000")


def supports_apl(handler_input: HandlerInput) -> bool:
    """Checks if the user device supports Alexa Presentation Language (APL)."""
    try:
        supported_interfaces = handler_input.request_envelope.context.system.device.supported_interfaces
        return getattr(supported_interfaces, "alexa_presentation_apl", None) is not None
    except Exception:
        return False


class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = (
            "Welcome to Claim-Check for Alexa+. I verify multi-part conversational statements, "
            "ground facts against live Wikipedia references, and correct misconceptions before they mislead. "
            "What claim would you like me to verify?"
        )
        reprompt_text = "Try saying: verify that aspirin is recommended for treating dengue fever."
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(reprompt_text)
            .response
        )


class ClaimCheckIntentHandler(AbstractRequestHandler):
    """Handler for ClaimCheckIntent."""
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("ClaimCheckIntent")(handler_input)

    def handle(self, handler_input: HandlerInput) -> Response:
        slots = handler_input.request_envelope.request.intent.slots
        claim_slot = slots.get("claim") if slots else None
        claim_text = (claim_slot.value if claim_slot and claim_slot.value else "").strip()

        if not claim_text:
            speak_output = "I didn't catch the statement. Please say the claim you would like me to check."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .ask("What claim should I verify?")
                .response
            )

        logger.info(f"Processing ClaimCheck query: '{claim_text}'")

        # Query Claim-Check MCP Server
        try:
            with httpx.Client(timeout=12.0) as client:
                res = client.post(
                    f"{MCP_SERVER_URL}/api/check",
                    json={
                        "response_text": claim_text,
                        "query_context": "Alexa+ Spoken Query"
                    }
                )

            if res.status_code == 200:
                data = res.json()
                spoken_verdict = data.get("spoken_verdict", {})
                speak_output = spoken_verdict.get("spoken_response") or (
                    "I have evaluated that statement against external evidence."
                )

                # Attach APL 2.0 directive for Echo Show screen
                if supports_apl(handler_input) and "apl_directive" in data:
                    apl = data["apl_directive"]
                    handler_input.response_builder.add_directive(
                        RenderDocumentDirective(
                            token=apl.get("token", "claim_check_apl_token"),
                            document=apl.get("document"),
                            datasources=apl.get("datasources")
                        )
                    )

                return (
                    handler_input.response_builder
                    .speak(speak_output)
                    .ask("Would you like me to verify another claim?")
                    .response
                )
            else:
                logger.error(f"MCP server returned HTTP {res.status_code}: {res.text}")
                speak_output = "I encountered an error verifying that claim with the server. Please try again."

        except Exception as e:
            logger.error(f"Error querying Claim-Check MCP server: {e}")
            speak_output = (
                "I am currently unable to reach the Claim-Check verification service. "
                "Please make sure the server is running."
            )

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask("Try another claim, or say stop to exit.")
            .response
        )


class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent."""
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = (
            "You can ask me to fact-check any complex, multi-part statement or common myth. "
            "For example, say: verify that the Great Wall of China is visible from the Moon. "
            "What would you like to verify?"
        )
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


class CancelOrStopIntentHandler(AbstractRequestHandler):
    """Handler for Cancel and Stop Intents."""
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return (is_intent_name("AMAZON.CancelIntent")(handler_input) or
                is_intent_name("AMAZON.StopIntent")(handler_input))

    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = "Goodbye! Stay informed with verified, evidence-grounded facts."
        return (
            handler_input.response_builder
            .speak(speak_output)
            .set_should_end_session(True)
            .response
        )


class SessionEndedRequestHandler(AbstractRequestHandler):
    """Handler for Session End."""
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_request_type("SessionEndedRequest")(handler_input)

    def handle(self, handler_input: HandlerInput) -> Response:
        logger.info(f"Session ended reason: {handler_input.request_envelope.request.reason}")
        return handler_input.response_builder.response


class CatchAllExceptionHandler(AbstractExceptionHandler):
    """Generic error handling to capture any syntax or runtime issues."""
    def can_handle(self, handler_input: HandlerInput, exception: Exception) -> bool:
        return True

    def handle(self, handler_input: HandlerInput, exception: Exception) -> Response:
        logger.error(exception, exc_info=True)
        speak_output = "Sorry, I had trouble processing that claim. Please try phrasing it again."
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


# Initialize SkillBuilder and export lambda_handler
sb = SkillBuilder()
sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(ClaimCheckIntentHandler())
sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()
