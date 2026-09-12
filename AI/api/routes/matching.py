"""
Buyer Matching API Router.
"""
from fastapi import APIRouter
from ..schemas import BuyerMatchingRequest, BuyerMatchingResponse
from ...src.services.matching_service import MatchingService

router = APIRouter(tags=["Buyer Matching"])
matching_service = MatchingService()

@router.post("/api/ai/buyer-matching", response_model=BuyerMatchingResponse)
@router.post("/match-buyers", response_model=BuyerMatchingResponse)
def match_buyers(request: BuyerMatchingRequest):
    result = matching_service.match_buyers(
        commodity=request.commodity,
        variety=request.variety or "Local",
        grade=request.grade or "Grade A",
        quantity=request.quantity or 1000.0,
        farmer_district=request.farmer_district or "Rajkot",
        farmer_state=request.farmer_state or "Gujarat",
        market_price=request.market_price or 30.0
    )
    return result
