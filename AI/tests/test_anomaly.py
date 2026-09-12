from AI.src.models.anomaly_detection import AnomalyDetector

def test_anomaly_detection_lowball():
    detector = AnomalyDetector()
    detector.load()
    
    # 55% below market price -> Severe anomaly
    res = detector.check_offer(market_price=30.0, offered_price=13.5)
    assert res["is_abnormal"] is True
    assert res["risk_level"] == "HIGH"
    assert res["normal_range"]["expected_min"] <= 30.0 <= res["normal_range"]["expected_max"]

def test_anomaly_detection_normal_offer():
    detector = AnomalyDetector()
    detector.load()
    
    # Within 5% of market price -> Normal
    res = detector.check_offer(market_price=30.0, offered_price=31.0)
    assert res["is_abnormal"] is False
    assert res["risk_level"] == "LOW"
