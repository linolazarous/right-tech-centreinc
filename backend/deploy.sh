#!/bin/bash

# DigitalOcean Backend Deployment Script
set -e

echo "🚀 Starting DigitalOcean Backend Deployment"

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed. Please install it first:"
    echo "   macOS: brew install doctl"
    echo "   Linux: https://github.com/digitalocean/doctl#installing-doctl"
    echo "   Windows: https://github.com/digitalocean/doctl#installing-doctl"
    exit 1
fi

# Check if user is logged in
if ! doctl account get &> /dev/null; then
    echo "❌ Please log in to DigitalOcean first:"
    echo "   doctl auth init"
    exit 1
fi

# Configuration with your details
APP_NAME="righttechcentre-backend"
REGION="nyc3"  # Changed to match your current region
GITHUB_REPO="linolazarous/right-tech-centreinc"

# Correct URLs
BACKEND_URL="https://righttechcentre-kn5oq.ondigitalocean.app"
FRONTEND_URL="https://righttechcentre-iyysq.ondigitalocean.app"  # Fixed typo

# Create app.yaml configuration
cat > app.yaml << EOF
name: $APP_NAME
region: $REGION
services:
- name: api
  github:
    repo: $GITHUB_REPO
    branch: main  # Changed from master to main
  source_dir: /
  run_command: npm start
  build_command: npm install
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "8080"
  - key: FRONTEND_URL
    value: $FRONTEND_URL
  - key: CORS_ORIGIN
    value: $FRONTEND_URL
EOF

echo "📋 Created app.yaml configuration"
echo "🔗 Backend URL: $BACKEND_URL"
echo "🔗 Frontend URL: $FRONTEND_URL"

# Deploy to DigitalOcean
echo "🔄 Deploying to DigitalOcean App Platform..."
doctl apps create --spec app.yaml

echo "✅ Deployment initiated! Check your DigitalOcean dashboard for status."
echo "📝 Note: It may take a few minutes for the deployment to complete."
echo "🌐 Your backend will be available at: $BACKEND_URL"

# Clean up
rm app.yaml

echo "🎉 Deployment script completed!"
