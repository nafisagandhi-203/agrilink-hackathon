"""
Anomaly Service wrapping AnomalyDetector.
"""
from typing import Dict, Any
from ..models.anomaly_detection import AnomalyDetector
from ..data.normalize_names import normalize_crop_name

class AnomalyService:
    def __init__(self):
        self.detector = AnomalyDetector()
        self.detector.load()

    def check_offer(
        self,
        market_price: float,
        offered_price: float,
        quantity: float = 1000.0,
        grade: str = "Grade A",
        buyer_id: str = "",
        commodity: str = "Tomato"
    ) -> Dict[str, Any]:
        norm_crop = normalize_crop_name(commodity)
        return self.detector.check_offer(
            market_price=market_price,
            offered_price=offered_price,
            quantity=quantity,
            grade=grade,
            buyer_id=buyer_id,
            commodity=norm_crop
        )
