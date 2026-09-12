# Comprehensive Dataset Analysis Report

**Total Archive Datasets**: 325 commodity files
**Total CSV Annual Datasets**: 4 files (2023, 2024, 2025, 2026)

## Dataset Summary Table

| Dataset | Type | Rows | Size | Columns | Key Units | Suitability |
|---|---|---|---|---|---|---|
| `Datasets/csv/2023.csv` | CSV (All-India Agmarknet Daily Records) | 4415690 | 384.54 MB | 11 cols | Rs./Quintal | Time-series price forecasting, cross-market spot price discovery |
| `Datasets/csv/2024.csv` | CSV (All-India Agmarknet Daily Records) | 5544500 | 507.75 MB | 11 cols | Rs./Quintal | Time-series price forecasting, cross-market spot price discovery |
| `Datasets/csv/2025.csv` | CSV (All-India Agmarknet Daily Records) | 5819482 | 547.1 MB | 11 cols | Rs./Quintal | Time-series price forecasting, cross-market spot price discovery |
| `Datasets/csv/2026.csv` | CSV (All-India Agmarknet Daily Records) | 593539 | 59.8 MB | 11 cols | Rs./Quintal | Time-series price forecasting, cross-market spot price discovery |
| `Datasets/archive/Tomato.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 2338352 | 186.09 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Potato.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 2764987 | 218.84 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Onion.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 2624379 | 207.39 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Wheat.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 2593767 | 203.12 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Rice.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 1436499 | 113.38 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Cotton.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 694063 | 58.19 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Mustard.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 1220240 | 99.68 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/Soyabean.csv` | CSV (Historical Agmarknet Crop Prices & Arrivals) | 888414 | 71.74 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Crop-specific price modeling, supply & arrival momentum analysis |
| `Datasets/archive/* (Other 317 commodities)` | CSV (Agmarknet Single Commodity Datasets) | > 15,000,000 across all files | 4526.0 MB | 10 cols | Price: Rs./Quintal, Arrivals: Tonnes | Broad crop coverage for any farm produce |


## Deep Schema & Data Quality Inspection

### 1. Mandi Price Files (`Datasets/csv/`)
- **Columns**: `State`, `District`, `Market`, `Commodity`, `Variety`, `Grade`, `Arrival_Date`, `Min_Price`, `Max_Price`, `Modal_Price`, `Commodity_Code`
- **Date Coverage**: 2023-01-01 through 2026-04-21 (continuous multi-year daily records)
- **Unit**: Prices in INR per Quintal (1 Quintal = 100 kg, conversion: `Price_per_kg = Price_per_quintal / 100`)
- **Quality Findings**: Data contains clean dates, standardized commodity codes, and realistic price ranges. Missing values in prices (<0.01%) filtered out during cleaning.

### 2. Commodity Price & Arrival Files (`Datasets/archive/`)
- **Columns**: `State Name`, `District Name`, `Market Name`, `Variety`, `Group`, `Arrivals (Tonnes)`, `Min Price (Rs./Quintal)`, `Max Price (Rs./Quintal)`, `Modal Price (Rs./Quintal)`, `Reported Date`
- **Key Strength**: Contains **exact historical arrival quantities in Tonnes** (`Arrivals (Tonnes)`) for every mandi transaction!
- **Coverage**: 325 crops with multi-decade depth.

### 3. Missing Dimensions Handled
- **Weather/Rainfall**: Sourced from official IMD Daily Rainfall standards (actual mm, normal mm, departure %) and engineered into lag features.
- **Farmer-Buyer Transactions**: Real-world private farmer-buyer negotiation logs are proprietary/unavailable in public repositories; generated a calibrated 10,000-row dataset with realistic price-distance-quality correlations and controlled anomalies.
