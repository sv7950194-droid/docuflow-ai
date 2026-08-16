import logging
import pytesseract
from PIL import Image

logger = logging.getLogger("docuflow.ocr_service")

def extract_text_from_image(image_input) -> str:
    """
    Performs OCR on an image file path or PIL Image object using Tesseract OCR.
    """
    try:
        if isinstance(image_input, str):
            image = Image.open(image_input)
        else:
            image = image_input

        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")

        text = pytesseract.image_to_string(image)
        return text.strip()

    except pytesseract.TesseractNotFoundError:
        logger.warning(
            "Tesseract OCR executable not found on local PATH. "
            "Please install Tesseract OCR (https://github.com/UB-Mannheim/tesseract/wiki) for scanned image OCR."
        )
        return "[OCR Warning: Tesseract binary not installed on host machine. Scanned document text requires Tesseract executable.]"
    except Exception as e:
        logger.error(f"Error during Tesseract OCR extraction: {e}")
        return f"[OCR Error: {e}]"
