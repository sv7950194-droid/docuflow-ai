import os
import uuid
import re
from fastapi import UploadFile, HTTPException

ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

def validate_and_save_file(file: UploadFile, upload_dir: str) -> tuple[str, str, str]:
    """
    Validates file format, size, and saves securely.
    Returns (filename, relative_file_path, file_extension)
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename provided.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{ext}'. Allowed extensions: PDF, JPG, JPEG, PNG."
        )

    # Read bytes to verify file size
    file_bytes = file.file.read()
    file_size = len(file_bytes)
    file.file.seek(0) # Reset file cursor

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 25MB.")

    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate clean safe unique filename using standard regex
    clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', file.filename)
    unique_filename = f"{uuid.uuid4().hex[:8]}_{clean_name}"
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    return unique_filename, file_path, ext
