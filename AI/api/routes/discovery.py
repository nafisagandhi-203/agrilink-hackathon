"""
Price Discovery API Router.
"""
from fastapi import APIRouter
from ..schemas import PriceDiscoveryRequest, PriceDiscoveryResponse
from ...src.services.discovery_service import DiscoveryService

router = APIRouter(tags=["Price Discovery"])
discovery_service = DiscoveryService()

@router.post("/api/ai/price-discovery", response_model=PriceDiscoveryResponse)
@router.post("/price-discovery", response_model=PriceDiscoveryResponse)
def discover_price(request: PriceDiscoveryRequest):
    result = discovery_service.discover_price(
        commodity=request.commodity,
        variety=request.variety or "Local",
        grade=request.grade or "Grade A",
        state=request.state or "Gujarat",
        district=request.district or "Rajkot",
        market=request.market or "Rajkot",
        quantity=request.quantity or 1000.0
    )
    return result
