# AgriLink Hackathon — Final Integration & Audit Report

Generated: 2026-09-12

## Phase 23 — GREEN / YELLOW / RED matrix

### GREEN — verified working (live-tested end-to-end)

| Area | Evidence |
|------|----------|
| AI FastAPI engine runs with pre-trained models | `AI` module boots on :8000, health `{aiServiceHealthy:true}`; `pytest AI/tests` 19 passed; models in `AI/models/saved/*.joblib` (price_predictor tomato/potato/onion/wheat, anomaly_detector) |
| ASP.NET → FastAPI chain (4 endpoints) | price-prediction (currentPrice 30.2, predictedPrice 27.6), fair-price discovery (fair 31.4), buyer-matching (AgroCorp Direct Supply, score 78.1), offer anomaly check (isAbnormal true, deviationPercent -60) all return live model output through `/api/AI/*` |
| Buyer recommendations | `EnsureRecommendationsAsync` generates scored rows (compatibilityScore 90, reason). Dedupe bug fixed (duplicate pairs within `toAdd` → `seenKeys` HashSet) |
| Registration | Farmer/Buyer register + auto profile creation, login, JWT; role enforcement (admin not registrable, role claim checked) |
| Deal flow | Offer 201 → accept 200 auto-creates Confirmed transaction (no double-create; DataContext refetches after accept) → transaction list matches |
| Crop listing PUT (JSON partial update) | `[FromBody] CropListingUpdateDto` + relaxed validators; `{status:"Sold"}` persists without corrupting other fields |
| Transport booking | Create + 5-step status chain (Requested→Confirmed→PickupPending→PickedUp→InTransit); enum parsing now normalizes spaces/slashes/underscores ('In Transit' → `InTransit`) |
| User verification upsert | Repeated `POST /UserVerifications` upserts instead of duplicating (same id, status transitions work) |
| Conversations / Messages | POST + message round-trip via `MessageText`, filtered GET works |
| Voice assistant | Live AI + transport data (₹/quintal conversion, en-IN locale, gu/hi/en responses), persisted to `/VoiceInteractions` (201) |
| Crop images | Base64 upload in AddCropWizard, `placeholder.svg` fallback, vite dev proxy `/uploads` |
| Notifications | Delivered on accept flow (6 rows observed) |
| Auth expiry (401) | `apiClient` clears the session on 401-with-token and fires `agripulse:unauthorized`; `App.tsx` logs out and redirects to `/login` |
| Launch ergonomics | `start.sh` (repo root) launches Backend :5018, FastAPI :8000, Frontend :5173; Ctrl+C stops all |
| E2E suite | `/tmp/opencode/e2e10.js` — 19/19 PASS against fresh DB (T1–T15 incl. T9a/b/c, T10a/b/c, T12 upsert) |
| Builds | Backend `dotnet build` OK; Frontend `tsc --noEmit` 0 errors + `vite build` OK; AI `pytest` 19 passed |

### YELLOW — works but flagged

| Item | Detail |
|------|--------|
| Frontend error surfacing | `DataContext` swallows errors in many async actions (console-only); no user-facing failure toast except the backend-unreachable banner |
| OpenAPI/oxlint warnings | 12 lint warnings in Frontend (exhaustive-deps / set-state-in-effect patterns; non-blocking, behavioral — left as-is) |
| AI model quality | Price-predictor R² negative on some crops (honest metrics in `AI/reports/model_evaluation.md`); acceptable for hackathon demo, not for production |
| Enum transitions | Status updates must follow a valid transition path; consumers must use enum names (spaces now tolerated) |

> Phase 22 note: the live :5018/:5173 instances were found down; backend/frontend were restored (same build + seeded DB, which now includes E2E data) and re-verified green on :5018.

### RED — critical

None. No critical blockers remain. All previously known breakages (recommendations generation, verifications upsert, JSON PUT, AI DTO binding, voice, images, admin registration) are fixed and verified live.

## Launch instructions (dev)

1. Backend (port 5019 — use custom urls to avoid ports in use):
   `cd Backend && dotnet build` then
   `dotnet bin/Debug/net10.0/HackathonProject.dll --urls=http://localhost:5019`
   (fresh DB: delete `Backend/agrilink.db*` before start; admin seeded `admin@agrilink.local` / `Admin@123`)
2. AI (from repo root, port 8000):
   `./AI/.venv/bin/python -m uvicorn AI.api.main:app --host 0.0.0.0 --port 8000`
   (module is `AI.api.main:app`, must run from the repo root so relative imports resolve)
3. Frontend (port 5173, proxies `/uploads` to 5018):
   `cd Frontend && npm run dev`

## Runbook

- E2E smoke: `cd /tmp/opencode && node e2e10.js` (needs both servers up; unique emails/phones per run). Canonical targets: backend `http://localhost:5018/api`, AI `:8000`, frontend `:5173`.
- Live stack final state (verified 2026-09-12): backend :5018 (200), frontend :5173 (200), FastAPI :8000 (200); full E2E against :5018 = 19/19 PASS.
- AI tests: `./AI/.venv/bin/python -m pytest AI/tests -q`