# External & Public Dataset Sources Investigation

This document catalogs the verified public, government, and synthetic dataset sources used by the AI/ML subsystem.

---

## 1. Primary Mandi Price Datasets (Real Data)
- **Source**: Ministry of Agriculture and Farmers Welfare / Agmarknet (Agricultural Marketing Information Network), Government of India
- **Platform**: Data.gov.in & Agmarknet Portal (`https://agmarknet.gov.in`) / Kaggle mirror "Daily Market Prices of Commodity India (2001–2026)"
- **License**: Government Open Data License - India (GODL)
- **Fields**: `State`, `District`, `Market`, `Commodity`, `Variety`, `Grade`, `Arrival_Date`, `Min_Price`, `Max_Price`, `Modal_Price`, `Commodity_Code`
- **Coverage**: Multi-year daily prices across all APMC mandis in India (2023–2026 available locally in `Datasets/csv/`).
- **Usage**: Benchmark pricing, temporal features, modal price forecasting, and cross-market price discovery.

---

## 2. Mandi Supply & Arrival Datasets (Real Data)
- **Source**: Agmarknet Historical Mandi Arrivals
- **Platform**: Agmarknet / e-NAM historical trade records (`https://enam.gov.in`)
- **Location in Repo**: `Datasets/archive/*.csv` (325 commodity-specific datasets)
- **Fields**: `State Name`, `District Name`, `Market Name`, `Variety`, `Group`, `Arrivals (Tonnes)`, `Min Price (Rs./Quintal)`, `Max Price (Rs./Quintal)`, `Modal Price (Rs./Quintal)`, `Reported Date`
- **Coverage**: 325 crops covering major agricultural states from 2005 to 2024.
- **Usage**: Supply trend modeling, arrival momentum computation, demand proxy indicators, and price elasticity features.

---

## 3. Daily Meteorological & Rainfall Data (Real Data Specification)
- **Source**: India Meteorological Department (IMD), Ministry of Earth Sciences, Government of India
- **Platform**: National Water Data Portal (NWDP) / IMD iRAINS (`https://mausam.imd.gov.in` / `https://imdpune.gov.in`)
- **Fields**: `Date`, `State`, `District`, `Actual_Rainfall_mm`, `Normal_Rainfall_mm`, `Departure_Pct`
- **Usage**: Used to compute weather features (rolling 3-day and 7-day rainfall, departure from normal, dry-period and excess-rain risk alerts) as supportive inputs for price volatility and harvest storage advisories.

---

## 4. Farmer-Buyer Transactions Dataset (Synthetic Data Specification)
- **Source**: Synthetic Generator (`AI/src/data/generate_synthetic_transactions.py`)
- **Reason for Synthetic Generation**: Actual commercial negotiations, buyer bidding histories, and dispute logs between individual farmers and private buyers are proprietary and not available in public open-data portals.
- **Fields**:
  - `Transaction_ID`
  - `Farmer_ID`
  - `Buyer_ID`
  - `Commodity`
  - `Variety`
  - `Grade`
  - `Quantity`
  - `Farmer_District`
  - `Buyer_District`
  - `Distance_KM`
  - `Market_Price`
  - `Offered_Price`
  - `Final_Price`
  - `Transaction_Date`
  - `Payment_Status`
  - `Transaction_Status`
- **Generation Logic**:
  - Economically grounded: `Offered_Price` is linked to prevailing `Market_Price` with adjustments for quality grade (`Grade A` = +8%, `Grade C` = -12%) and distance penalty.
  - Controlled anomalies: 3–5% of records inject realistic anomalies (severe under-pricing, inflated bids, abnormal quantity spikes, payment defaults) for training and evaluating Model 7 (Anomaly Detection).
  - Saved to: `AI/data/generated/farmer_buyer_transactions.csv`.
