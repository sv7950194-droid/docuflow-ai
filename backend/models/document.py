import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from config.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    document_type = Column(String(100), default="invoice")
    
    vendor_name = Column(String(255), nullable=True)
    customer_name = Column(String(255), nullable=True)
    invoice_number = Column(String(100), nullable=True)
    invoice_date = Column(String(50), nullable=True)
    due_date = Column(String(50), nullable=True)
    
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    
    extracted_text = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)
    
    validation_status = Column(String(50), default="PENDING")
    decision = Column(String(50), default="PENDING") # APPROVED, NEEDS_REVIEW, REJECTED
    processing_status = Column(String(50), default="UPLOADED") # UPLOADED, PROCESSING, COMPLETED, FAILED
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
