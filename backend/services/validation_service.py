import logging
from backend.schemas.document import ExtractedDataSchema, ValidationResultSchema

logger = logging.getLogger("docuflow.validation_service")

def validate_extracted_data(data: ExtractedDataSchema) -> ValidationResultSchema:
    """
    Validates extracted document data fields against business rules.
    Returns ValidationResultSchema(valid: bool, issues: List[str])
    """
    issues = []

    # 1. Required Field Checks
    if not data.vendor_name or data.vendor_name.strip() in ["", "Unknown Vendor"]:
        issues.append("Vendor name is missing or ambiguous.")

    if not data.invoice_number or data.invoice_number.strip() in ["", "INV-UNKNOWN"]:
        issues.append("Invoice number is missing.")

    if not data.total_amount or data.total_amount <= 0:
        issues.append("Total amount must be a positive number greater than 0.")

    # 2. Date Presence
    if not data.invoice_date:
        issues.append("Invoice issue date is missing.")

    # 3. Math & Tax Reconciliation Audit
    if data.subtotal > 0 and data.tax >= 0 and data.total_amount > 0:
        expected_total = round(data.subtotal + data.tax, 2)
        diff = abs(expected_total - data.total_amount)
        if diff > 1.0: # Allow slight rounding error tolerance up to $1.00
            issues.append(
                f"Math discrepancy detected: Subtotal (${data.subtotal:.2f}) + Tax (${data.tax:.2f}) = ${expected_total:.2f}, "
                f"which differs from Total Amount (${data.total_amount:.2f})."
            )

    is_valid = len(issues) == 0

    logger.info(f"Validation completed: valid={is_valid}, issues_count={len(issues)}")
    return ValidationResultSchema(valid=is_valid, issues=issues)
