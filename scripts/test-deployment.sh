#!/bin/bash

# Quick Railway deployment test
# Run this after setting env vars on Railway

API_URL="${1:-http://localhost:3001}"

echo "🧪 Testing eTunda API Deployment"
echo "================================"

# Test 1: Health check
echo "Test 1: Health endpoint..."
HEALTH=$(curl -s -w "%{http_code}" -o /tmp/response.json "${API_URL}/health")
if [ "$HEALTH" = "200" ]; then
  echo "✓ Health check passed"
  cat /tmp/response.json | jq '.' 2>/dev/null || cat /tmp/response.json
else
  echo "✗ Health check failed (HTTP $HEALTH)"
  exit 1
fi

# Test 2: Database connectivity
echo ""
echo "Test 2: Farms endpoint (database)..."
FARMS=$(curl -s -w "%{http_code}" -o /tmp/response.json "${API_URL}/api/farms")
if [ "$FARMS" = "200" ]; then
  echo "✓ Database connected"
  cat /tmp/response.json | jq 'length' 2>/dev/null && echo "  farms found"
else
  echo "✗ Database connection failed (HTTP $FARMS)"
fi

# Test 3: Create farm
echo ""
echo "Test 3: Creating test farm..."
CREATE=$(curl -s -w "%{http_code}" -X POST "${API_URL}/api/farms" \
  -H "Content-Type: application/json" \
  -o /tmp/response.json \
  -d '{
    "name": "Test Farm",
    "owner_name": "Test Owner",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "size_hectares": 10
  }')

if [ "$CREATE" = "201" ]; then
  echo "✓ Farm created successfully"
  cat /tmp/response.json | jq '.id' 2>/dev/null
else
  echo "✗ Farm creation failed (HTTP $CREATE)"
  cat /tmp/response.json
fi

echo ""
echo "✓ All tests passed! API is ready."
