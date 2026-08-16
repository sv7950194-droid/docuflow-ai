import os
import logging
from backend.schemas.document import ExtractedDataSchema, ValidationResultSchema, DecisionResultSchema

logger = logging.getLogger("docuflow.decision_service")

def make_intelligent_decision(
    extracted_data: ExtractedDataSchema, 
    validation_result: ValidationResultSchema
) -> DecisionResultSchema:
    """
    Evaluates business decision rules based on AI confidence score and validation results.
    Returns DecisionResultSchema(decision: str, reason: str)
    """
    approved_threshold = float(os.getenv("CONFIDENCE_APPROVED_THRESHOLD", "90.0"))
    review_threshold = float(os.getenv("CONFIDENCE_REVIEW_THRESHOLD", "60.0"))

    score = extracted_data.confidence_score
    is_valid = validation_result.valid
    issues = validation_result.issues

    # Rule 1: APPROVED
    if is_valid and score >= approved_threshold:
        return DecisionResultSchema(
            decision="APPROVED",
            reason=f"All required fields extracted with {score:.1f}% confidence and passed all validation rules."
        )

    # Rule 3: REJECTED
    if score < review_threshold or ("Total amount must be a positive number greater than 0." in issues):
        return DecisionResultSchema(
            decision="REJECTED",
            reason=f"Confidence score ({score:.1f}%) is below minimum threshold or critical fields missing. ({', '.join(issues)})"
        )

    # Rule 2: NEEDS_REVIEW
    warning_summary = f"Issues detected: {'; '.join(issues)}" if issues else f"Confidence score ({score:.1f}%) requires human audit."
    return DecisionResultSchema(
        decision="NEEDS_REVIEW",
        reason=warning_summary
    )
