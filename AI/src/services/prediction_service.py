"""
Prediction Service coordinating PricePredictor, WeatherAnalyzer, and Chart generation.
"""
from typing import Dict, Any
from datetime import datetime, timedelta
from ..models.price_prediction import PricePredictor
from ..models.weather_analysis import WeatherAnalyzer
from ..data.normalize_names import normalize_crop_name, get_grade_multiplier

class PredictionService:
    def __init__(self):
        self.predictors: Dict[str, PricePredictor] = {}
        self.weather_analyzer = WeatherAnalyzer()
        self._load_preloaded_models()

    def _load_preloaded_models(self):
        for crop in ["Tomato", "Potato", "Onion", "Wheat"]:
            p = PricePredictor(commodity=crop)
            if p.load():
                self.predictors[crop.lower()] = p

    def get_prediction(
        self,
        commodity: str,
        variety: str = "Local",
        grade: str = "Grade A",
        state: str = "Gujarat",
        district: str = "Rajkot",
        market: str = "Rajkot",
        quantity: float = 1000.0,
        target_date: str = "",
        prediction_days: int = 7
    ) -> Dict[str, Any]:
        norm_crop = normalize_crop_name(commodity)
        grade_mult = get_grade_multiplier(grade)

        # Baseline prices per crop if not provided
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
        current_price = round(crop_base_prices.get(norm_crop, 26.0) * grade_mult, 1)

        # Predictor instance
        predictor = self.predictors.get(norm_crop.lower())
        if not predictor:
            predictor = PricePredictor(commodity=norm_crop)

        # Weather assessment
        weather_res = self.weather_analyzer.evaluate_weather_impact(district, state, rainfall_mm=12.5, normal_rainfall_mm=5.0)

        # Predict
        res = predictor.predict(
            current_price=current_price,
            arrivals_tonnes=18.0,
            rainfall_mm=weather_res["rainfallMm"]
        )

        # Generate 7-day historical + 7-day predicted chart timeline
        today = datetime.now()
        chart_data = []
        for i in range(-6, 1):
            d_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
            p_val = round(current_price * (1.0 + 0.012 * i), 1)
            chart_data.append({"date": d_str, "price": p_val, "predicted": False})
        for j in range(1, prediction_days + 1):
            d_str = (today + timedelta(days=j)).strftime("%Y-%m-%d")
            prog = j / prediction_days
            p_val = round(current_price + (res["predicted_price"] - current_price) * prog, 1)
            chart_data.append({"date": d_str, "price": p_val, "predicted": True})

        return {
            # CamelCase for ASP.NET Backend
            "currentPrice": res["current_price"],
            "predictedPrice": res["predicted_price"],
            "lowerPrice": res["lower_price"],
            "upperPrice": res["upper_price"],
            "confidence": res["confidence"],
            "trend": res["trend"],
            "recommendation": res["recommendation"],
            "recommendationReason": res["recommendation_reason"],
            "sevenDayAvg": res["seven_day_avg"],
            "fourteenDayAvg": res["fourteen_day_avg"],
            "thirtyDayAvg": res["thirty_day_avg"],
            "volatility": res["volatility"],
            "modelVersion": "1.0.0",
            "weather": {
                "riskLevel": weather_res["riskLevel"],
                "rainfallMm": weather_res["rainfallMm"],
                "deviation": weather_res["deviation"],
                "recommendation": weather_res["recommendation"]
            },
            "chartData": chart_data,
            # Direct aliases
            "current_price": res["current_price"],
            "predicted_price": res["predicted_price"],
            "expected_min": res["lower_price"],
            "expected_max": res["upper_price"]
        }
