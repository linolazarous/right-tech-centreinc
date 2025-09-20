#!/bin/bash

echo "🔍 Testing Backend Connection..."
echo "Backend: https://righttechcentre-kn5oq.ondigitalocean.app"
echo ""

# Test root endpoint
echo "Testing root endpoint..."
curl -s "https://righttechcentre-kn5oq.ondigitalocean.app/"

# Test health endpoint
echo -e "\n\nTesting health endpoint..."
curl -s "https://righttechcentre-kn5oq.ondigitalocean.app/health"

# Test API endpoint
echo -e "\n\nTesting API endpoint..."
curl -s "https://righttechcentre-kn5oq.ondigitalocean.app/api/test"

# Test CORS
echo -e "\n\nTesting CORS with frontend origin..."
curl -s -I -H "Origin: https://righttechcentre.vercel.app" \
  "https://righttechcentre-kn5oq.ondigitalocean.app/api/test" | grep -i "access-control"

echo -e "\n🎉 Connection tests completed!"
