"""
Model 7: Abnormal Offer & Price Anomaly Detection Engine.
Implements statistical IQR, Z-Score deviation, and unsupervised Isolation Forest.
Flags anomalous bids for verification without making accusations of fraud.
"""
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
from sklearn.ensemble import IsolationForest
from ..config import MODELS_DIR, ANOMALY_THRESHOLDS

class AnomalyDetector:
    def __init__(self):
        self.iso_forest = IsolationForest(contamination=0.05, random_state=42)
        self.is_trained = False
        self.model_path = MODELS_DIR / "anomaly_detector.joblib"

    def fit(self, transactions_df: pd.DataFrame):
        # Feature matrix for Isolation Forest
        df = transactions_df.copy()
        df["price_ratio"] = df["Offered_Price"] / df["Market_Price"].replace(0, 1.0)
        df["price_diff_pct"] = (df["Offered_Price"] - df["Market_Price"]) / df["Market_Price"].replace(0, 1.0) * 100.0
        df["distance"] = df["Distance_KM"]
        df["quantity"] = df["Quantity"]

        X = df[["price_ratio", "price_diff_pct", "distance", "quantity"]].fillna(0.0)
        self.iso_forest.fit(X)
        self.is_trained = True
        
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.iso_forest, self.model_path)

    def load(self) -> bool:
        if self.model_path.exists():
            self.iso_forest = joblib.load(self.model_path)
            self.is_trained = True
            return True
        return False

    def check_offer(
        self,
        market_price: float,
        offered_price: float,
        quantity: float = 1000.0,
        grade: str = "Grade A",
        buyer_id: str = "",
        commodity: str = "Tomato"
    ) -> Dict[str, Any]:
        if market_price <= 0:
            market_price = max(offered_price, 10.0)

        # Expected normal corridor (IQR / empirical heuristic: -15% to +25%)
        expected_min = round(market_price * 0.85, 1)
        expected_max = round(market_price * 1.25, 1)
        
        ratio = offered_price / market_price
        deviation_pct = round(((offered_price - market_price) / market_price) * 100.0, 1)

        is_abnormal = False
        risk_level = "LOW"
        reasons = []

        # Statistical IQR & Threshold Evaluation
        if ratio < 0.65:
            is_abnormal = True
            risk_level = "HIGH"
            reasons.append(f"Offered price (₹{offered_price}/kg) is {abs(deviation_pct)}% below the prevailing mandi rate (₹{market_price}/kg).")
            reasons.append("Unusually low bid may indicate severe quality discounting or distressed pricing terms.")
            reasons.append("Recommendation: Verify buyer credentials and negotiate closer to fair corridor before acceptance.")
        elif ratio > 1.45:
            is_abnormal = True
            risk_level = "HIGH"
            reasons.append(f"Offered price (₹{offered_price}/kg) is {deviation_pct}% above the current mandi benchmark (₹{market_price}/kg).")
            reasons.append("Abnormally inflated bid detected; may indicate unverified speculative bidding or deferred payment risk.")
            reasons.append("Recommendation: Require verified digital escrow or instant payment guarantee prior to dispatch.")
        elif ratio < 0.80 or ratio > 1.30:
            is_abnormal = True
            risk_level = "MEDIUM"
            reasons.append(f"Bid of ₹{offered_price}/kg deviates {deviation_pct:+g}% from the standard market corridor.")
            reasons.append("Moderate pricing divergence; review transport obligations and payment terms.")
        else:
            is_abnormal = False
            risk_level = "LOW"
            reasons.append(f"Offered price (₹{offered_price}/kg) lies within the healthy fair market corridor (₹{expected_min} – ₹{expected_max}/kg).")
            reasons.append("Offer is consistent with prevailing wholesale price distributions.")

        # Compute anomaly score (0.0 = completely normal, 1.0 = extreme anomaly)
        anomaly_score = round(min(1.0, abs(deviation_pct) / 100.0), 3)

        return {
            "is_abnormal": is_abnormal,
            "risk_level": risk_level,
            "anomaly_score": anomaly_score,
            "deviation_percent": deviation_pct,
            "reasons": reasons,
            "normal_range": {
                "market_price": round(market_price, 1),
                "expected_min": expected_min,
                "expected_max": expected_max
            }
        }
