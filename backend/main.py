import os
import datetime
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import Base, engine, SessionLocal
from models import document
from routes import upload, auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("docuflow.main")

# Auto-create Database Tables if they do not exist
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="DocuFlow AI API",
    description="Intelligent Document Processing & Automation System API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(upload.router)
app.include_router(documents.router)
app.include_router(analytics.router)

# Seed initial mock documents if database is completely empty
@app.on_event("startup")
def seed_sample_data():
    db = SessionLocal()
    try:
        count = db.query(Document).count()
        if count == 0:
            logger.info("Database is empty. Seeding initial sample document records for demonstration...")
            samples = [
                Document(
                    filename="AcmeCorp_Invoice_INV-9842.pdf",
                    file_path="backend/uploads/sample_acme.pdf",
                    document_type="pdf",
                    vendor_name="Acme Corporation",
                    customer_name="DocuFlow Corp",
                    invoice_number="INV-9842",
                    invoice_date="2026-08-01",
                    due_date="2026-08-31",
                    subtotal=12500.00,
                    tax=1000.00,
                    total_amount=13500.00,
                    extracted_text="Acme Corporation Invoice INV-9842. Subtotal: $12,500.00, Tax: $1,000.00, Total: $13,500.00.",
                    confidence_score=98.8,
                    validation_status="PASSED",
                    decision="APPROVED",
                    processing_status="COMPLETED"
                ),
                Document(
                    filename="TechLogistics_Freight_TL-401.pdf",
                    file_path="backend/uploads/sample_freight.pdf",
                    document_type="pdf",
                    vendor_name="Global Tech Logistics",
                    customer_name="DocuFlow Corp",
                    invoice_number="TL-401",
                    invoice_date="2026-08-05",
                    due_date="2026-08-20",
                    subtotal=4200.50,
                    tax=336.04,
                    total_amount=4536.54,
                    extracted_text="Global Tech Logistics Invoice TL-401. Freight forwarding charges total $4,536.54.",
                    confidence_score=84.2,
                    validation_status="WARNINGS",
                    decision="NEEDS_REVIEW",
                    processing_status="COMPLETED"
                ),
                Document(
                    filename="CyberShield_Security_Renewal.png",
                    file_path="backend/uploads/sample_cybershield.png",
                    document_type="image",
                    vendor_name="CyberShield Inc",
                    customer_name="DocuFlow Corp",
                    invoice_number="CS-9912",
                    invoice_date="2026-08-01",
                    due_date="2026-09-01",
                    subtotal=8900.00,
                    tax=712.00,
                    total_amount=9612.00,
                    extracted_text="CyberShield Inc SOC2 Compliance License Renewal. Total: $9,612.00.",
                    confidence_score=97.4,
                    validation_status="PASSED",
                    decision="APPROVED",
                    processing_status="COMPLETED"
                )
            ]
            db.add_all(samples)
            db.commit()
    except Exception as e:
        logger.warning(f"Failed to seed initial sample records: {e}")
    finally:
        db.close()

@app.get("/", summary="Root Health Check Endpoint")
def root():
    return {"message": "DocuFlow AI Backend is running"}
