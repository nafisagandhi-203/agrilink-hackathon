from AI.src.models.price_discovery import PriceDiscoveryEngine

def test_price_discovery_corridor():
    engine = PriceDiscoveryEngine()
    res = engine.discover_fair_price(
        commodity="Tomato",
        base_market_price=30.0,
        grade="Grade A",
        market="Rajkot",
        district="Rajkot"
    )
    
    assert "fair_price" in res
    assert "lower_bound" in res
    assert "upper_bound" in res
    assert res["lower_bound"] <= res["fair_price"] <= res["upper_bound"]
    assert len(res["market_comparisons"]) >= 2
    assert len(res["explanation"]) >= 2
