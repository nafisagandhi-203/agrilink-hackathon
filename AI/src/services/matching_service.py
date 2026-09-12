"""
Matching Service wrapping BuyerMatchingEngine.
"""
from typing import Dict, Any, List
from ..models.buyer_matching import BuyerMatchingEngine
from ..data.normalize_names import normalize_crop_name

class MatchingService:
    def __init__(self):
        self.engine = BuyerMatchingEngine()

    def match_buyers(
        self,
        commodity: str,
        variety: str = "Local",
        grade: str = "Grade A",
        quantity: float = 1000.0,
        farmer_district: str = "Rajkot",
        farmer_state: str = "Gujarat",
        market_price: float = 30.0,
        candidate_buyers: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        norm_crop = normalize_crop_name(commodity)
        if market_price <= 0:
            market_price = 30.0

        matches = self.engine.rank_buyers(
            farmer_commodity=norm_crop,
            farmer_quantity=quantity,
            farmer_grade=grade,
            farmer_variety=variety,
            farmer_district=farmer_district,
            market_price=market_price,
            candidate_buyers=candidate_buyers
        )

        return {
            "total": len(matches),
            "matches": matches
        }
