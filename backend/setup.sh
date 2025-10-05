#!/bin/bash

# Setup script for DigitalOcean deployment preparation
set -e

echo "🔧 Setting up for DigitalOcean Deployment"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Correct URLs
BACKEND_URL="https://righttechcentre-kn5oq.ondigitalocean.app"
FRONTEND_URL="https://righttechcentre-iyysq.ondigitalocean.app"  # Fixed typo

# Create necessary files for DigitalOcean deployment
echo "📁 Creating deployment files..."

# Create .env.example if it doesn't exist
if [ ! -f .env.example ]; then
    cat > .env.example << EOF
NODE_ENV=production
PORT=8080
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=$FRONTEND_URL
CORS_ORIGIN=$FRONTEND_URL
EOF
    echo "✅ Created .env.example"
fi

# Create Procfile for DigitalOcean
if [ ! -f Procfile ]; then
    cat > Procfile << EOF
web: npm start
EOF
    echo "✅ Created Procfile"
fi

# Create .do directory and app.yaml template
mkdir -p .do
cat > .do/app.yaml << EOF
name: righttechcentre-backend
region: nyc3
services:
- name: api
  github:
    repo: linolazarous/right-tech-centreinc
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

echo "✅ Created .do/app.yaml template"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup completed! Please:"
echo "1. Update .env.example with your actual environment variables"
echo "2. Run ./deploy.sh to deploy"
echo "3. Your frontend will connect to: $BACKEND_URL"
