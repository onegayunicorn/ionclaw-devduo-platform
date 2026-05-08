#!/bin/bash
set -e
PORT=8080
echo "🔍 Checking port $PORT..."
# Find process using port 8080
PID=$(lsof -ti :$PORT || true)
if [ -z "$PID" ]; then
  echo "✅ Port $PORT is free"
  exit 0
fi
echo "⚠️ Port $PORT is used by PID: $PID"
echo "🔪 Killing process..."
kill -9 $PID
# Verify
sleep 1
PID_AFTER=$(lsof -ti :$PORT || true)
if [ -z "$PID_AFTER" ]; then
  echo "✅ Port $PORT freed successfully"
else
  echo "❌ Failed to free port"
  exit 1
fi
