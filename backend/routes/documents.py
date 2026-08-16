import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.config.database import get_db
from backend.models.document import Document
from backend.schemas.document import (
    ProcessedDocumentResponse, 
    DocumentResponse, 
    DocumentListResponse,
    ExtractedDataSchema,
    ValidationResultSchema,
    DecisionResultSchema
)
from backend.services.pdf_service import extract_text_from_pdf
from backend.services.ocr_service import extract_text_from_image
from backend.services.ai_service import extract_structured_data_with_ai
from backend.services.validation_service import validate_extracted_data
from backend.services.decision_service import make_intelligent_decision

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/{document_id}/process", response_model=ProcessedDocumentResponse, summary="Process an uploaded document through the AI pipeline")
def process_document(document_id: int, db: Session = Depends(get_db)):
    """
    Executes complete document processing pipeline:
    Text Extraction ➔ OCR ➔ AI Extraction ➔ Validation ➔ Intelligent Decision ➔ DB Save
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document with ID {document_id} not found.")

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=400, detail=f"Physical file missing at {doc.file_path}.")

    doc.processing_status = "PROCESSING"
    db.commit()

    try:
        # Step 1: Text Extraction & OCR
        ext = os.path.splitext(doc.file_path)[1].lower()
        if ext == ".pdf":
            raw_text, is_scanned = extract_text_from_pdf(doc.file_path)
        else:
            raw_text = extract_text_from_image(doc.file_path)

        # Step 2: AI Structured Extraction
        extracted_data: ExtractedDataSchema = extract_structured_data_with_ai(raw_text)

        # Step 3: Business Validation Audit
        validation_result: ValidationResultSchema = validate_extracted_data(extracted_data)

        # Step 4: Intelligent Risk Engine Decision
        decision_result: DecisionResultSchema = make_intelligent_decision(extracted_data, validation_result)

        # Step 5: Save Results to MySQL Database Record
        doc.vendor_name = extracted_data.vendor_name
        doc.customer_name = extracted_data.customer_name
        doc.invoice_number = extracted_data.invoice_number
        doc.invoice_date = extracted_data.invoice_date
        doc.due_date = extracted_data.due_date
        doc.subtotal = extracted_data.subtotal
        doc.tax = extracted_data.tax
        doc.total_amount = extracted_data.total_amount
        doc.extracted_text = raw_text[:5000] # Store preview
        doc.confidence_score = extracted_data.confidence_score
        doc.validation_status = "PASSED" if validation_result.valid else "WARNINGS"
        doc.decision = decision_result.decision
        doc.processing_status = "COMPLETED"

        db.commit()
        db.refresh(doc)

        return ProcessedDocumentResponse(
            id=doc.id,
            filename=doc.filename,
            document_type=doc.document_type,
            extracted_data=extracted_data,
            validation=validation_result,
            decision=decision_result,
            processing_status=doc.processing_status,
            created_at=doc.created_at
        )

    except Exception as e:
        doc.processing_status = "FAILED"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@router.get("/{document_id}", response_model=DocumentResponse, summary="Get details of a single document")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document with ID {document_id} not found.")
    return doc

@router.get("", response_model=DocumentListResponse, summary="List processed documents with search and filters")
def list_documents(
    search: Optional[str] = Query(None, description="Search by filename, vendor, or invoice number"),
    status: Optional[str] = Query(None, description="Filter by decision status (APPROVED, NEEDS_REVIEW, REJECTED)"),
    document_type: Optional[str] = Query(None, description="Filter by document type (pdf, image)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Document)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Document.filename.ilike(search_pattern),
                Document.vendor_name.ilike(search_pattern),
                Document.invoice_number.ilike(search_pattern)
            )
        )

    if status:
        query = query.filter(Document.decision == status)

    if document_type:
        query = query.filter(Document.document_type == document_type)

    total = query.count()
    documents = query.order_by(Document.created_at.desc()).offset(offset).limit(limit).all()

    return DocumentListResponse(
        total=total,
        documents=documents,
        limit=limit,
        offset=offset
    )
