#!/usr/bin/env bash
# ==============================================================================
# Automated Daily Agmarknet Ingestion & Model Retraining Cron Script
# Suggested Linux Crontab Entry (runs daily at 2:00 AM IST):
# 0 2 * * * /home/nafisa/D\ Drive/Nafisa\ college\ materials/Hackathon/AI/cron/daily_retrain.sh >> /home/nafisa/D\ Drive/Nafisa\ college\ materials/Hackathon/AI/reports/cron.log 2>&1
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$AI_DIR/.." && pwd)"

LOG_FILE="$AI_DIR/reports/daily_retrain.log"
mkdir -p "$AI_DIR/reports"

echo "==================================================================" >> "$LOG_FILE"
echo "[CRON] Starting Daily Retraining Pipeline: $(date)" >> "$LOG_FILE"
echo "==================================================================" >> "$LOG_FILE"

cd "$WORKSPACE_ROOT"
export PYTHONPATH="$WORKSPACE_ROOT"

# Run the retraining pipeline using the isolated venv
"$AI_DIR/.venv/bin/python" -m AI.src.pipeline.daily_retrain >> "$LOG_FILE" 2>&1

echo "[CRON] Daily Retraining Pipeline Finished Successfully: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
