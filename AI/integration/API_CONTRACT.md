# AI Integration API Contract

This document specifies the exact request and response contracts connecting the **Frontend**, the **ASP.NET Backend**, and the **Python FastAPI AI Microservice**.

```
Existing React Frontend  <--->  Existing ASP.NET Backend  <--->  Python FastAPI AI Service
(AIPriceIntelligence)           (AIController.cs)                 (Port 8000)
```

---

## 1. Crop Price Prediction

- **Existing ASP.NET Endpoint**: `POST /api/AI/price-prediction`
- **FastAPI Endpoints**: `POST /api/ai/price-prediction` and `POST /predict-price`
- **Frontend Consumer**: `AIPriceIntelligence.tsx` (Section 1: AI Price Prediction & Trend)

### Request Payload:
```json
{
  "commodity": "Tomato",
  "variety": "Local",
  "grade": "Grade A",
  "state": "Gujarat",
  "district": "Rajkot",
  "market": "Rajkot",
  "quantity": 1000.0,
  "target_date": "2026-09-18",
  "prediction_days": 7
}
```

### Response Payload:
```json
{
  "currentPrice": 28.0,
  "predictedPrice": 30.2,
  "lowerPrice": 28.1,
  "upperPrice": 32.0,
  "confidence": 84,
  "trend": "Upward",
  "recommendation": "HOLD",
  "recommendationReason": "AI models predict a 7.9% price appreciation over the next 7 days due to tightening market arrivals.",
  "sevenDayAvg": 27.5,
  "fourteenDayAvg": 26.8,
  "thirtyDayAvg": 26.1,
  "volatility": 0.042,
  "modelVersion": "1.0.0",
  "weather": {
    "riskLevel": "medium",
    "rainfallMm": 12.5,
    "deviation": 25.0,
    "recommendation": "Ensure tarping during mandi transit; hold Grade A produce for 2-3 days if prices trend upward."
  },
  "chartData": [
    { "date": "2026-09-05", "price": 26.0, "predicted": false },
    { "date": "2026-09-11", "price": 28.0, "predicted": false },
    { "date": "2026-09-18", "price": 30.2, "predicted": true }
  ]
}
```

---

## 2. Fair Price Discovery

- **Existing ASP.NET Endpoint**: `POST /api/AI/price-discovery`
- **FastAPI Endpoints**: `POST /api/ai/price-discovery` and `POST /price-discovery`
- **Frontend Consumer**: `AIPriceIntelligence.tsx` (Section 2: AI Price Discovery Engine)

### Request Payload:
```json
{
  "commodity": "Tomato",
  "variety": "Local",
  "grade": "Grade A",
  "state": "Gujarat",
  "district": "Rajkot",
  "market": "Rajkot",
  "quantity": 1000.0,
  "date": "2026-09-11"
}
```

### Response Payload:
```json
{
  "fair_price": 31.4,
  "lower_bound": 29.5,
  "upper_bound": 33.9,
  "confidence": 88,
  "trend": "Upward",
  "market_comparisons": [
    {
      "market": "Rajkot APMC",
      "avg_price": 30.2,
      "min_price": 28.4,
      "max_price": 31.8
    },
    {
      "market": "Gondal Market Yard",
      "avg_price": 31.5,
      "min_price": 29.6,
      "max_price": 33.3
    },
    {
      "market": "Mahuva Mandi",
      "avg_price": 32.4,
      "min_price": 30.6,
      "max_price": 34.5
    }
  ],
  "explanation": [
    "Evaluated spot prices across 3 primary mandis (Rajkot, Gondal, Mahuva) averaging ₹31.4/kg.",
    "Incorporated verified direct buyer bids averaging ₹32.1/kg.",
    "Applied Grade A quality adjustment multiplier (+8%).",
    "Quantity tier (1000 kg) qualifies for wholesale aggregate pricing corridor (₹29.5 – ₹33.9/kg)."
  ]
}
```

---

## 3. Farmer-Buyer Matching

- **Existing ASP.NET Endpoint**: `POST /api/AI/buyer-matching`
- **FastAPI Endpoints**: `POST /api/ai/buyer-matching` and `POST /match-buyers`
- **Frontend Consumer**: `AIPriceIntelligence.tsx` (Section 3: AI Farmer-Buyer Matching) & `RecommendedBuyers.tsx`

### Request Payload:
```json
{
  "commodity": "Tomato",
  "variety": "Local",
  "grade": "Grade A",
  "quantity": 1000.0,
  "farmer_district": "Rajkot",
  "farmer_state": "Gujarat",
  "market_price": 28.0
}
```

### Response Payload:
```json
{
  "total": 4,
  "matches": [
    {
      "buyer_id": "BUYER-01",
      "business_name": "AgroCorp Direct Supply",
      "match_score": 94.2,
      "offered_price": 31.4,
      "required_quantity": 1500.0,
      "accepted_grade": "Grade A",
      "distance_km": 28.0,
      "reliability_score": 96.0,
      "rating": 4.9,
      "badge": "🥇 Best Match",
      "reasons": [
        "Offers ₹31.4/kg (+12.1% above mandi benchmark)",
        "Accepts Grade A with instant quality sign-off",
        "Demand capacity (1500 kg) matches lot size",
        "Proximity corridor (28.0 km) with low transit freight",
        "Verified prompt payment track record (95%+ on-time)"
      ]
    }
  ]
}
```

---

## 4. Anomaly / Fraud Detection Check

- **Existing ASP.NET Endpoint**: `POST /api/AI/check-offer`
- **FastAPI Endpoints**: `POST /api/ai/check-offer` and `POST /detect-anomaly`
- **Frontend Consumer**: `AIPriceIntelligence.tsx` (Section 6: Price Protection / Fraud Detection)

### Request Payload:
```json
{
  "commodity": "Tomato",
  "market_price": 30.0,
  "offered_price": 12.0,
  "quantity": 1000.0,
  "grade": "Grade A",
  "buyer_id": "BUYER-99"
}
```

### Response Payload:
```json
{
  "is_abnormal": true,
  "risk_level": "HIGH",
  "anomaly_score": 0.60,
  "deviation_percent": -60.0,
  "reasons": [
    "Offered price (₹12.0/kg) is 60.0% below the prevailing mandi rate (₹30.0/kg).",
    "Unusually low bid may indicate severe quality discounting or distressed pricing terms.",
    "Recommendation: Verify buyer credentials and negotiate closer to fair corridor before acceptance."
  ],
  "normal_range": {
    "market_price": 30.0,
    "expected_min": 25.5,
    "expected_max": 37.5
  }
}
```
