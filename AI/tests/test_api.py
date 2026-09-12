from fastapi.testclient import TestClient
from AI.api.main import app

client = TestClient(app)

def test_health_endpoints():
    r1 = client.get("/api/ai/health")
    assert r1.status_code == 200
    assert r1.json()["aiServiceHealthy"] is True

    r2 = client.get("/health")
    assert r2.status_code == 200

def test_price_prediction_endpoint():
    payload = {
        "commodity": "Tomato",
        "variety": "Local",
        "grade": "Grade A",
        "state": "Gujarat",
        "district": "Rajkot",
        "market": "Rajkot",
        "quantity": 1000.0
    }
    res = client.post("/api/ai/price-prediction", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predictedPrice" in data
    assert "currentPrice" in data
    assert "lowerPrice" in data
    assert "upperPrice" in data
    assert "chartData" in data
    assert len(data["chartData"]) > 0

def test_price_discovery_endpoint():
    payload = {
        "commodity": "Onion",
        "variety": "Red",
        "grade": "Grade A",
        "state": "Maharashtra",
        "district": "Nashik",
        "market": "Nashik",
        "quantity": 1500.0
    }
    res = client.post("/api/ai/price-discovery", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "fair_price" in data
    assert "market_comparisons" in data
    assert len(data["market_comparisons"]) > 0

def test_buyer_matching_endpoint():
    payload = {
        "commodity": "Potato",
        "variety": "Jyoti",
        "grade": "Grade A",
        "quantity": 2000.0,
        "farmer_district": "Agra",
        "farmer_state": "Uttar Pradesh",
        "market_price": 22.0
    }
    res = client.post("/api/ai/buyer-matching", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] > 0
    assert len(data["matches"]) > 0
    assert data["matches"][0]["match_score"] >= data["matches"][-1]["match_score"]

def test_anomaly_check_endpoint():
    # Test suspicious offer
    payload = {
        "commodity": "Tomato",
        "market_price": 30.0,
        "offered_price": 12.0,
        "quantity": 1000.0
    }
    res = client.post("/api/ai/check-offer", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_abnormal"] is True
    assert data["risk_level"] == "HIGH"
