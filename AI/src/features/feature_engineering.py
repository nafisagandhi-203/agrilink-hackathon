"""
Feature Engineering for Crop Price Prediction and Market Dynamics.
Engineers strictly causal, time-aware features with zero lookahead leakage.
"""
import pandas as pd
import numpy as np
from typing import Tuple, List
from .weather_features import compute_weather_features

FEATURE_COLUMNS = [
    "modal_price",
    "price_lag_1",
    "price_lag_3",
    "price_lag_7",
    "price_ma_7",
    "price_ma_14",
    "price_ma_30",
    "price_volatility_7",
    "arrivals_tonnes",
    "arr_lag_1",
    "arr_ma_7",
    "arr_delta_7",
    "month",
    "day_of_week",
    "is_weekend",
    "rain_roll_3d",
    "rain_roll_7d",
    "rainfall_departure_pct",
    "is_heavy_rainfall"
]

def engineer_features(df: pd.DataFrame, horizon_days: int = 7) -> pd.DataFrame:
    df = df.copy()
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values(by="date").reset_index(drop=True)
    
    # 1. Price Lags
    df["price_lag_1"] = df["modal_price"].shift(1)
    df["price_lag_3"] = df["modal_price"].shift(3)
    df["price_lag_7"] = df["modal_price"].shift(7)

    # 2. Rolling Moving Averages (causal shift: shift(1) so today's price is not in yesterday's window)
    shifted_p = df["modal_price"].shift(1)
    df["price_ma_7"] = shifted_p.rolling(window=7, min_periods=1).mean()
    df["price_ma_14"] = shifted_p.rolling(window=14, min_periods=1).mean()
    df["price_ma_30"] = shifted_p.rolling(window=30, min_periods=1).mean()

    # 3. Price Volatility
    roll_std_7 = shifted_p.rolling(window=7, min_periods=2).std().fillna(0.0)
    df["price_volatility_7"] = np.where(df["price_ma_7"] > 0, roll_std_7 / df["price_ma_7"], 0.0)

    # 4. Supply & Arrival Features
    if "arrivals_tonnes" not in df.columns:
        df["arrivals_tonnes"] = 15.0
    shifted_arr = df["arrivals_tonnes"].shift(1)
    df["arr_lag_1"] = shifted_arr
    df["arr_ma_7"] = shifted_arr.rolling(window=7, min_periods=1).mean()
    df["arr_delta_7"] = df["arrivals_tonnes"] - df["arr_ma_7"]

    # 5. Calendar & Seasonality
    if "date" in df.columns:
        df["month"] = df["date"].dt.month
        df["day_of_week"] = df["date"].dt.dayofweek
        df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    else:
        df["month"] = 6
        df["day_of_week"] = 2
        df["is_weekend"] = 0

    # 6. Meteorological Features
    df = compute_weather_features(df)

    # 7. Target Variable (Only for training/evaluation)
    df["target_future_price"] = df["modal_price"].shift(-horizon_days)

    return df

def prepare_train_test_split(
    df: pd.DataFrame,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    # Time-aware split: strictly ordered chronologically
    df_clean = df.dropna(subset=FEATURE_COLUMNS + ["target_future_price"]).copy()
    n = len(df_clean)
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))
    
    train_df = df_clean.iloc[:train_end]
    val_df = df_clean.iloc[train_end:val_end]
    test_df = df_clean.iloc[val_end:]
    
    return train_df, val_df, test_df
