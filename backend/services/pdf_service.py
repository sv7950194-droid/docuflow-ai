import logging
import pymupdf  # PyMuPDF
from PIL import Image
import io
from backend.services.ocr_service import extract_text_from_image

logger = logging.getLogger("docuflow.pdf_service")

def extract_text_from_pdf(file_path: str) -> tuple[str, bool]:
    """
    Extracts text from PDF using PyMuPDF (pymupdf).
    If direct text extraction produces minimal content, converts PDF pages to images for OCR.
    Returns (extracted_text, is_scanned)
    """
    try:
        doc = pymupdf.open(file_path)
        full_text = ""

        for page in doc:
            full_text += page.get_text() + "\n"

        clean_text = full_text.strip()

        # If selectable text exists
        if len(clean_text) >= 30:
            logger.info("Successfully extracted selectable text directly from PDF.")
            return clean_text, False

        # Otherwise, treat as scanned PDF and run OCR on page images
        logger.info("PDF contains minimal selectable text (< 30 chars). Converting pages to images for Tesseract OCR...")
        ocr_text = ""
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_bytes))
            page_text = extract_text_from_image(image)
            ocr_text += f"\n--- Page {i+1} OCR ---\n" + page_text

        return ocr_text.strip(), True

    except Exception as e:
        logger.error(f"Error during PDF text extraction: {e}")
        raise RuntimeError(f"Failed to process PDF file: {e}")
