"""
Model 6: Demand & Market Pressure Engine.
Estimates market pressure and absorption velocity proxies from arrival volume and price momentum.
Clearly designated as an economic proxy rather than direct measured consumption demand.
"""
from typing import Dict, Any, List

class MarketPressureEngine:
    def __init__(self):
        pass

    def estimate_market_pressure(
        self,
        price_change_pct: float,
        arrival_delta_pct: float
    ) -> Dict[str, Any]:
        # Oversupply pressure: Arrivals rising sharply while prices are dropping
        # Tightness pressure: Arrivals declining while prices are rising
        if arrival_delta_pct < -10.0 and price_change_pct > 2.0:
            pressure_level = "HIGH"
            predicted_demand = "HIGH ↑"
            desc = "Strong off-take demand absorbing reduced mandi arrivals; high seller leverage."
            chart = [
                {"label": "Current Today", "demandIndex": 65},
                {"label": "7 Days", "demandIndex": 78},
                {"label": "15 Days", "demandIndex": 89},
                {"label": "30 Days", "demandIndex": 94}
            ]
        elif arrival_delta_pct > 15.0 and price_change_pct < -3.0:
            pressure_level = "LOW"
            predicted_demand = "MEDIUM"
            desc = "Supply influx exceeding current spot absorption; buyer market dynamics."
            chart = [
                {"label": "Current Today", "demandIndex": 50},
                {"label": "7 Days", "demandIndex": 55},
                {"label": "15 Days", "demandIndex": 60},
                {"label": "30 Days", "demandIndex": 65}
            ]
        else:
            pressure_level = "MEDIUM"
            predicted_demand = "MEDIUM"
            desc = "Balanced mandi absorption with steady wholesale requirements."
            chart = [
                {"label": "Current Today", "demandIndex": 58},
                {"label": "7 Days", "demandIndex": 68},
                {"label": "15 Days", "demandIndex": 76},
                {"label": "30 Days", "demandIndex": 82}
            ]

        return {
            "current_demand_proxy": pressure_level,
            "predicted_demand_proxy": predicted_demand,
            "demand_forecast_chart": chart,
            "recommendation": desc,
            "note": "Derived from arrival absorption and price velocity proxies (Proxy Indicator)."
        }
