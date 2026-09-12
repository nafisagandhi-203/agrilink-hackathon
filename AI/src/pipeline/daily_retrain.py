"""
Automated Daily Mandi Ingestion & Model Retraining Pipeline.
Ingests fresh Agmarknet market updates, refits models incrementally, and persists updated weights & metadata.
"""
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from ..config import MODELS_DIR, REPORTS_DIR
from ..data.load_data import load_crop_mandi_data
from ..models.price_prediction import PricePredictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("DailyRetrain")

def run_daily_ingestion_and_retrain(crops: List[str] = None) -> Dict[str, Any]:
    if crops is None:
        crops = ["Tomato", "Potato", "Onion", "Wheat"]

    logger.info(f"Starting scheduled daily retraining for commodities: {crops}")
    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    results = {}

    for crop in crops:
        try:
            logger.info(f"Ingesting latest Agmarknet observations for {crop}...")
            df = load_crop_mandi_data(commodity=crop, max_records=20000)
            if df.empty or len(df) < 50:
                logger.warning(f"Insufficient records to retrain {crop}; skipping.")
                continue

            logger.info(f"Fitting updated regressor for {crop} on {len(df)} records...")
            predictor = PricePredictor(commodity=crop)
            metrics = predictor.train_and_evaluate(df)
            predictor.save()

            results[crop] = {
                "status": "SUCCESS",
                "samples": len(df),
                "baseline_mae": metrics["baseline"]["mae"],
                "ml_mae": metrics["ml_model"]["mae"],
                "r2": metrics["ml_model"]["r2"],
                "last_retrained": timestamp_str
            }
            logger.info(f"Successfully retrained {crop}: MAE={metrics['ml_model']['mae']} (vs Baseline={metrics['baseline']['mae']})")
        except Exception as e:
            logger.error(f"Retraining failed for {crop}: {e}")
            results[crop] = {"status": "FAILED", "error": str(e), "timestamp": timestamp_str}

    # Save execution metadata to AI/models/saved/metadata.json
    metadata_file = MODELS_DIR / "metadata.json"
    meta_payload = {
        "last_daily_retrain": timestamp_str,
        "pipeline_version": "1.1.0",
        "results": results
    }
    with open(metadata_file, "w", encoding="utf-8") as fp:
        json.dump(meta_payload, fp, indent=2)

    logger.info(f"Updated model metadata saved to {metadata_file}")
    return meta_payload

if __name__ == "__main__":
    run_daily_ingestion_and_retrain()
