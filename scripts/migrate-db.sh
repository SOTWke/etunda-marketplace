#!/bin/bash

# eTunda Migration Script
# Runs database schema migrations on startup

set -e

echo "🔄 Running database migrations..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set, skipping migrations"
  exit 0
fi

# Wait for database to be ready
max_attempts=30
attempt=1
while ! psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; do
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Database not ready after $max_attempts attempts"
    exit 1
  fi
  echo "⏳ Waiting for database... (attempt $attempt/$max_attempts)"
  sleep 2
  ((attempt++))
done

echo "✓ Database is ready"

# Run migrations
psql "$DATABASE_URL" <<EOF
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

$(cat ./db/init.sql)

EOF

echo "✓ Migrations complete"
