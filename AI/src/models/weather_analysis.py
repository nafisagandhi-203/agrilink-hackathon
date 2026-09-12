"""
Model 5: Weather & Rainfall Advisory Engine.
Evaluates district IMD rainfall deviations and delivers crop preservation & storage advice.
"""
from typing import Dict, Any
from ..features.weather_features import get_weather_risk_assessment

class WeatherAnalyzer:
    def __init__(self):
        pass

    def evaluate_weather_impact(
        self,
        district: str,
        state: str,
        rainfall_mm: float = 0.0,
        normal_rainfall_mm: float = 5.0
    ) -> Dict[str, Any]:
        departure_pct = 0.0
        if normal_rainfall_mm > 0:
            departure_pct = round(((rainfall_mm - normal_rainfall_mm) / normal_rainfall_mm) * 100.0, 1)
            
        assessment = get_weather_risk_assessment(rainfall_mm, departure_pct)
        assessment["rainfallMm"] = round(rainfall_mm, 1)
        assessment["deviation"] = departure_pct
        assessment["district"] = district
        assessment["state"] = state
        return assessment
