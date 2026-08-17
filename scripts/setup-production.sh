#!/bin/bash

# eTunda Production Setup Script for Railway
# This script prepares the environment for Railway deployment

echo "🚀 eTunda Marketplace - Railway Deployment Setup"
echo "=================================================="

# 1. Create .env.production for deployment
cat > .env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_API_URL=${API_URL}
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}
WHATSAPP_TOKEN=${WHATSAPP_TOKEN}
STRIPE_SECRET=${STRIPE_SECRET}
STRIPE_PUBLISHABLE=${STRIPE_PUBLISHABLE}
JWT_SECRET=${JWT_SECRET}
EOF

echo "✓ Created .env.production"

# 2. Create migration script
mkdir -p scripts
cat > scripts/migrate.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    console.log('Starting database migration...');
    
    // Read init.sql
    const initSQL = fs.readFileSync('./db/init.sql', 'utf-8');
    
    // Run migrations
    const client = await pool.connect();
    try {
      await client.query(initSQL);
      console.log('✓ Database schema migrated successfully');
    } finally {
      client.release();
    }
    
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  }
})();
EOF

chmod +x scripts/migrate.js
echo "✓ Created migration script"

# 3. Update package.json build scripts
echo "✓ Setup complete! Next steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add production deployment config'"
echo "   git push origin main"
echo ""
echo "2. In Railway dashboard:"
echo "   - Connect your GitHub repo"
echo "   - Add PostgreSQL service"
echo "   - Add Redis service"
echo "   - Configure environment variables"
echo "   - Deploy!"
echo ""
echo "3. Enable PostGIS on PostgreSQL:"
echo "   psql \$DATABASE_URL -c 'CREATE EXTENSION postgis;'"
echo ""
echo "4. In Vercel dashboard:"
echo "   - Import your GitHub repo"
echo "   - Set NEXT_PUBLIC_API_URL to Railway backend URL"
echo "   - Deploy!"
