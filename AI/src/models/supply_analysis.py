"""
Model 4: Supply & Market Arrival Analysis Engine.
Analyzes commodity arrival volume, week-over-week trends, and supply surge/tightness.
"""
import numpy as np
from typing import Dict, Any, List

class SupplyAnalyzer:
    def __init__(self):
        pass

    def analyze_supply(
        self,
        current_arrival_tonnes: float,
        recent_arrivals: List[float] = None
    ) -> Dict[str, Any]:
        if not recent_arrivals or len(recent_arrivals) < 7:
            # Baseline window if telemetry is short
            recent_arrivals = [current_arrival_tonnes * (1.0 + 0.05 * (i - 3)) for i in range(7)]

        seven_day_avg = float(np.mean(recent_arrivals[-7:]))
        arrival_delta_pct = round(((current_arrival_tonnes - seven_day_avg) / max(seven_day_avg, 1.0)) * 100.0, 1)

        if arrival_delta_pct > 25.0:
            supply_state = "SURGE"
            interpretation = "Heavy mandi arrivals influx (supply surge); spot prices may experience downward pressure."
        elif arrival_delta_pct < -20.0:
            supply_state = "TIGHT"
            interpretation = "Arrival volumes are restricted (tight supply); spot prices likely to firm up."
        else:
            supply_state = "NORMAL"
            interpretation = "Arrival flow is consistent with seasonal averages; market equilibrium steady."

        return {
            "current_arrival_tonnes": round(current_arrival_tonnes, 1),
            "seven_day_avg_tonnes": round(seven_day_avg, 1),
            "arrival_delta_pct": arrival_delta_pct,
            "supply_state": supply_state,
            "interpretation": interpretation
        }
