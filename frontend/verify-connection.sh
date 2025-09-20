#!/bin/bash

# verify-connection.sh
# Script to verify connection between frontend and backend

echo "🔍 Verifying Frontend-Backend Connection"
echo "=========================================="

# Configuration - UPDATED WITH CORRECT URLs
BACKEND_URL="https://righttechcentre-kn5oq.ondigitalocean.app"
FRONTEND_URL="https://righttechcentre.vercel.app"  # CORRECT VERCEL FRONTEND
TIMEOUT=10  # seconds

echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Function to check URL with timeout
check_url() {
    local url=$1
    local description=$2
    echo "Testing $description..."
    
    # Use curl with timeout and follow redirects
    if curl -s -f --max-time $TIMEOUT "$url" > /dev/null; then
        echo "✅ $description is accessible"
        return 0
    else
        echo "❌ $description is NOT accessible (timeout after ${TIMEOUT}s)"
        return 1
    fi
}

# Function to test CORS headers
test_cors() {
    echo "Testing CORS configuration..."
    
    # Test if backend allows frontend origin
    local cors_header=$(curl -s -I -H "Origin: $FRONTEND_URL" "$BACKEND_URL" | grep -i "access-control-allow-origin")
    
    if [ -n "$cors_header" ]; then
        echo "✅ CORS configured: $cors_header"
        return 0
    else
        echo "⚠️  No CORS headers detected. Backend might not be configured for CORS"
        echo "   Backend needs to allow requests from: $FRONTEND_URL"
        return 1
    fi
}

# Function to test API endpoints
test_api_endpoints() {
    echo ""
    echo "Testing specific API endpoints..."
    
    local endpoints=(
        "/health"
        "/api/health"
        "/api/auth/health"
        "/auth/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        echo -n "Testing $endpoint... "
        if curl -s --max-time 5 "$BACKEND_URL$endpoint" > /dev/null; then
            echo "✅"
        else
            echo "❌"
        fi
    done
}

# Main verification
echo "Starting connection tests..."
echo ""

# Test backend accessibility
if check_url "$BACKEND_URL" "Backend"; then
    # Test CORS if backend is accessible
    test_cors
    test_api_endpoints
else
    echo ""
    echo "❌ Backend is not accessible. Please check:"
    echo "   - Is the backend running?"
    echo "   - Check DigitalOcean App Platform status"
fi

echo ""
echo "Testing frontend accessibility..."
check_url "$FRONTEND_URL" "Frontend"

echo ""
echo "📋 Summary:"
echo "==========="
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

echo "🎉 Verification complete!"
echo "If you see CORS issues, ensure your backend allows requests from: $FRONTEND_URL"
