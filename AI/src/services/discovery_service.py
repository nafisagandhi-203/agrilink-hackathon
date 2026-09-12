"""
Discovery Service wrapping PriceDiscoveryEngine with Real-Time e-NAM Bid Streaming Integration.
"""
from typing import Dict, Any, List
from ..models.price_discovery import PriceDiscoveryEngine
from ..data.normalize_names import normalize_crop_name
from .enam_stream_service import enam_stream_service

class DiscoveryService:
    def __init__(self):
        self.engine = PriceDiscoveryEngine()

    def discover_price(
        self,
        commodity: str,
        variety: str = "Local",
        grade: str = "Grade A",
        state: str = "Gujarat",
        district: str = "Rajkot",
        market: str = "Rajkot",
        quantity: float = 1000.0,
        active_buyer_offers: List[float] = None
    ) -> Dict[str, Any]:
        norm_crop = normalize_crop_name(commodity)
        crop_base_prices = {
            "Tomato": 28.0,
            "Potato": 22.0,
            "Onion": 30.0,
            "Wheat": 25.0,
            "Rice": 36.0,
            "Cotton": 72.0,
            "Mustard": 54.0,
            "Soyabean": 46.0
        }
        base_p = crop_base_prices.get(norm_crop, 26.0)

        # Connect to live e-NAM stream if no explicit manual bids passed
        live_bids = []
        if not active_buyer_offers:
            live_bids = enam_stream_service.get_live_bid_prices(norm_crop)
            if live_bids:
                active_buyer_offers = live_bids

        result = self.engine.discover_fair_price(
            commodity=norm_crop,
            base_market_price=base_p,
            grade=grade,
            variety=variety,
            market=market,
            district=district,
            quantity=quantity,
            active_buyer_offers=active_buyer_offers
        )

        if live_bids:
            result["explanation"].append(
                f"Dynamic Stream: Ingested {len(live_bids)} real-time electronic bids from e-NAM trading halls into price discovery."
            )
            result["enam_live_stream_active"] = True
            result["latest_enam_bids"] = enam_stream_service.get_live_bids(norm_crop, limit=3)
        else:
            result["enam_live_stream_active"] = False

        return result
