"""
Admin and Operations API Router for Model Retraining and Health Telemetry.
"""
import json
from fastapi import APIRouter, BackgroundTasks
from pathlib import Path
from typing import Dict, Any, List, Optional
from ...src.pipeline.daily_retrain import run_daily_ingestion_and_retrain
from ...src.config import MODELS_DIR

router = APIRouter(prefix="/api/ai/admin", tags=["Admin & Pipeline Operations"])

@router.get("/model-status")
def get_model_status():
    metadata_file = MODELS_DIR / "metadata.json"
    if metadata_file.exists():
        with open(metadata_file, "r", encoding="utf-8") as fp:
            return json.load(fp)
    return {
        "status": "No metadata found; initial models active",
        "saved_models": [f.name for f in MODELS_DIR.glob("*.joblib")]
    }

@router.post("/trigger-daily-retrain")
def trigger_daily_retrain(background_tasks: BackgroundTasks, crops: Optional[List[str]] = None):
    # Execute retraining in background to avoid blocking API requests
    background_tasks.add_task(run_daily_ingestion_and_retrain, crops)
    return {
        "status": "QUEUED",
        "message": "Scheduled daily retraining job has been dispatched in the background.",
        "crops": crops or ["Tomato", "Potato", "Onion", "Wheat"]
    }
