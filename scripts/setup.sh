#!/bin/bash
# Setup script
echo "Installing dependencies..."
npm install

echo "Creating project directories..."
mkdir -p ./data/src ./data/config ./data/public ./data/logs

echo "Setup complete. Run: npm run start-server"
