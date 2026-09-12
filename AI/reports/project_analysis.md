# Project Architecture & System Analysis Report

## 1. Executive Summary
This report analyzes the existing hackathon repository structure, existing frontend and backend contracts, and outlines the non-intrusive integration strategy for the new AI/ML subsystem inside `AI/`.

---

## 2. Frontend Architecture Inspection
- **Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React.
- **Key AI Pages & Dashboards**:
  - `Frontend/src/pages/farmer/AIPriceIntelligence.tsx`:
    - Full farmer-facing AI Mandi Intelligence dashboard.
    - Features 6 functional modules:
      1. Price Prediction & Recommended Action (Wait vs Sell).
      2. Price Discovery Comparison (Spot mandis vs direct buyers).
      3. Recommended Buyers (Ranked cards with match score, distance, badges, and bullet-point reasons).
      4. Weather Impact & Risk Advisory (rainfall impact, storage warnings, risk severity).
      5. AI Demand Forecasting (Current vs predicted demand, 7d/15d/30d demand index charts).
      6. Price Protection & Fraud Detection (Alerts on abnormally low or high offers).
  - `Frontend/src/services/aiIntelligenceService.ts`:
    - Defines the TypeScript interfaces (`FarmerAiInput`, `AiIntelligenceResult`, `PriceTrendPoint`, `MatchedBuyer`, etc.).
  - `Frontend/src/pages/DemandForecastPage.tsx` and `Frontend/src/pages/farmer/RecommendedBuyers.tsx`.
- **Integration Mandate**:
  - **Zero UI/Design modification**: The frontend remains untouched.
  - The AI outputs conform directly to the data schema expected by the frontend.

---

## 3. Backend Architecture Inspection
- **Technology Stack**: ASP.NET Core 9.0 Web API, Entity Framework Core, SQL Server, FluentValidation, JWT Bearer authentication.
- **Key Controller & Service**:
  - `Backend/Controllers/AIController.cs`:
    - Exposes endpoints under `/api/AI/`:
      - `POST /api/AI/price-prediction`
      - `POST /api/AI/price-discovery`
      - `POST /api/AI/buyer-matching`
      - `POST /api/AI/check-offer`
      - `GET /api/AI/health`
  - `Backend/Services/AI/AIService.cs`:
    - Injected `HttpClient` configured via `appsettings.json` (`AI:BaseUrl` = `http://localhost:8000`).
    - Translates requests to JSON and deserializes the responses into typed C# DTOs:
      - `PricePredictionResultDto`
      - `PriceDiscoveryResultDto`
      - `BuyerMatchingResultDto`
      - `AnomalyCheckResultDto`
  - `Backend/DTOs/AiDtos.cs`:
    - Strongly-typed DTOs mirroring all AI request and response payloads.
- **Integration Mandate**:
  - **Zero backend rewrite**: The existing ASP.NET application remains the primary backend.
  - The Python FastAPI AI service on `http://localhost:8000` fulfills the exact contracts expected by `AIService.cs`.

---

## 4. Datasets Architecture Inspection
- **Datasets Directory**: `Datasets/`
  - `Datasets/archive/`: 325 commodity CSV files containing historical Mandi prices AND historical arrival quantities in Tonnes.
  - `Datasets/csv/`: Agmarknet daily price records for 2023, 2024, 2025, and 2026.
- **Missing Data Identified**:
  - Official IMD daily rainfall data (state, district, date, actual mm, normal mm, departure %).
  - Farmer-buyer private transaction and negotiation logs.
- **Strategy**:
  - Merge real historical mandi prices and arrivals.
  - Integrate official IMD rainfall data features.
  - Generate a calibrated 10,000-row synthetic transaction dataset (`AI/data/generated/farmer_buyer_transactions.csv`) with realistic economic properties and controlled anomalies.
