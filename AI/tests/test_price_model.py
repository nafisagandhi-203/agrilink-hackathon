from AI.src.models.price_prediction import PricePredictor

def test_price_predictor_inference():
    predictor = PricePredictor(commodity="Tomato")
    predictor.load()  # Loads trained joblib model if available
    
    res = predictor.predict(current_price=28.0, arrivals_tonnes=15.0)
    
    assert "predicted_price" in res
    assert "lower_price" in res
    assert "upper_price" in res
    assert res["lower_price"] <= res["predicted_price"] <= res["upper_price"]
    assert 50 <= res["confidence"] <= 100
    assert res["trend"] in ["Upward", "Downward", "Stable"]
    assert res["recommendation"] in ["BUY", "SELL", "HOLD", "STABLE"]
