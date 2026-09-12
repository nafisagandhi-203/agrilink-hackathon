"""
Central Configuration for the AI Market Linkages & Price Discovery Engine.
"""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
GENERATED_DATA_DIR = DATA_DIR / "generated"
MAPPINGS_DIR = DATA_DIR / "mappings"
MODELS_DIR = BASE_DIR / "models" / "saved"
REPORTS_DIR = BASE_DIR / "reports"
DATA_ANALYSIS_DIR = BASE_DIR / "data_analysis"

# Project root datasets
DATASETS_DIR = BASE_DIR.parent / "Datasets"
ARCHIVE_DATASETS_DIR = DATASETS_DIR / "archive"
CSV_DATASETS_DIR = DATASETS_DIR / "csv"

# Model hyperparameters & settings
SUPPORTED_COMMODITIES = ["Tomato", "Potato", "Onion", "Wheat", "Rice", "Cotton", "Mustard", "Soyabean"]
DEFAULT_COMMODITY = "Tomato"
DEFAULT_HORIZON_DAYS = 7

# Quality grade adjustments
GRADE_MULTIPLIERS = {
    "Grade A": 1.08,
    "Grade A (Premium)": 1.10,
    "Grade B": 1.00,
    "Grade B (Standard)": 1.00,
    "Grade C": 0.88,
    "Grade C (Fair)": 0.88,
    "FAQ": 1.00,
    "Medium": 0.98,
    "Local": 0.95,
}

# Matching score weights
MATCHING_WEIGHTS = {
    "price": 0.30,
    "quantity": 0.20,
    "grade": 0.15,
    "variety": 0.15,
    "distance": 0.10,
    "reliability": 0.10,
}

# Anomaly detection thresholds
ANOMALY_THRESHOLDS = {
    "high_deviation_pct": 30.0,
    "critical_deviation_pct": 50.0,
    "min_offer_ratio": 0.50,
    "max_offer_ratio": 1.50,
}
