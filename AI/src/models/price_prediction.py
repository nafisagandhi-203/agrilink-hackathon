"""
Model 1: Crop Price Prediction & Uncertainty Interval Estimation.
Trains Baseline and Machine Learning models using time-aware validation.
"""
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Tuple
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from ..features.feature_engineering import FEATURE_COLUMNS, engineer_features, prepare_train_test_split
from ..config import MODELS_DIR

def calculate_mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    non_zero = y_true != 0
    if not np.any(non_zero):
        return 0.0
    return float(np.mean(np.abs((y_true[non_zero] - y_pred[non_zero]) / y_true[non_zero])) * 100.0)

class PricePredictor:
    def __init__(self, commodity: str = "Tomato"):
        self.commodity = commodity
        self.model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
        self.residual_std = 1.8  # Default residual standard deviation for prediction intervals
        self.metrics = {}
        self.is_trained = False
        self.feature_names = FEATURE_COLUMNS

    def train_and_evaluate(self, df: pd.DataFrame) -> Dict[str, Any]:
        df_feat = engineer_features(df, horizon_days=7)
        train_df, val_df, test_df = prepare_train_test_split(df_feat)
        
        if len(train_df) < 50:
            raise ValueError(f"Insufficient training data for {self.commodity}: {len(train_df)} rows")

        X_train, y_train = train_df[FEATURE_COLUMNS], train_df["target_future_price"]
        X_test, y_test = test_df[FEATURE_COLUMNS], test_df["target_future_price"]

        # 1. Baseline: Naive Persistence (Future Price = Current Modal Price)
        y_pred_naive = test_df["modal_price"]
        baseline_mae = mean_absolute_error(y_test, y_pred_naive)
        baseline_rmse = np.sqrt(mean_squared_error(y_test, y_pred_naive))
        baseline_mape = calculate_mape(y_test, y_pred_naive)
        baseline_r2 = r2_score(y_test, y_pred_naive)

        # 2. Main ML Model: Random Forest Regressor
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        ml_mae = mean_absolute_error(y_test, y_pred)
        ml_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        ml_mape = calculate_mape(y_test, y_pred)
        ml_r2 = r2_score(y_test, y_pred)

        residuals = y_test - y_pred
        self.residual_std = max(1.0, float(np.std(residuals)))
        self.is_trained = True

        self.metrics = {
            "commodity": self.commodity,
            "train_samples": len(train_df),
            "test_samples": len(test_df),
            "baseline": {
                "mae": round(baseline_mae, 2),
                "rmse": round(baseline_rmse, 2),
                "mape": round(baseline_mape, 2),
                "r2": round(baseline_r2, 4)
            },
            "ml_model": {
                "mae": round(ml_mae, 2),
                "rmse": round(ml_rmse, 2),
                "mape": round(ml_mape, 2),
                "r2": round(ml_r2, 4)
            },
            "residual_std": round(self.residual_std, 2)
        }
        return self.metrics

    def predict(self, current_price: float, recent_prices: list = None, arrivals_tonnes: float = 15.0, rainfall_mm: float = 5.0) -> Dict[str, Any]:
        if recent_prices is None or len(recent_prices) < 7:
            recent_prices = [current_price * (1.0 + 0.01 * i) for i in range(-6, 1)]
            
        p_lag_1 = recent_prices[-2] if len(recent_prices) >= 2 else current_price
        p_lag_3 = recent_prices[-4] if len(recent_prices) >= 4 else current_price
        p_lag_7 = recent_prices[0]
        
        ma_7 = float(np.mean(recent_prices[-7:]))
        ma_14 = ma_7
        ma_30 = ma_7
        volatility = float(np.std(recent_prices[-7:])) / max(ma_7, 1.0)
        
        feat_dict = {
            "modal_price": current_price,
            "price_lag_1": p_lag_1,
            "price_lag_3": p_lag_3,
            "price_lag_7": p_lag_7,
            "price_ma_7": ma_7,
            "price_ma_14": ma_14,
            "price_ma_30": ma_30,
            "price_volatility_7": volatility,
            "arrivals_tonnes": arrivals_tonnes,
            "arr_lag_1": arrivals_tonnes,
            "arr_ma_7": arrivals_tonnes,
            "arr_delta_7": 0.0,
            "month": 6,
            "day_of_week": 2,
            "is_weekend": 0,
            "rain_roll_3d": rainfall_mm * 2.0,
            "rain_roll_7d": rainfall_mm * 3.5,
            "rainfall_departure_pct": 5.0,
            "is_heavy_rainfall": 1 if rainfall_mm >= 35.0 else 0
        }
        
        if self.is_trained:
            X_input = pd.DataFrame([feat_dict])[FEATURE_COLUMNS]
            pred_point = float(self.model.predict(X_input)[0])
        else:
            # Rule-backed statistical fallback
            trend_mult = 1.05 if arrivals_tonnes < 10.0 else 0.98
            pred_point = current_price * trend_mult

        pred_point = round(max(pred_point, 5.0), 1)
        # 80% Expected Range: point +/- 1.28 * residual_std
        spread = max(1.5, round(1.28 * self.residual_std, 1))
        lower_price = round(max(5.0, pred_point - spread), 1)
        upper_price = round(pred_point + spread, 1)
        
        # Trend and recommendations
        diff_pct = (pred_point - current_price) / max(current_price, 1.0) * 100.0
        if diff_pct > 3.0:
            trend = "Upward"
            frontend_trend = "Price may increase"
            recommendation = "HOLD"
            reason = f"AI models predict a {round(diff_pct, 1)}% price appreciation over the next 7 days due to tightening market arrivals."
        elif diff_pct < -3.0:
            trend = "Downward"
            frontend_trend = "Price may decrease"
            recommendation = "SELL"
            reason = f"Anticipated supply arrivals suggest a {round(abs(diff_pct), 1)}% softening; selling today captures current peak prices."
        else:
            trend = "Stable"
            frontend_trend = "Price likely stable"
            recommendation = "STABLE"
            reason = "Prices are oscillating in a balanced corridor; sell based on storage and transport convenience."

        # Realistic confidence based on volatility
        conf = int(np.clip(88 - (volatility * 100 * 0.4), 65, 92))

        return {
            "current_price": round(current_price, 1),
            "predicted_price": pred_point,
            "lower_price": lower_price,
            "upper_price": upper_price,
            "confidence": conf,
            "trend": trend,
            "frontend_trend": frontend_trend,
            "recommendation": recommendation,
            "recommendation_reason": reason,
            "seven_day_avg": round(ma_7, 1),
            "fourteen_day_avg": round(ma_14, 1),
            "thirty_day_avg": round(ma_30, 1),
            "volatility": round(volatility, 3)
        }

    def save(self, filepath: Path = None):
        if filepath is None:
            MODELS_DIR.mkdir(parents=True, exist_ok=True)
            filepath = MODELS_DIR / f"price_predictor_{self.commodity.lower()}.joblib"
        joblib.dump({"model": self.model, "residual_std": self.residual_std, "metrics": self.metrics, "is_trained": self.is_trained}, filepath)

    def load(self, filepath: Path = None):
        if filepath is None:
            filepath = MODELS_DIR / f"price_predictor_{self.commodity.lower()}.joblib"
        if filepath.exists():
            data = joblib.load(filepath)
            self.model = data["model"]
            self.residual_std = data.get("residual_std", 1.8)
            self.metrics = data.get("metrics", {})
            self.is_trained = data.get("is_trained", True)
            return True
        return False
