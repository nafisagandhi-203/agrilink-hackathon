"""
Price Prediction API Router.
"""
from fastapi import APIRouter
from ..schemas import PricePredictionRequest, PricePredictionResponse
from ...src.services.prediction_service import PredictionService

router = APIRouter(tags=["Price Prediction"])
prediction_service = PredictionService()

@router.post("/api/ai/price-prediction", response_model=PricePredictionResponse)
@router.post("/predict-price", response_model=PricePredictionResponse)
def predict_crop_price(request: PricePredictionRequest):
    result = prediction_service.get_prediction(
        commodity=request.commodity,
        variety=request.variety or "Local",
        grade=request.grade or "Grade A",
        state=request.state or "Gujarat",
        district=request.district or "Rajkot",
        market=request.market or "Rajkot",
        quantity=request.quantity or 1000.0,
        target_date=request.target_date or "",
        prediction_days=request.prediction_days or 7
    )
    return result
