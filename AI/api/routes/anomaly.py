"""
Anomaly Detection API Router.
"""
from fastapi import APIRouter
from ..schemas import AnomalyCheckRequest, AnomalyCheckResponse
from ...src.services.anomaly_service import AnomalyService

router = APIRouter(tags=["Anomaly Detection"])
anomaly_service = AnomalyService()

@router.post("/api/ai/check-offer", response_model=AnomalyCheckResponse)
@router.post("/detect-anomaly", response_model=AnomalyCheckResponse)
def check_offer_anomaly(request: AnomalyCheckRequest):
    result = anomaly_service.check_offer(
        market_price=request.market_price,
        offered_price=request.offered_price,
        quantity=request.quantity or 1000.0,
        grade=request.grade or "Grade A",
        buyer_id=request.buyer_id or "",
        commodity=request.commodity or "Tomato"
    )
    return result
