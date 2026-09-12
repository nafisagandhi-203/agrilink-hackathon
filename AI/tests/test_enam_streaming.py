from fastapi.testclient import TestClient
from AI.api.main import app
from AI.src.services.enam_stream_service import enam_stream_service
from AI.src.services.discovery_service import DiscoveryService

client = TestClient(app)

def test_enam_stream_service_direct():
    # Record a live auction bid
    bid = enam_stream_service.record_bid(
        commodity="Tomato",
        market="Rajkot APMC",
        buyer_name="Test Direct Buyer Ltd",
        bid_price=33.5,
        quantity=2000.0,
        grade="Grade A"
    )
    assert bid["bid_price"] == 33.5
    assert bid["buyer_name"] == "Test Direct Buyer Ltd"

    # Fetch live bids
    bids = enam_stream_service.get_live_bids("Tomato", limit=5)
    assert len(bids) > 0
    assert bids[0]["buyer_name"] == "Test Direct Buyer Ltd"

def test_price_discovery_with_enam_stream():
    service = DiscoveryService()
    result = service.discover_price(
        commodity="Tomato",
        grade="Grade A",
        market="Rajkot",
        district="Rajkot"
    )
    # Check that live e-NAM stream integration is detected and active
    assert result["enam_live_stream_active"] is True
    assert "latest_enam_bids" in result
    assert any("e-NAM trading halls" in exp for exp in result["explanation"])

def test_enam_api_endpoints():
    # 1. Fetch live bids
    res = client.get("/api/ai/enam/live-bids/Tomato")
    assert res.status_code == 200
    assert "live_bids" in res.json()

    # 2. Publish new live bid
    publish_res = client.post("/api/ai/enam/publish-bid", json={
        "commodity": "Tomato",
        "market": "Gondal Market Yard",
        "buyer_name": "API Published Buyer",
        "bid_price": 34.0,
        "quantity": 1500.0,
        "grade": "Grade A"
    })
    assert publish_res.status_code == 200
    assert publish_res.json()["bid"]["bid_price"] == 34.0

def test_enam_websocket():
    with client.websocket_connect("/ws/enam-bids") as websocket:
        initial_msg = websocket.receive_json()
        assert initial_msg["event"] == "SNAPSHOT"
        assert "e-NAM trading hall" in initial_msg["message"]
        
        # Ping pong
        websocket.send_text("ping")
        resp = websocket.receive_text()
        assert resp == "pong"
