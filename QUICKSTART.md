# eTunda Marketplace — Local Development & Docker Setup

## Prerequisites
- Docker Desktop (includes Docker & Docker Compose)
- Node.js 22+ (for local frontend development without Docker)
- Git

## Quick Start (Docker)

### 1. Clone and install frontend deps
```bash
npm install
```

### 2. Start the full stack
```bash
docker compose up --pull always
```

This starts:
- **PostgreSQL 17** with PostGIS extension on port 5432
- **Redis 7** on port 6379
- **Next.js frontend** on http://localhost:3000 (hot reload enabled)
- **Node.js API server** on http://localhost:3001

### 3. Initialize the database
Once postgres is healthy, the init script runs automatically:
```sql
-- Runs from db/init.sql on first startup
-- Creates farms, produce_lots, rfqs, quotes, orders tables
```

### 4. Test endpoints
```bash
# Check API health
curl http://localhost:3001/health

# List farms
curl http://localhost:3001/api/farms

# Create a farm
curl -X POST http://localhost:3001/api/farms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nairobi Farm Co.",
    "owner_name": "Jane Mwangi",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "size_hectares": 25.5
  }'
```

## File Structure
```
.
├── app/                    # Next.js frontend (React 18 + TypeScript)
│   ├── page.tsx           # Main marketplace UI
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind styles
├── backend/               # Node.js API server
│   ├── src/
│   │   └── server.ts      # Express app + CRUD endpoints
│   ├── Dockerfile         # Multi-stage build
│   └── package.json
├── db/
│   └── init.sql           # PostgreSQL schema + PostGIS setup
├── Dockerfile             # Next.js multi-stage build
├── docker-compose.yml     # Service orchestration
├── .env.local             # Local secrets (do not commit)
└── .env.example           # Template for .env
```

## Environment Variables
Copy `.env.example` to `.env.local` and fill in real values:
```bash
cp .env.example .env.local
```

Required for production:
- `WHATSAPP_TOKEN` — WhatsApp Business API token
- `STRIPE_SECRET` — Stripe secret key
- `STRIPE_PUBLISHABLE` — Stripe public key
- `DATABASE_URL` — Production PostgreSQL connection (when deploying)

## Development Tips

### Hot Reload
Both frontend and API support file-watching and auto-reload:
- Edit `app/**` → frontend rebuilds instantly
- Edit `backend/src/**` → API server restarts
- Edit `package.json` → full container rebuild

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f api
docker compose logs -f postgres
docker compose logs -f redis
```

### Stop Services
```bash
docker compose down
```

### Reset Everything (wipe database)
```bash
docker compose down -v
docker compose up --pull always
```

## Database Management

### Connect to PostgreSQL CLI
```bash
docker exec -it etunda-postgres psql -U etunda -d etunda
```

### View tables
```sql
\dt
SELECT * FROM farms;
SELECT * FROM produce_lots;
SELECT * FROM rfqs;
```

### Backup database
```bash
docker exec etunda-postgres pg_dump -U etunda -d etunda > backup.sql
```

### Restore from backup
```bash
docker exec -i etunda-postgres psql -U etunda -d etunda < backup.sql
```

## Production Deployment

### Build images for registry
```bash
docker build -t your-registry/etunda-app:latest .
docker build -t your-registry/etunda-api:latest backend/
docker push your-registry/etunda-app:latest
docker push your-registry/etunda-api:latest
```

### Deploy on Docker Swarm or Kubernetes
Update `docker-compose.yml` with:
- Real `DATABASE_URL` (managed RDS/CloudSQL)
- Real `REDIS_URL` (managed Redis/ElastiCache)
- Secrets management (AWS Secrets Manager, HashiCorp Vault)
- Health checks and restart policies
- Resource limits

### Vercel (Frontend Only)
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Connect repo to Vercel dashboard
# Set NEXT_PUBLIC_API_URL to production API endpoint
```

## API Reference

### Farms
- `GET /api/farms` — List all farms
- `POST /api/farms` — Create farm `{ name, owner_name, latitude, longitude, size_hectares }`

### Produce Lots
- `GET /api/produce-lots` — List all lots
- `POST /api/produce-lots` — Create lot `{ farm_id, produce_type, harvest_date, quantity_kg, grade, moisture_percent }`

### RFQs (Requests for Quotation)
- `GET /api/rfqs` — List RFQs
- `POST /api/rfqs` — Create RFQ `{ lot_id, buyer_email, produce_type, requested_quantity_kg }`

### Quotes
- `GET /api/quotes` — List quotes
- `POST /api/quotes` — Create quote `{ rfq_id, quoted_price_per_kg, currency, valid_until }`

### Orders
- `GET /api/orders` — List orders
- `POST /api/orders` — Create order `{ quote_id, buyer_id, seller_id, total_amount, currency }`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### PostgreSQL Connection Failed
```bash
# Check postgres health
docker inspect etunda-postgres | grep -A 5 "Health"

# View postgres logs
docker logs etunda-postgres
```

### Redis Connection Failed
```bash
# Check redis health
docker exec etunda-redis redis-cli ping

# Should return: PONG
```

### Container Build Failed
```bash
# Rebuild without cache
docker compose build --no-cache
docker compose up
```

## Next Steps

1. **Connect to WhatsApp Business API** — Update `WHATSAPP_TOKEN` in backend/src/server.ts
2. **Add Stripe integration** — Implement payment routes in backend
3. **Build role-based dashboards** — Add buyer, farmer, admin portals in Next.js
4. **Add authentication** — Use NextAuth.js or Auth0
5. **Deploy to production** — Push to Vercel (frontend) + Cloud Run/EC2 (backend)
