from AI.src.models.buyer_matching import BuyerMatchingEngine

def test_buyer_matching_ranking():
    engine = BuyerMatchingEngine()
    matches = engine.rank_buyers(
        farmer_commodity="Tomato",
        farmer_quantity=1000.0,
        farmer_grade="Grade A",
        farmer_variety="Local",
        farmer_district="Rajkot",
        market_price=30.0
    )
    
    assert len(matches) >= 3
    # Check that matches are sorted descending by match_score
    scores = [m["match_score"] for m in matches]
    assert scores == sorted(scores, reverse=True)
    # Check that highest score has the gold badge
    assert matches[0]["badge"] == "🥇 Best Match"
    assert len(matches[0]["reasons"]) > 0
