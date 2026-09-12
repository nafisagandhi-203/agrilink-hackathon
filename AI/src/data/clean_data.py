"""
Data cleaning and validation pipeline for mandi price & arrival datasets.
"""
import pandas as pd
import numpy as np
from typing import Tuple, Dict

def clean_mandi_data(df: pd.DataFrame, is_archive_format: bool = False) -> Tuple[pd.DataFrame, Dict[str, int]]:
    initial_count = len(df)
    cleaning_stats = {
        "initial_rows": initial_count,
        "dropped_nulls": 0,
        "fixed_price_inversion": 0,
        "dropped_invalid_prices": 0,
        "dropped_duplicates": 0,
        "final_rows": 0
    }
    
    if df.empty:
        cleaning_stats["final_rows"] = 0
        return df, cleaning_stats

    # Standardize column names
    if is_archive_format:
        col_rename = {
            "State Name": "state",
            "District Name": "district",
            "Market Name": "market",
            "Variety": "variety",
            "Group": "group",
            "Arrivals (Tonnes)": "arrivals_tonnes",
            "Min Price (Rs./Quintal)": "min_price_raw",
            "Max Price (Rs./Quintal)": "max_price_raw",
            "Modal Price (Rs./Quintal)": "modal_price_raw",
            "Reported Date": "date_raw"
        }
    else:
        col_rename = {
            "State": "state",
            "District": "district",
            "Market": "market",
            "Commodity": "commodity",
            "Variety": "variety",
            "Grade": "grade",
            "Arrival_Date": "date_raw",
            "Min_Price": "min_price_raw",
            "Max_Price": "max_price_raw",
            "Modal_Price": "modal_price_raw"
        }
        
    df = df.rename(columns={k: v for k, v in col_rename.items() if k in df.columns})

    # Drop nulls in essential columns
    subset_cols = [c for c in ["modal_price_raw", "date_raw"] if c in df.columns]
    pre_null = len(df)
    df = df.dropna(subset=subset_cols)
    cleaning_stats["dropped_nulls"] = pre_null - len(df)

    # Parse prices to numeric
    for pcol in ["min_price_raw", "max_price_raw", "modal_price_raw"]:
        if pcol in df.columns:
            df[pcol] = pd.to_numeric(df[pcol], errors="coerce")
            
    df = df.dropna(subset=["modal_price_raw"])
    
    # Filter out non-positive or impossible prices (e.g. price per quintal between Rs. 100 and Rs. 50,000)
    pre_price = len(df)
    df = df[(df["modal_price_raw"] > 50) & (df["modal_price_raw"] < 100000)]
    cleaning_stats["dropped_invalid_prices"] = pre_price - len(df)

    # Validate and correct min <= modal <= max
    if "min_price_raw" in df.columns and "max_price_raw" in df.columns:
        # Fill missing min/max with modal
        df["min_price_raw"] = df["min_price_raw"].fillna(df["modal_price_raw"])
        df["max_price_raw"] = df["max_price_raw"].fillna(df["modal_price_raw"])
        
        # Ensure min <= modal <= max
        inversion_mask = (df["min_price_raw"] > df["modal_price_raw"]) | (df["modal_price_raw"] > df["max_price_raw"])
        cleaning_stats["fixed_price_inversion"] = int(inversion_mask.sum())
        
        df.loc[df["min_price_raw"] > df["modal_price_raw"], "min_price_raw"] = df["modal_price_raw"]
        df.loc[df["max_price_raw"] < df["modal_price_raw"], "max_price_raw"] = df["modal_price_raw"]

    # Convert prices to INR per Kg (Rs./Quintal divided by 100)
    df["modal_price"] = df["modal_price_raw"] / 100.0
    if "min_price_raw" in df.columns:
        df["min_price"] = df["min_price_raw"] / 100.0
    if "max_price_raw" in df.columns:
        df["max_price"] = df["max_price_raw"] / 100.0

    # Arrivals in Tonnes
    if "arrivals_tonnes" in df.columns:
        df["arrivals_tonnes"] = pd.to_numeric(df["arrivals_tonnes"], errors="coerce").fillna(0.0)
        df.loc[df["arrivals_tonnes"] < 0, "arrivals_tonnes"] = 0.0
    else:
        df["arrivals_tonnes"] = 10.0  # Default reasonable baseline if column absent

    # Parse date
    df["date"] = pd.to_datetime(df["date_raw"], errors="coerce", format="mixed")
    df = df.dropna(subset=["date"])

    # Remove duplicates
    key_cols = [c for c in ["state", "district", "market", "date"] if c in df.columns]
    pre_dup = len(df)
    df = df.drop_duplicates(subset=key_cols)
    cleaning_stats["dropped_duplicates"] = pre_dup - len(df)

    cleaning_stats["final_rows"] = len(df)
    return df.sort_values(by="date").reset_index(drop=True), cleaning_stats
