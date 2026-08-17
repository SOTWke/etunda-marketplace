# eTunda Marketplace — Production Deployment Guide

## Cloud Stack Recommendation

**Frontend:** Vercel  
**Backend API:** Railway  
**Database:** Railway Postgres + PostGIS  
**Cache:** Railway Redis  
**CI/CD:** GitHub Actions  
**Registry:** GitHub Container Registry (ghcr.io)

---

## Prerequisites

1. GitHub account (with repository pushed)
2. Railway account (https://railway.app)
3. Vercel account (https://vercel.com)
4. Docker Hub account (optional, for public image sharing)

---

## Step 1: Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/etunda-marketplace.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Railway

### 2.1 Create a new Railway project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub
5. Select `etunda-marketplace` repository
6. Click "Deploy"

### 2.2 Add PostgreSQL + PostGIS
1. In Railway dashboard, click "+ Add Service"
2. Select "PostgreSQL"
3. Configure:
   - Name: `etunda-postgres`
   - Version: 15+
   - Click "Deploy"

### 2.3 Add Redis
1. Click "+ Add Service"
2. Select "Redis"
3. Name: `etunda-redis`
4. Version: 7.x
5. Click "Deploy"

### 2.4 Configure Backend API Service
1. Click on the service you deployed from GitHub
2. Go to "Settings" tab
3. Set **Start Command:**
   ```
   npm run build && npm start
   ```
   (Backend only, adjust based on monorepo structure)

4. Set **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `DATABASE_URL`: (auto-linked from PostgreSQL service)
   - `REDIS_URL`: (auto-linked from Redis service)
   - `WHATSAPP_TOKEN`: (add your token)
   - `STRIPE_SECRET`: (add your secret key)
   - `JWT_SECRET`: (generate with `openssl rand -base64 32`)

5. Link services:
   - Click "Plugins" 
   - Add PostgreSQL and Redis (they auto-populate DATABASE_URL and REDIS_URL)

6. Deploy! Railway auto-deploys on push to main

### 2.5 Enable PostGIS on PostgreSQL

SSH into PostgreSQL container:
```bash
psql -U postgres -d postgres
CREATE EXTENSION postgis;
\c etunda
CREATE EXTENSION postgis;
\dx
```

Or run migration on startup (add to app entrypoint):
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Step 3: Deploy Backend with Docker

If deploying backend separately (microservices):

### 3.1 Enable Docker builds in Railway

In Railway dashboard for backend service:
- Go to "Settings"
- Under "Deploy", select "Docker"
- Set Dockerfile path: `./backend/Dockerfile`
- Railway auto-builds on push

### 3.2 Verify deployment
```bash
# Get service URL from Railway dashboard
curl https://your-backend-service.railway.app/health
# Should return: { "status": "ok", "timestamp": "..." }
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Import GitHub repo
1. Go to https://vercel.com/new
2. Select GitHub
3. Authorize and find `etunda-marketplace`
4. Click "Import"

### 4.2 Configure deployment
1. **Root Directory:** Leave blank (mono-repo root) or set to `.`
2. **Build Command:** `npm run build`
3. **Install Command:** `npm install`
4. **Start Command:** `npm start`
5. **Framework:** Auto-detect → Next.js

### 4.3 Set Environment Variables
1. Go to "Settings" > "Environment Variables"
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app
   DATABASE_URL=postgresql://... (if needed for ISR/SSG)
   REDIS_URL=redis://... (if needed for caching)
   ```

### 4.4 Deploy
Click "Deploy" — Vercel builds and pushes to edge network in ~2 min

---

## Step 5: GitHub Actions CI/CD (Automated Testing & Image Push)

Already configured in `.github/workflows/build-and-push.yml`

### 5.1 Add Docker Hub Secrets (optional)
Go to GitHub repo → Settings → Secrets and variables → Actions

Add:
```
DOCKER_HUB_USERNAME=your-username
DOCKER_HUB_TOKEN=your-token (create on hub.docker.com)
```

### 5.2 Or use GitHub Container Registry (free, recommended)
Update workflow to push to `ghcr.io`:
```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

---

## Step 6: Database Setup

### 6.1 Run migrations on deployment

Add to `backend/package.json`:
```json
{
  "scripts": {
    "migrate": "node scripts/migrate.js",
    "postinstall": "npm run migrate"
  }
}
```

Create `backend/scripts/migrate.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const sql = require('fs').readFileSync('./db/init.sql', 'utf-8');
    await pool.query(sql);
    console.log('✓ Database schema migrated');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err);
    process.exit(1);
  }
})();
```

### 6.2 Backup strategy
Railway auto-backups daily. For production:
1. Enable PostgreSQL automated backups (Railway does this by default)
2. Export to S3 weekly via cronjob (coming soon)

---

## Step 7: Environment Variables Summary

### Frontend (.env.production on Vercel)
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Backend (.env on Railway auto-set)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/etunda
REDIS_URL=redis://host:6379
WHATSAPP_TOKEN=your_token_here
STRIPE_SECRET=sk_live_...
STRIPE_PUBLISHABLE=pk_live_...
JWT_SECRET=generated_secret
```

---

## Step 8: Monitoring & Logs

### Railway Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Vercel Logs
Dashboard → Deployments → click deployment → "Logs"

### Set up alerts
- Railway: Go to project → Alerts → Create
- Vercel: Settings → Alerts

---

## Step 9: Custom Domain

### 9.1 Frontend (Vercel)
1. Settings → Domains
2. Add your domain (e.g., `etunda.com`)
3. Update DNS to Vercel nameservers

### 9.2 Backend (Railway)
1. In Railway dashboard, select backend service
2. Settings → Networking → Public Networking
3. Copy the public URL or add custom domain via DNS

---

## Deployment Checklist

- [ ] GitHub repo created and pushed
- [ ] Railway project created with PostgreSQL + Redis
- [ ] Backend deployed to Railway with env vars set
- [ ] Frontend deployed to Vercel with NEXT_PUBLIC_API_URL set
- [ ] PostGIS extension enabled on database
- [ ] GitHub Actions workflow triggered and passed
- [ ] `/health` endpoint returns 200 OK
- [ ] Frontend can reach backend API (CORS configured if needed)
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Custom domain(s) added

---

## Estimated Costs (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | $20-50 | Scales with traffic; free tier available |
| Railway Backend | $5-20 | Includes 100GB bandwidth free |
| Railway PostgreSQL | $8-30 | $0.15/GB storage |
| Railway Redis | $2-5 | $0.15/GB |
| Domain (optional) | $12-15 | Namecheap, Route 53, etc. |
| **Total** | **$47-120** | Scales to millions of requests |

Compare to AWS: $300-500+/month for equivalent setup.

---

## Troubleshooting

### API timeout on Railway
- Increase memory: Settings → Resources → CPU/Memory
- Check logs: `railway logs`

### PostGIS not available
```sql
-- In Railway PostgreSQL terminal
CREATE EXTENSION postgis;
```

### Vercel can't reach backend
- Check `NEXT_PUBLIC_API_URL` is public (not localhost)
- Verify CORS headers in Express (add `app.use(cors())`)
- Check Railway service is "Running" (green status)

### Database connection fails
- Verify `DATABASE_URL` in Railway service vars
- Check PostgreSQL service is running
- Test connection: `psql $DATABASE_URL`

---

## Next: Production Hardening

Once deployed, implement:
1. Rate limiting (express-rate-limit)
2. API authentication (JWT via NextAuth)
3. HTTPS + HSTS headers
4. Content Security Policy
5. Database encryption at rest
6. Secrets rotation
7. Structured logging
8. APM/error tracking (Sentry)
