"""
Normalization utilities for agricultural entities (crops, markets, states, grades).
"""
import re
import json
from pathlib import Path
from ..config import MAPPINGS_DIR, GRADE_MULTIPLIERS

def load_json_mapping(filename: str) -> dict:
    path = MAPPINGS_DIR / filename
    if path.exists():
        with open(path, "r", encoding="utf-8") as fp:
            return json.load(fp)
    return {}

CROP_MAP = load_json_mapping("crop_names.json")

def normalize_crop_name(name: str) -> str:
    if not name:
        return "Tomato"
    cleaned = re.sub(r"[^a-zA-Z\s]", "", str(name)).strip().lower()
    return CROP_MAP.get(cleaned, cleaned.capitalize())

def normalize_market_name(name: str) -> str:
    if not name:
        return "Local Mandi"
    cleaned = str(name).strip()
    # Remove APMC, Uzhavar Sandhai, Market, etc.
    cleaned = re.sub(r"\b(APMC|Market|Uzhavar Sandhai|Mandi)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"[()]", "", cleaned).strip()
    return cleaned.title() if cleaned else "Local Mandi"

def normalize_state_name(name: str) -> str:
    if not name:
        return "Gujarat"
    cleaned = str(name).strip().title()
    return cleaned

def normalize_grade_name(grade: str) -> str:
    if not grade:
        return "Grade A"
    g = str(grade).strip()
    for valid_grade in GRADE_MULTIPLIERS.keys():
        if valid_grade.lower() in g.lower():
            return valid_grade
    return "Grade B (Standard)"

def get_grade_multiplier(grade: str) -> float:
    normalized = normalize_grade_name(grade)
    return GRADE_MULTIPLIERS.get(normalized, 1.00)
