import pandas as pd
from AI.src.data.clean_data import clean_mandi_data

def test_clean_mandi_data_price_inversion():
    raw_data = {
        "State": ["Gujarat", "Gujarat"],
        "District": ["Rajkot", "Rajkot"],
        "Market": ["Rajkot APMC", "Rajkot APMC"],
        "Commodity": ["Tomato", "Tomato"],
        "Variety": ["Local", "Local"],
        "Grade": ["FAQ", "FAQ"],
        "Arrival_Date": ["2026-01-01", "2026-01-02"],
        "Min_Price": [3500.0, 2000.0],
        "Max_Price": [2500.0, 3000.0],  # Inverted on row 0
        "Modal_Price": [3000.0, 2500.0]
    }
    df = pd.DataFrame(raw_data)
    cleaned, stats = clean_mandi_data(df, is_archive_format=False)
    
    assert len(cleaned) == 2
    assert stats["fixed_price_inversion"] >= 1
    # Check conversion to Rs./Kg (divided by 100)
    assert cleaned.iloc[0]["modal_price"] == 30.0
    assert cleaned.iloc[0]["min_price"] <= cleaned.iloc[0]["modal_price"] <= cleaned.iloc[0]["max_price"]

def test_clean_mandi_data_invalid_prices():
    raw_data = {
        "State": ["Gujarat"],
        "District": ["Rajkot"],
        "Market": ["Rajkot"],
        "Arrival_Date": ["2026-01-01"],
        "Modal_Price": [-100.0]  # Impossible negative price
    }
    df = pd.DataFrame(raw_data)
    cleaned, stats = clean_mandi_data(df, is_archive_format=False)
    assert len(cleaned) == 0
    assert stats["dropped_invalid_prices"] == 1
