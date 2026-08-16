from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.config.database import get_db
from backend.models.document import Document
from backend.schemas.document import AnalyticsResponse

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("", response_model=AnalyticsResponse, summary="Get document processing system metrics")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(func.count(Document.id)).scalar() or 0
    processed = db.query(func.count(Document.id)).filter(Document.processing_status == "COMPLETED").scalar() or 0
    approved = db.query(func.count(Document.id)).filter(Document.decision == "APPROVED").scalar() or 0
    review = db.query(func.count(Document.id)).filter(Document.decision == "NEEDS_REVIEW").scalar() or 0
    rejected = db.query(func.count(Document.id)).filter(Document.decision == "REJECTED").scalar() or 0

    avg_confidence = db.query(func.avg(Document.confidence_score)).filter(Document.processing_status == "COMPLETED").scalar() or 0.0
    avg_confidence = round(float(avg_confidence), 2)

    automation_rate = round((approved / total * 100), 1) if total > 0 else 0.0

    return AnalyticsResponse(
        total_documents=total,
        processed_documents=processed,
        approved_documents=approved,
        review_documents=review,
        rejected_documents=rejected,
        average_confidence=avg_confidence,
        automation_rate=automation_rate
    )
