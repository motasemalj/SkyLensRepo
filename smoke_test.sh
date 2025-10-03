#!/bin/bash

# SkyLens Smoke Test - Railway Deployment
# This script verifies that the deployed frontend and backend are working correctly

echo "🧪 SkyLens Railway Deployment Smoke Test"
echo "========================================"
echo ""

# Configuration
BACKEND_URL="https://meticulous-creativity-production.up.railway.app"
FRONTEND_URL="https://skylensrepo-production.up.railway.app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected_status, got $response)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to test CORS
test_cors() {
    local name=$1
    local url=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing CORS for $name... "
    
    cors_header=$(curl -s -I -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -X OPTIONS "$url" | grep -i "access-control-allow-origin")
    
    if echo "$cors_header" | grep -q "$FRONTEND_URL"; then
        echo -e "${GREEN}✓ PASS${NC} (CORS configured correctly)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (CORS not configured or incorrect)"
        echo "   Expected: $FRONTEND_URL"
        echo "   Got: $cors_header"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Test 1: Backend Health Check
echo "1️⃣  Backend Tests"
echo "   ----------------"
test_endpoint "Backend Health" "$BACKEND_URL/health" "200"

# Test 2: Backend CORS
test_cors "Backend Signup" "$BACKEND_URL/api/auth/signup"

echo ""

# Test 3: Frontend Homepage
echo "2️⃣  Frontend Tests"
echo "   ----------------"
test_endpoint "Frontend Homepage" "$FRONTEND_URL" "200"

# Test 4: Frontend Signup Page
test_endpoint "Signup Page" "$FRONTEND_URL/signup" "200"

# Test 5: Frontend Dashboard (should redirect to signin)
test_endpoint "Dashboard Redirect" "$FRONTEND_URL/dashboard" "200"

echo ""

# Test 6: Check if frontend is calling correct backend
echo "3️⃣  Integration Tests"
echo "   -------------------"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing frontend API calls... "

# Download the frontend page and check if it contains localhost references
frontend_content=$(curl -s "$FRONTEND_URL")

if echo "$frontend_content" | grep -q "localhost:4001"; then
    echo -e "${RED}✗ FAIL${NC}"
    echo "   Frontend still references localhost:4001"
    echo "   This means NEXT_PUBLIC_API_URL wasn't set during build"
    FAILED_TESTS=$((FAILED_TESTS + 1))
else
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   No localhost references found"
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

echo ""

# Test 7: Cloudinary Image Configuration
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing Cloudinary configuration... "

if echo "$frontend_content" | grep -q "res.cloudinary.com/dm2sd9t1n"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "   Cloudinary URL configured correctly"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
    echo "   Cloudinary references not found (may be loaded dynamically)"
    # Don't count this as a failure
    TOTAL_TESTS=$((TOTAL_TESTS - 1))
fi

echo ""
echo "========================================"
echo "📊 Test Results"
echo "========================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment is healthy.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
    echo ""
    echo "📋 Troubleshooting Steps:"
    echo "1. Verify environment variables in Railway are set correctly"
    echo "2. Check that both frontend and backend have been redeployed"
    echo "3. Review RAILWAY_FIX_GUIDE.md for detailed instructions"
    echo "4. Check Railway deployment logs for errors"
    exit 1
fi

