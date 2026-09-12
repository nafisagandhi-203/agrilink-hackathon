# AI Microservice Setup & Execution Guide (Ubuntu Linux)

Follow these exact terminal commands to set up, schedule, and run the AI subsystem on your Linux machine.

---

## 1. Prerequisites
- Python 3.10+ (Tested on Python 3.14 / 3.12 / 3.11)
- `python3-venv` package installed (`sudo apt install python3-venv`)

---

## 2. Setting Up the Virtual Environment

Open a terminal in the root hackathon directory:

```bash
cd "/home/nafisa/D Drive/Nafisa college materials/Hackathon"

# Create dedicated virtual environment inside AI/
python3 -m venv AI/.venv

# Activate the virtual environment
source AI/.venv/bin/activate

# Install all dependencies
pip install -r AI/requirements.txt
```

---

## 3. Scheduled Daily Retraining (Cron Job)

The AI engine includes an automated daily ingestion and model retraining pipeline:

### A. Manual Execution (Immediate)
```bash
# Direct execution via Python module:
PYTHONPATH=. AI/.venv/bin/python -m AI.src.pipeline.daily_retrain

# Or run the cron shell wrapper:
./AI/cron/daily_retrain.sh
```

### B. Linux Crontab Setup (Scheduled at 2:00 AM IST daily)
To install the cron job, open crontab:
```bash
crontab -e
```
Add the following line:
```cron
0 2 * * * "/home/nafisa/D Drive/Nafisa college materials/Hackathon/AI/cron/daily_retrain.sh" >> "/home/nafisa/D Drive/Nafisa college materials/Hackathon/AI/reports/daily_retrain.log" 2>&1
```

### C. Admin Webhook API
You can also trigger a retraining run over HTTP or view status:
- **Status**: `GET http://localhost:8000/api/ai/admin/model-status`
- **Trigger**: `POST http://localhost:8000/api/ai/admin/trigger-daily-retrain`

---

## 4. e-NAM Real-Time Bid Streaming & WebSockets

The AI engine connects live trading hall bids directly into the Price Discovery Engine:
- **Live Bids REST Endpoint**: `GET /api/ai/enam/live-bids/{commodity}`
- **Publish Live Bid**: `POST /api/ai/enam/publish-bid`
- **Simulate Bid Tick**: `POST /api/ai/enam/simulate-tick?commodity=Tomato&base_price=30.0`
- **Live WebSocket Feed**: `ws://localhost:8000/ws/enam-bids`

When a farmer queries the **Price Discovery Engine** (`POST /api/ai/price-discovery`), it automatically absorbs active e-NAM stream bids to calibrate the fair price corridor in real time.

---

## 5. Running the Automated Test Suite

```bash
PYTHONPATH=. AI/.venv/bin/pytest AI/tests/ -v
```

Executes all 19 unit, model, e-NAM streaming, and integration tests.

---

## 6. Starting the FastAPI Microservice

```bash
PYTHONPATH=. AI/.venv/bin/uvicorn AI.api.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger UI documentation:
`http://localhost:8000/docs`

---

## 7. Running the Complete System (Frontend + Backend + AI)

Open three separate terminal tabs:

### Terminal 1: AI Microservice (Port 8000)
```bash
cd "/home/nafisa/D Drive/Nafisa college materials/Hackathon"
PYTHONPATH=. AI/.venv/bin/uvicorn AI.api.main:app --host 0.0.0.0 --port 8000
```

### Terminal 2: ASP.NET Core Backend (Port 5000 / 5001)
```bash
cd "/home/nafisa/D Drive/Nafisa college materials/Hackathon/Backend"
dotnet run
```

### Terminal 3: Vite React Frontend (Port 5173)
```bash
cd "/home/nafisa/D Drive/Nafisa college materials/Hackathon/Frontend"
npm run dev
```
