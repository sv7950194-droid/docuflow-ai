import os
import re
import json
import logging
import requests
from backend.schemas.document import ExtractedDataSchema

logger = logging.getLogger("docuflow.ai_service")

def parse_with_rules(raw_text: str) -> ExtractedDataSchema:
    """
    Intelligent heuristic regex/NLP fallback extractor used when AI_API_KEY is not set.
    Extracts vendor, invoice number, dates, and amounts directly from document text.
    """
    logger.info("Executing rule-based NLP parser on extracted text...")
    
    # Default values
    vendor = "Unknown Vendor"
    inv_num = None
    inv_date = None
    due_date = None
    subtotal = 0.0
    tax = 0.0
    total = 0.0
    confidence = 88.0

    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]

    # 1. Vendor detection (first non-header line or line with Inc/Corp/LLC/Ltd/Systems)
    for line in lines[:5]:
        if any(keyword in line.lower() for keyword in ['inc', 'corp', 'llc', 'ltd', 'technologies', 'solutions', 'systems', 'services', 'co.']):
            vendor = line
            break
    if vendor == "Unknown Vendor" and lines:
        vendor = lines[0] # Fallback to first non-empty line

    # 2. Invoice number matching
    inv_match = re.search(r'(?:invoice|inv|bill|ref|receipt)\s*[:#\s]*([A-Z0-9\-_]{3,20})', raw_text, re.IGNORECASE)
    if inv_match:
        inv_num = inv_match.group(1).strip()
    else:
        # Check standalone pattern like INV-9842 or #9842
        inv_match_alt = re.search(r'#\s*([A-Z0-9\-_]{3,20})', raw_text)
        if inv_match_alt:
            inv_num = inv_match_alt.group(1).strip()

    # 3. Date matching (YYYY-MM-DD, MM/DD/YYYY, or Month DD, YYYY)
    date_matches = re.findall(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})', raw_text, re.IGNORECASE)
    if date_matches:
        inv_date = date_matches[0]
        if len(date_matches) > 1:
            due_date = date_matches[1]

    # 4. Amount matching (Subtotal, Tax, Total)
    amounts = re.findall(r'\$?\s*([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})', raw_text)
    float_amounts = []
    for amt in amounts:
        try:
            val = float(amt.replace(',', ''))
            if val > 0:
                float_amounts.append(val)
        except ValueError:
            pass

    if float_amounts:
        float_amounts.sort()
        total = float_amounts[-1] # Largest numeric value is usually total
        if len(float_amounts) >= 2:
            subtotal = float_amounts[-2]
            tax = round(total - subtotal, 2)
            if tax < 0:
                tax = 0.0

    if inv_num and total > 0:
        confidence = 94.5

    return ExtractedDataSchema(
        vendor_name=vendor,
        customer_name="DocuFlow Client",
        invoice_number=inv_num or "INV-UNKNOWN",
        invoice_date=inv_date or "2026-08-08",
        due_date=due_date or "2026-09-07",
        subtotal=subtotal,
        tax=tax,
        total_amount=total if total > 0 else 1000.0,
        document_type="invoice",
        confidence_score=confidence,
        is_demo_fallback=True
    )

def extract_structured_data_with_ai(raw_text: str) -> ExtractedDataSchema:
    """
    Sends raw text to AI API (Gemini / OpenAI / Custom REST) if AI_API_KEY is configured.
    Falls back to parse_with_rules if no key is configured.
    """
    ai_key = os.getenv("AI_API_KEY", "").strip()

    if not ai_key:
        logger.info("AI_API_KEY is not configured in .env. Using built-in rule-based NLP extraction service.")
        return parse_with_rules(raw_text)

    # Call AI Provider (e.g. Gemini 1.5/2.0 API or OpenAI compatible JSON mode)
    logger.info("Calling configured AI API for structured document extraction...")
    prompt = f"""
You are an expert AI OCR & Invoice Processing engine. Analyze the following document text and return ONLY a valid JSON object matching this schema:
{{
  "vendor_name": "string",
  "customer_name": "string",
  "invoice_number": "string",
  "invoice_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD",
  "subtotal": 0.00,
  "tax": 0.00,
  "total_amount": 0.00,
  "document_type": "invoice",
  "confidence_score": 98.5
}}

DOCUMENT TEXT:
{raw_text[:4000]}
"""

    try:
        # Example Gemini REST endpoint call
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={ai_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, json=payload, headers=headers, timeout=12)
        if response.status_code == 200:
            res_data = response.json()
            raw_json_str = res_data['candidates'][0]['content']['parts'][0]['text']
            parsed_json = json.loads(raw_json_str)

            return ExtractedDataSchema(
                vendor_name=parsed_json.get("vendor_name"),
                customer_name=parsed_json.get("customer_name"),
                invoice_number=parsed_json.get("invoice_number"),
                invoice_date=parsed_json.get("invoice_date"),
                due_date=parsed_json.get("due_date"),
                subtotal=float(parsed_json.get("subtotal", 0.0)),
                tax=float(parsed_json.get("tax", 0.0)),
                total_amount=float(parsed_json.get("total_amount", 0.0)),
                document_type=parsed_json.get("document_type", "invoice"),
                confidence_score=float(parsed_json.get("confidence_score", 95.0)),
                is_demo_fallback=False
            )
        else:
            logger.warning(f"AI API call returned status {response.status_code}. Falling back to rule parser.")
            return parse_with_rules(raw_text)

    except Exception as e:
        logger.error(f"Error calling AI API: {e}. Falling back to rule parser.")
        return parse_with_rules(raw_text)
