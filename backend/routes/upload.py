import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.config.database import get_db
from backend.models.document import Document
from backend.schemas.document import DocumentUploadResponse
from backend.services.file_service import validate_and_save_file

router = APIRouter(prefix="/api/documents", tags=["Upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "backend/uploads")

@router.post("/upload", response_model=DocumentUploadResponse, summary="Upload a new document (PDF, PNG, JPG, JPEG)")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Uploads a document, validates file type and size limit, saves file securely, 
    and creates an initial database record.
    """
    unique_filename, file_path, ext = validate_and_save_file(file, UPLOAD_DIR)

    # Determine document_type
    doc_type = "pdf" if ext == ".pdf" else "image"

    db_doc = Document(
        filename=file.filename or unique_filename,
        file_path=file_path,
        document_type=doc_type,
        processing_status="UPLOADED"
    )
    
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)

    return DocumentUploadResponse(
        id=db_doc.id,
        filename=db_doc.filename,
        status=db_doc.processing_status,
        message="Document uploaded successfully and queued for processing."
    )
