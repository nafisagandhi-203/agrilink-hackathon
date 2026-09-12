import pandas as pd
from AI.src.features.feature_engineering import engineer_features, FEATURE_COLUMNS

def test_engineer_features_no_lookahead():
    dates = pd.date_range("2025-01-01", periods=15, freq="D")
    prices = [20.0 + i * 0.5 for i in range(15)]
    df = pd.DataFrame({
        "date": dates,
        "modal_price": prices,
        "arrivals_tonnes": [15.0] * 15
    })
    
    df_feat = engineer_features(df, horizon_days=7)
    
    # Check that feature columns are present
    for col in FEATURE_COLUMNS:
        assert col in df_feat.columns

    # Verify that lag_1 at index 1 matches price at index 0
    assert df_feat.loc[1, "price_lag_1"] == df.loc[0, "modal_price"]
    # Verify that moving average at index 7 does NOT include index 7's price
    expected_ma7 = df.loc[:6, "modal_price"].mean()
    assert round(df_feat.loc[7, "price_ma_7"], 3) == round(expected_ma7, 3)
