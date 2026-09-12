from fastapi.testclient import TestClient
from AI.api.main import app
from AI.src.pipeline.daily_retrain import run_daily_ingestion_and_retrain
from AI.src.config import MODELS_DIR

client = TestClient(app)

def test_daily_retrain_pipeline():
    # Test incremental retrain execution for single crop to keep test fast
    res = run_daily_ingestion_and_retrain(crops=["Tomato"])
    assert "last_daily_retrain" in res
    assert "Tomato" in res["results"]
    assert res["results"]["Tomato"]["status"] == "SUCCESS"
    assert (MODELS_DIR / "metadata.json").exists()

def test_admin_api_endpoints():
    # Test GET model-status
    r_status = client.get("/api/ai/admin/model-status")
    assert r_status.status_code == 200
    data = r_status.json()
    assert "last_daily_retrain" in data or "saved_models" in data

    # Test POST trigger-daily-retrain
    r_trigger = client.post("/api/ai/admin/trigger-daily-retrain", json=["Tomato"])
    assert r_trigger.status_code == 200
    assert r_trigger.json()["status"] == "QUEUED"
