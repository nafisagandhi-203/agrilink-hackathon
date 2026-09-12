# Dataset Join & Entity Alignment Report

## Overview
This report documents the alignment, key normalization, and match quality when linking Agmarknet Mandi Price records (`Datasets/csv/`) with Mandi Supply & Arrival records (`Datasets/archive/`).

## Normalization Rules Applied
1. **State & District Normalization**: Lowercasing, removing administrative suffixes ('District', 'Dist'), trimming whitespace.
2. **Market / APMC Normalization**: Stripping redundant tokens like 'APMC', 'Uzhavar Sandhai', parentheses, and standardizing common mandi spellings (e.g. 'Rajkot APMC' -> 'rajkot').
3. **Commodity Standard Normalization**: Aliasing common vernacular names (e.g. 'Tamatar' -> 'Tomato', 'Pyaz' -> 'Onion').
4. **Date Formats**: Harmonizing ISO 8601 `YYYY-MM-DD` and Agmarknet legacy `DD Mon YYYY` into uniform datetime objects.

## Join Statistics

| Metric | Value |
|---|---|
| Sampled Price Records | 5,000 |
| Scanned Arrival Records | 10,000 |
| Exact Mandi-State Key Matches | 12 (0.2%) |
| Partial Regional / State Matches | 15 (0.3%) |
| Unmatched Records | 4,973 (99.5%) |
| **Overall Harmonized Coverage** | **0.54%** |

## Architectural Decision
- For mandis with direct historical arrivals, exact arrival quantities are linked.
- For regional mandis without same-day local telemetry, district/state-level arrival medians and seasonal arrival proxies are leveraged to avoid synthetic distortion and prevent data leakage.
