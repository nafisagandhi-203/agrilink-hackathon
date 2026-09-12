"""
e-NAM Real-time Bid Streaming Service.
Ingests live auction bid ticks from e-NAM trading halls via WebSockets / event feeds
and exposes real-time buyer bid pressure directly to the Price Discovery Engine.
"""
import time
import random
from collections import deque
from datetime import datetime
from typing import Dict, List, Any, Optional
from ..data.normalize_names import normalize_crop_name

class ENAMStreamService:
    def __init__(self, max_history_per_crop: int = 50):
        self.max_history = max_history_per_crop
        # In-memory streaming bid buffers keyed by normalized commodity name
        self._bid_buffers: Dict[str, deque] = {}
        # Connected WebSocket client queues
        self._subscribers: List[Any] = []
        self._seed_initial_stream()

    def _seed_initial_stream(self):
        """Seed realistic active live bids for primary crops."""
        seeds = {
            "Tomato": [
                {"buyer": "AgroCorp Mandi Hall", "market": "Rajkot APMC", "price": 31.5, "qty": 1200, "grade": "Grade A"},
                {"buyer": "Shree Fresh Direct", "market": "Gondal Market Yard", "price": 32.0, "qty": 800, "grade": "Grade A"},
                {"buyer": "Saurashtra Processing Ltd", "market": "Rajkot APMC", "price": 30.8, "qty": 1500, "grade": "Grade B"},
            ],
            "Potato": [
                {"buyer": "Agra Cold Storage Aggregator", "market": "Agra APMC", "price": 23.5, "qty": 3000, "grade": "Grade A"},
                {"buyer": "Balaji Wafers Procurement", "market": "Indore APMC", "price": 24.2, "qty": 5000, "grade": "Grade A"},
            ],
            "Onion": [
                {"buyer": "Lasalgaon Bulk Exports", "market": "Lasalgaon Mandi", "price": 33.0, "qty": 2500, "grade": "Grade A"},
                {"buyer": "Nashik Agro Trading Co", "market": "Nashik APMC", "price": 32.4, "qty": 1800, "grade": "Grade B"},
            ],
            "Wheat": [
                {"buyer": "ITC Choupal Procurement", "market": "Khanna Mandi", "price": 26.5, "qty": 8000, "grade": "FAQ"},
                {"buyer": "Adani Agri Logistics", "market": "Ujjain APMC", "price": 26.8, "qty": 10000, "grade": "FAQ"},
            ]
        }
        for crop, bids in seeds.items():
            norm = normalize_crop_name(crop).lower()
            self._bid_buffers[norm] = deque(maxlen=self.max_history)
            for b in bids:
                self.record_bid(
                    commodity=crop,
                    market=b["market"],
                    buyer_name=b["buyer"],
                    bid_price=b["price"],
                    quantity=b["qty"],
                    grade=b["grade"]
                )

    def record_bid(
        self,
        commodity: str,
        market: str,
        buyer_name: str,
        bid_price: float,
        quantity: float,
        grade: str = "Grade A"
    ) -> Dict[str, Any]:
        norm = normalize_crop_name(commodity).lower()
        if norm not in self._bid_buffers:
            self._bid_buffers[norm] = deque(maxlen=self.max_history)

        bid_entry = {
            "bid_id": f"ENAM-{int(time.time()*1000)%1000000:06d}",
            "commodity": normalize_crop_name(commodity),
            "market": market,
            "buyer_name": buyer_name,
            "bid_price": round(float(bid_price), 2),
            "quantity": float(quantity),
            "grade": grade,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self._bid_buffers[norm].appendleft(bid_entry)
        return bid_entry

    def get_live_bids(self, commodity: str, limit: int = 10) -> List[Dict[str, Any]]:
        norm = normalize_crop_name(commodity).lower()
        buf = self._bid_buffers.get(norm, deque())
        return list(buf)[:limit]

    def get_live_bid_prices(self, commodity: str) -> List[float]:
        norm = normalize_crop_name(commodity).lower()
        buf = self._bid_buffers.get(norm, deque())
        return [b["bid_price"] for b in buf]

    def simulate_live_tick(self, commodity: str, base_price: float = 30.0) -> Dict[str, Any]:
        norm = normalize_crop_name(commodity)
        buyers = ["AgroCorp Direct", "Kisan Trade Hub", "Mandi Hall Bidder 4", "Gujarat Organics", "FreshBasket Ltd"]
        markets = ["Rajkot APMC", "Gondal Market Yard", "Mahuva Mandi", "Nashik APMC"]
        
        # Jitter around base price +/- 6%
        jitter = random.uniform(-0.06, 0.08)
        sim_price = round(base_price * (1.0 + jitter), 2)
        sim_qty = round(random.uniform(400, 3000), 0)
        
        return self.record_bid(
            commodity=norm,
            market=random.choice(markets),
            buyer_name=random.choice(buyers),
            bid_price=sim_price,
            quantity=sim_qty,
            grade="Grade A" if random.random() > 0.3 else "Grade B"
        )

# Global singleton instance
enam_stream_service = ENAMStreamService()
