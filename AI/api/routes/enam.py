"""
e-NAM Live Bid Streaming API Router and WebSocket Endpoint.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import asyncio
from ...src.services.enam_stream_service import enam_stream_service

router = APIRouter(prefix="/api/ai/enam", tags=["e-NAM Live Bids"])

class IncomingBidSchema(BaseModel):
    commodity: str = Field(default="Tomato")
    market: str = Field(default="Rajkot APMC")
    buyer_name: str = Field(default="Direct Agro Buyer")
    bid_price: float = Field(default=31.5)
    quantity: float = Field(default=1000.0)
    grade: Optional[str] = Field(default="Grade A")

# Connected WebSocket active connections
active_connections: List[WebSocket] = []

@router.get("/live-bids/{commodity}")
def get_live_enam_bids(commodity: str, limit: int = 10):
    bids = enam_stream_service.get_live_bids(commodity, limit=limit)
    return {
        "commodity": commodity,
        "active_stream_bids_count": len(bids),
        "live_bids": bids
    }

@router.post("/publish-bid")
async def publish_live_bid(bid: IncomingBidSchema):
    recorded = enam_stream_service.record_bid(
        commodity=bid.commodity,
        market=bid.market,
        buyer_name=bid.buyer_name,
        bid_price=bid.bid_price,
        quantity=bid.quantity,
        grade=bid.grade or "Grade A"
    )
    # Broadcast to active WebSockets
    for ws in active_connections:
        try:
            await ws.send_json({"event": "NEW_BID", "data": recorded})
        except Exception:
            pass
    return {"status": "broadcasted", "bid": recorded}

@router.post("/simulate-tick")
async def simulate_live_tick(commodity: str = "Tomato", base_price: float = 30.0):
    simulated = enam_stream_service.simulate_live_tick(commodity=commodity, base_price=base_price)
    for ws in active_connections:
        try:
            await ws.send_json({"event": "NEW_BID", "data": simulated})
        except Exception:
            pass
    return {"status": "simulated", "bid": simulated}

# WebSocket route for live subscription
ws_router = APIRouter(tags=["e-NAM WebSockets"])

@ws_router.websocket("/ws/enam-bids")
async def websocket_enam_stream(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        # Send initial snapshot of live bids
        await websocket.send_json({
            "event": "SNAPSHOT",
            "message": "Connected to e-NAM trading hall live bid stream",
            "active_crops": ["Tomato", "Potato", "Onion", "Wheat"]
        })
        while True:
            # Keep socket alive and allow client to request ticks
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)
