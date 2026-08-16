from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    status: str
    message: str

class ExtractedDataSchema(BaseModel):
    vendor_name: Optional[str] = None
    customer_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    subtotal: float = 0.0
    tax: float = 0.0
    total_amount: float = 0.0
    document_type: str = "invoice"
    confidence_score: float = 0.0
    is_demo_fallback: bool = False

class ValidationResultSchema(BaseModel):
    valid: bool
    issues: List[str] = []

class DecisionResultSchema(BaseModel):
    decision: str  # APPROVED, NEEDS_REVIEW, REJECTED
    reason: str

class ProcessedDocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    extracted_data: ExtractedDataSchema
    validation: ValidationResultSchema
    decision: DecisionResultSchema
    processing_status: str
    created_at: datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    document_type: str
    vendor_name: Optional[str] = None
    customer_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    subtotal: float = 0.0
    tax: float = 0.0
    total_amount: float = 0.0
    extracted_text: Optional[str] = None
    confidence_score: float = 0.0
    validation_status: str
    decision: str
    processing_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    total: int
    documents: List[DocumentResponse]
    limit: int
    offset: int

class AnalyticsResponse(BaseModel):
    total_documents: int
    processed_documents: int
    approved_documents: int
    review_documents: int
    rejected_documents: int
    average_confidence: float
    automation_rate: float
