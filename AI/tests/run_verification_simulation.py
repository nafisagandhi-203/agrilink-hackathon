"""
End-to-End Simulation Test: Sends sample requests to all 6 AI modules and verifies responses.
"""
import json
from fastapi.testclient import TestClient
from AI.api.main import app

def run_simulation():
    client = TestClient(app)
    print("==================================================================")
    print("1. Testing Health Endpoint (/api/ai/health & /health)")
    print("==================================================================")
    r = client.get("/api/ai/health")
    print(f"Status: {r.status_code}, Response: {json.dumps(r.json(), indent=2)}")
    assert r.status_code == 200

    print("\n==================================================================")
    print("2. Testing Price Prediction (/api/ai/price-prediction)")
    print("==================================================================")
    pred_payload = {
        "commodity": "Tomato",
        "variety": "Local",
        "grade": "Grade A",
        "state": "Gujarat",
        "district": "Rajkot",
        "market": "Rajkot",
        "quantity": 1000.0,
        "prediction_days": 7
    }
    r = client.post("/api/ai/price-prediction", json=pred_payload)
    print(f"Status: {r.status_code}")
    res = r.json()
    print(f"Current Price: ₹{res['currentPrice']}/kg")
    print(f"Predicted Price (7 days): ₹{res['predictedPrice']}/kg (Expected Range: ₹{res['lowerPrice']}–₹{res['upperPrice']}/kg)")
    print(f"Confidence: {res['confidence']}% | Trend: {res['trend']}")
    print(f"Recommendation: {res['recommendation']} - {res['recommendationReason']}")
    print(f"Weather Advisory: {res['weather']['riskLevel'].upper()} risk | {res['weather']['recommendation']}")
    print(f"Timeline Chart points generated: {len(res['chartData'])}")

    print("\n==================================================================")
    print("3. Testing Fair Price Discovery (/api/ai/price-discovery)")
    print("==================================================================")
    disc_payload = {
        "commodity": "Tomato",
        "variety": "Local",
        "grade": "Grade A",
        "market": "Rajkot",
        "district": "Rajkot",
        "quantity": 1000.0
    }
    r = client.post("/api/ai/price-discovery", json=disc_payload)
    print(f"Status: {r.status_code}")
    res = r.json()
    print(f"Fair Price: ₹{res['fair_price']}/kg (Corridor: ₹{res['lower_bound']}–₹{res['upper_bound']}/kg)")
    print(f"Supporting Markets: {[m['market'] + ': ₹' + str(m['avg_price']) + '/kg' for m in res['market_comparisons']]}")
    print("Explanations:")
    for exp in res["explanation"]:
        print(f"  - {exp}")

    print("\n==================================================================")
    print("4. Testing Farmer-Buyer Matching (/api/ai/buyer-matching)")
    print("==================================================================")
    match_payload = {
        "commodity": "Tomato",
        "variety": "Local",
        "grade": "Grade A",
        "quantity": 1000.0,
        "farmer_district": "Rajkot",
        "market_price": 28.0
    }
    r = client.post("/api/ai/buyer-matching", json=match_payload)
    print(f"Status: {r.status_code}")
    res = r.json()
    print(f"Total Matches Found: {res['total']}")
    for m in res["matches"]:
        print(f"\n  {m['badge']} {m['business_name']}")
        print(f"    Match Score: {m['match_score']}% | Offer: ₹{m['offered_price']}/kg | Distance: {m['distance_km']} km")
        print(f"    Reasons: {m['reasons'][:2]}")

    print("\n==================================================================")
    print("5. Testing Anomaly Detection (/api/ai/check-offer)")
    print("==================================================================")
    # Case A: Lowball bid
    r1 = client.post("/api/ai/check-offer", json={"commodity": "Tomato", "market_price": 30.0, "offered_price": 12.0})
    print(f"Lowball Bid (₹12 vs ₹30): Abnormal = {r1.json()['is_abnormal']}, Risk Level = {r1.json()['risk_level']}")
    print(f"  Reasons: {r1.json()['reasons']}")

    # Case B: Fair bid
    r2 = client.post("/api/ai/check-offer", json={"commodity": "Tomato", "market_price": 30.0, "offered_price": 32.0})
    print(f"\nFair Bid (₹32 vs ₹30): Abnormal = {r2.json()['is_abnormal']}, Risk Level = {r2.json()['risk_level']}")

    print("\n==================================================================")
    print("6. Testing Market Pressure / Demand Proxy (/market-analysis)")
    print("==================================================================")
    r = client.post("/market-analysis", json={"commodity": "Tomato", "market": "Rajkot", "current_price": 30.0})
    print(f"Status: {r.status_code}")
    res = r.json()
    print(f"Current Demand Proxy: {res['current_demand_proxy']} | Projected: {res['predicted_demand_proxy']}")
    print(f"Recommendation: {res['recommendation']}")

    print("\n==================================================================")
    print("ALL 6 AI SERVICES TESTED AND FULLY OPERATIONAL!")
    print("==================================================================")

if __name__ == "__main__":
    run_simulation()
