"""
Main FastAPI Application for Market Linkages & Price Discovery AI Engine.
Exposes standard ASP.NET AI microservice endpoints, standalone REST endpoints, and e-NAM WebSockets.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.price import router as price_router
from .routes.discovery import router as discovery_router
from .routes.matching import router as matching_router
from .routes.anomaly import router as anomaly_router
from .routes.enam import router as enam_router, ws_router
from .routes.admin import router as admin_router
from .schemas import MarketAnalysisRequest, MarketAnalysisResponse
from ..src.models.market_pressure import MarketPressureEngine

app = FastAPI(
    title="Farmer Market Linkages & Price Discovery AI Microservice",
    description="High-performance machine learning microservice for crop price forecasting, fair price discovery, buyer matching, fraud detection, and live e-NAM stream processing.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(price_router)
app.include_router(discovery_router)
app.include_router(matching_router)
app.include_router(anomaly_router)
app.include_router(enam_router)
app.include_router(ws_router)
app.include_router(admin_router)

market_pressure_engine = MarketPressureEngine()

@app.get("/")
def root():
    return {
        "service": "Farmer Market Linkages AI Engine",
        "status": "online",
        "version": "1.1.0",
        "endpoints": [
            "/api/ai/price-prediction",
            "/api/ai/price-discovery",
            "/api/ai/buyer-matching",
            "/api/ai/check-offer",
            "/market-analysis",
            "/api/ai/health",
            "/api/ai/enam/live-bids/{commodity}",
            "/api/ai/enam/publish-bid",
            "/ws/enam-bids (WebSocket)"
        ]
    }

@app.get("/api/ai/health")
@app.get("/health")
def health_check():
    return {"status": "healthy", "aiServiceHealthy": True, "service": "FastAPI AI Engine"}

@app.post("/market-analysis", response_model=MarketAnalysisResponse)
def analyze_market_pressure(request: MarketAnalysisRequest):
    result = market_pressure_engine.estimate_market_pressure(
        price_change_pct=2.5,
        arrival_delta_pct=-12.0
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
