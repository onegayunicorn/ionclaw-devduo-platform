#!/bin/bash
set -e
echo "🚢 Deploying IonClaw DevDuo Platform to Production..."
# 1. Pull latest changes
git pull origin main || echo "⚠️ Git pull failed, continuing..."
# 2. Install production dependencies
npm ci --only=production
# 3. Setup directories
mkdir -p ./data/project ./models ./sandbox/project ./logs
chmod -R 755 ./data ./models ./sandbox ./logs
# 4. Fix port
bash ./scripts/fix-port-conflict.sh
# 5. Start with PM2 or direct node
echo "🚀 Starting server..."
NODE_ENV=production node ionclaw-server/index.js &
echo "✅ Deployment complete!"
