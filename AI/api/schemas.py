"""
Pydantic Schemas for the FastAPI AI Service.
Supports both the existing ASP.NET Core AIService DTO contracts and root REST endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ----------------- Price Prediction Schemas -----------------
class PricePredictionRequest(BaseModel):
    commodity: str = Field(default="Tomato", description="Name of the crop/commodity")
    variety: Optional[str] = Field(default="Local", description="Crop variety")
    grade: Optional[str] = Field(default="Grade A", description="Quality grade")
    state: Optional[str] = Field(default="Gujarat", description="State")
    district: Optional[str] = Field(default="Rajkot", description="District")
    market: Optional[str] = Field(default="Rajkot", description="APMC Mandi")
    quantity: Optional[float] = Field(default=1000.0, description="Quantity in kg")
    target_date: Optional[str] = Field(default="", description="Target date for prediction")
    prediction_days: Optional[int] = Field(default=7, description="Forecast horizon in days")

class WeatherInfoSchema(BaseModel):
    riskLevel: str = "Low"
    rainfallMm: float = 0.0
    deviation: float = 0.0
    recommendation: str = ""

class PriceChartPointSchema(BaseModel):
    date: str
    price: float
    predicted: bool = False

class PricePredictionResponse(BaseModel):
    # CamelCase attributes for direct ASP.NET AIService JSON deserialization
    currentPrice: float
    predictedPrice: float
    lowerPrice: float
    upperPrice: float
    confidence: int
    trend: str
    recommendation: str
    recommendationReason: str
    sevenDayAvg: float
    fourteenDayAvg: float
    thirtyDayAvg: float
    volatility: float
    modelVersion: str = "1.0.0"
    weather: Optional[WeatherInfoSchema] = None
    chartData: List[PriceChartPointSchema] = []

    # Snake_case aliases for direct REST consumers
    current_price: Optional[float] = None
    predicted_price: Optional[float] = None
    expected_min: Optional[float] = None
    expected_max: Optional[float] = None

# ----------------- Price Discovery Schemas -----------------
class PriceDiscoveryRequest(BaseModel):
    commodity: str = Field(default="Tomato")
    variety: Optional[str] = Field(default="Local")
    grade: Optional[str] = Field(default="Grade A")
    state: Optional[str] = Field(default="Gujarat")
    district: Optional[str] = Field(default="Rajkot")
    market: Optional[str] = Field(default="Rajkot")
    quantity: Optional[float] = Field(default=1000.0)
    date: Optional[str] = Field(default="")

class MarketComparisonSchema(BaseModel):
    market: str
    avg_price: float
    min_price: float
    max_price: float

class PriceDiscoveryResponse(BaseModel):
    fair_price: float
    lower_bound: float
    upper_bound: float
    confidence: int
    trend: str
    market_comparisons: List[MarketComparisonSchema] = []
    explanation: List[str] = []

# ----------------- Buyer Matching Schemas -----------------
class BuyerMatchingRequest(BaseModel):
    commodity: str = Field(default="Tomato")
    variety: Optional[str] = Field(default="Local")
    grade: Optional[str] = Field(default="Grade A")
    quantity: Optional[float] = Field(default=1000.0)
    farmer_district: Optional[str] = Field(default="Rajkot")
    farmer_state: Optional[str] = Field(default="Gujarat")
    market_price: Optional[float] = Field(default=30.0)

class BuyerMatchSchema(BaseModel):
    buyer_id: str
    business_name: str
    match_score: float
    offered_price: float
    required_quantity: float
    accepted_grade: str
    distance_km: float
    reliability_score: float
    rating: float
    badge: Optional[str] = "✓ Active Trader"
    reasons: List[str] = []

class BuyerMatchingResponse(BaseModel):
    total: int
    matches: List[BuyerMatchSchema] = []

# ----------------- Anomaly Check Schemas -----------------
class AnomalyCheckRequest(BaseModel):
    commodity: Optional[str] = Field(default="Tomato")
    market_price: float = Field(default=30.0)
    offered_price: float = Field(default=30.0)
    quantity: Optional[float] = Field(default=1000.0)
    grade: Optional[str] = Field(default="Grade A")
    buyer_id: Optional[str] = Field(default="")

class NormalRangeSchema(BaseModel):
    market_price: float
    expected_min: float
    expected_max: float

class AnomalyCheckResponse(BaseModel):
    is_abnormal: bool
    risk_level: str
    anomaly_score: float
    deviation_percent: float
    reasons: List[str] = []
    normal_range: Optional[NormalRangeSchema] = None

# ----------------- Market Pressure Schemas -----------------
class MarketAnalysisRequest(BaseModel):
    commodity: str = "Tomato"
    market: str = "Rajkot"
    current_price: float = 30.0
    arrivals_tonnes: float = 15.0

class MarketAnalysisResponse(BaseModel):
    current_demand_proxy: str
    predicted_demand_proxy: str
    demand_forecast_chart: List[Dict[str, Any]]
    recommendation: str
    note: str
