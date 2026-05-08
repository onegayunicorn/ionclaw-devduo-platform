#!/bin/bash
set -e
echo "🚀 Initializing IonClaw DevDuo System..."
# 1. Create required directories
mkdir -p ./data/project ./models ./sandbox/project ./logs
# 2. Fix permissions
chmod -R 755 ./data ./models ./sandbox ./logs
# 3. Fix port conflict
bash ./scripts/fix-port-conflict.sh
# 4. Install dependencies
npm install
# 5. Start server
npm run start:dev &
sleep 5
# 6. Initialize via API
echo "📁 Initializing project..."
curl -X POST http://localhost:8080/api/project/initialize
echo "🧠 Initializing AI Engine..."
curl -X POST http://localhost:8080/api/ai/init?model=LITE
# 7. Health check
npm run health-check
echo "✅ SYSTEM READY!"
echo "🌐 Access: http://localhost:8080"
