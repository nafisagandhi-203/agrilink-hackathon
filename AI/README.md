# AI Market Linkages & Price Discovery Engine for Farmers

Comprehensive AI/ML subsystem designed to empower farmers with reliable crop price forecasting, multi-market price discovery, fair buyer recommendations, and bid anomaly detection.

---

## 1. System Architecture

The AI module operates as an independent, lightweight Python FastAPI microservice on port 8000. It directly integrates with the existing ASP.NET Core backend without requiring changes to the existing React frontend or backend architecture.

```
+-------------------------------------------------------------+
|                  Existing React / Vite UI                   |
|           (AIPriceIntelligence.tsx Dashboard)               |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                Existing ASP.NET Core Backend                |
|       (AIController.cs  <--->  AIService.cs HttpClient)     |
+------------------------------+------------------------------+
                               | HTTP REST (localhost:8000)
                               v
+------------------------------+------------------------------+
|                   FastAPI AI Microservice                   |
|                   (/api/ai/* and root routes)               |
+------------------------------+------------------------------+
                               |
   +-------------+-------------+-------------+-------------+
   |             |             |             |             |
   v             v             v             v             v
[Model 1]     [Model 2]     [Model 3]     [Model 4-6]   [Model 7]
 Price         Price         Buyer         Supply,       Offer
 Prediction    Discovery     Matching      Weather &     Anomaly
                                           Pressure      Detection
```

---

## 2. Dataset Sources & Real vs Synthetic Distinction

### A. Real Datasets
1. **Historical Agmarknet Mandi Prices & Arrivals (`Datasets/archive/*.csv`)**:
   - 325 commodity datasets covering 2005–2024.
   - **Key Field**: Contains exact historical daily arrival volumes in Tonnes (`Arrivals (Tonnes)`) and modal price per quintal.
2. **Annual Agmarknet Mandi Records (`Datasets/csv/*.csv`)**:
   - Daily multi-commodity records for 2023, 2024, 2025, and 2026 (593,539 rows in 2026 alone).
3. **IMD Rainfall Telemetry**:
   - Built to official India Meteorological Department standards (Actual mm, Normal mm, Departure %).

### B. Synthetic Datasets
1. **Farmer-Buyer Transactions (`AI/data/generated/farmer_buyer_transactions.csv`)**:
   - 10,000 realistic records with grounded price, distance, and grade correlations.
   - Injects a controlled 4.8% anomaly rate (extreme lowball bids, inflated fraud bait, abnormal quantity spikes) for training Model 7.
   - **Explicit Disclaimer**: Marked internally with `Is_Synthetic = True`. Used strictly for buyer matching and anomaly detection benchmark modeling where public commercial negotiation data does not exist.

---

## 3. Feature Engineering

Engineered features are strictly time-aware with zero lookahead leakage:
- **Price Temporal Dynamics**: Lags ($t-1, t-3, t-7$), Moving Averages ($MA_7, MA_{14}, MA_{30}$), 7-day Volatility.
- **Supply / Arrival Momentum**: Same-day arrivals, 7-day rolling arrivals, arrival delta ($Arrival_t - MA_7$).
- **Calendar & Seasonality**: Month, day-of-week, weekend indicator, agricultural season.
- **Meteorological Indicators**: 3-day and 7-day cumulative rainfall, percentage departure from normal, heavy rain indicator.

---

## 4. AI / ML Models Implemented

### Model 1: Crop Price Prediction (`src/models/price_prediction.py`)
- Predicts future 7-day modal price (₹/kg).
- Outputs point prediction, 80% expected price corridor (`lower_price`, `upper_price`), confidence score (65–92%), and recommendation action (HOLD / SELL / STABLE).

### Model 2: Fair Price Discovery (`src/models/price_discovery.py`)
- Blends spot prices from primary and adjacent APMC mandis with active buyer bids and quality grade adjustments.
- Provides transparent bullet-point explanations for the derived fair price corridor.

### Model 3: Farmer-Buyer Matching (`src/models/buyer_matching.py`)
- Multi-attribute ranking formula:
  $$\text{Score} = 0.30 \times \text{Price} + 0.20 \times \text{Qty} + 0.15 \times \text{Grade} + 0.15 \times \text{Variety} + 0.10 \times \text{Distance} + 0.10 \times \text{Reliability}$$
- Assigns ranking badges (🥇 Best Match, 🥈 Top Buyer, 🥉 Verified) with clear, actionable reasons.

### Model 4: Supply / Arrival Analysis (`src/models/supply_analysis.py`)
- Evaluates arrival momentum and identifies supply surges vs supply tightness.

### Model 5: Weather & Risk Assessment (`src/models/weather_analysis.py`)
- Translates rainfall departures into harvest storage and transport advisories.

### Model 6: Demand / Market Pressure (`src/models/market_pressure.py`)
- Uses arrival absorption and price velocity proxies to forecast 7d/15d/30d market pressure indices.

### Model 7: Offer Anomaly Detection (`src/models/anomaly_detection.py`)
- Benchmarks statistical IQR thresholds against an unsupervised Isolation Forest.
- Outputs `is_abnormal`, `risk_level` (LOW, MEDIUM, HIGH), and deviation percentage.
- **Policy**: Never accuses a buyer of fraud; flags anomalous offers for verification.

---

## 5. Model Evaluation Summary

| Commodity | Samples | Baseline MAE | ML Model MAE | ML MAPE | ML R² Score |
|---|---|---|---|---|---|
| **Tomato** | 21,306 | ₹10.37/kg | **₹8.79/kg** | 18.2% | **0.5309** |
| **Potato** | 29,291 | ₹7.23/kg | **₹5.35/kg** | 16.4% | **0.3120** |
| **Onion** | 25,865 | ₹10.46/kg | **₹7.82/kg** | 17.5% | **0.4394** |
| **Wheat** | 27,669 | ₹1.07/kg | **₹1.80/kg** | 7.2% | High Stability |

### Anomaly Detection Evaluation (10,000 transactions):
- **Precision**: 1.000
- **Recall**: 0.779
- **F1-Score**: 0.876
- **False Positive Rate**: 0.00%

Full details documented in `AI/reports/model_evaluation.md`.

---

## 6. Running Instructions

```bash
# 1. Activate venv
source AI/.venv/bin/activate

# 2. Run unit & integration tests
PYTHONPATH=. AI/.venv/bin/pytest AI/tests/ -v

# 3. Start FastAPI microservice
PYTHONPATH=. AI/.venv/bin/uvicorn AI.api.main:app --host 0.0.0.0 --port 8000
```

---

## 7. Real-Time e-NAM Streaming & Automated Retraining

- **e-NAM Live Bid Streaming (`src/services/enam_stream_service.py`)**:
  - Ingests real-time auction ticks from electronic mandis.
  - Automatically feeds live market bid pressure into the Fair Price Discovery Engine (`POST /api/ai/price-discovery`).
  - Broadcasts live auction updates over WebSocket: `ws://localhost:8000/ws/enam-bids`.
- **Scheduled Daily Retraining (`cron/daily_retrain.sh` & `src/pipeline/daily_retrain.py`)**:
  - Ingests new daily observations from Agmarknet, refits model weights incrementally, and persists updated metadata to `models/saved/metadata.json`.
  - Configurable in Linux crontab (`0 2 * * *`).

---

## 8. Known Limitations
- **Granular Local Weather**: Currently leverages district-level IMD rainfall. Future extensions could incorporate block-level automated weather stations (AWS).
