"""
Optimized data loading for mandi price and arrival datasets.
Uses chunking and filtering to prevent loading multi-GB files entirely into memory.
"""
import pandas as pd
from pathlib import Path
from typing import Optional, List
from ..config import ARCHIVE_DATASETS_DIR, CSV_DATASETS_DIR
from .clean_data import clean_mandi_data

def load_crop_mandi_data(
    commodity: str = "Tomato",
    states: Optional[List[str]] = None,
    max_records: int = 50000,
    min_year: int = 2020
) -> pd.DataFrame:
    archive_file = ARCHIVE_DATASETS_DIR / f"{commodity}.csv"
    
    if archive_file.exists():
        chunks = []
        loaded_count = 0
        
        # Read in 25,000-row chunks
        for chunk in pd.read_csv(archive_file, chunksize=25000, low_memory=False, encoding="utf-8", on_bad_lines="skip"):
            if states:
                chunk = chunk[chunk["State Name"].isin(states)]
            
            # Simple preliminary date filtering if year present
            if "Reported Date" in chunk.columns:
                chunk = chunk[chunk["Reported Date"].astype(str).str.contains(r"202[0-9]|201[8-9]")]
                
            chunks.append(chunk)
            loaded_count += len(chunk)
            if loaded_count >= max_records:
                break
                
        if chunks:
            raw_df = pd.concat(chunks, ignore_index=True)
            cleaned_df, _ = clean_mandi_data(raw_df, is_archive_format=True)
            cleaned_df["commodity"] = commodity
            return cleaned_df
            
    # Fallback to csv/ folder (e.g., 2026.csv or 2025.csv)
    fallback_file = CSV_DATASETS_DIR / "2026.csv"
    if fallback_file.exists():
        chunks = []
        for chunk in pd.read_csv(fallback_file, chunksize=25000, low_memory=False, encoding="utf-8", on_bad_lines="skip"):
            match = chunk[chunk["Commodity"].str.lower() == commodity.lower()]
            if not match.empty:
                chunks.append(match)
            if sum(len(c) for c in chunks) >= max_records:
                break
        if chunks:
            raw_df = pd.concat(chunks, ignore_index=True)
            cleaned_df, _ = clean_mandi_data(raw_df, is_archive_format=False)
            cleaned_df["commodity"] = commodity
            return cleaned_df
            
    # Return empty DataFrame if no data found
    return pd.DataFrame(columns=["date", "modal_price", "min_price", "max_price", "arrivals_tonnes", "commodity", "state", "market"])
