# eTunda Marketplace — Production Deployment Guide

## 🎯 Recommended Stack

| Component | Platform | Cost/mo | Setup Time |
|-----------|----------|---------|------------|
| **Frontend** | Vercel | $20-50 | 5 min |
| **Backend API** | Railway | $5-20 | 10 min |
| **PostgreSQL + PostGIS** | Railway | $8-30 | 5 min |
| **Redis** | Railway | $2-5 | 5 min |
| **CI/CD** | GitHub Actions | Free | 5 min |
| **Registry** | GitHub Container Registry | Free | — |
| **Domain** | Namecheap/Route53 | $12-15 | 10 min |
| **Total** | | **$47-120** | **40 min** |

**Why this stack is better than AWS/GCP:**
- ✅ **No DevOps overhead** — deploy with git push, auto-scaling included
- ✅ **Transparent pricing** — pay for what you use, no hidden costs
- ✅ **Fast iteration** — redeploy in 30 seconds
- ✅ **Scales to millions** — handles 100K+ daily active users without rearchitecting
- ✅ **Team-friendly** — no Kubernetes, IAM policies, or infrastructure code

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub (github.com/YOUR_USERNAME/etunda-marketplace)
- [ ] GitHub account created and repo is public (for GitHub Actions)
- [ ] Railway account created (https://railway.app)
- [ ] Vercel account created (https://vercel.com)
- [ ] WhatsApp Business API token (optional, for MVP use demo)
- [ ] Stripe keys (optional, for MVP use test keys)
- [ ] Custom domain registered (optional)

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Initial commit: eTunda Marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etunda-marketplace.git
git push -u origin main
```

Go to GitHub repo Settings → Make repo **Public** (required for free GitHub Actions).

---

### Step 2: Deploy Backend to Railway (10 min)

#### 2.1 Create Railway Project
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize GitHub and select your `etunda-marketplace` repo
5. Railway auto-detects Node.js app and starts build

#### 2.2 Add PostgreSQL Service
1. In Railway project, click **"+ Add Service"**
2. Select **"PostgreSQL"**
3. Railway creates database automatically
4. **Copy the `DATABASE_URL` from service vars** (you'll need this)

#### 2.3 Add Redis Service
1. Click **"+ Add Service"** again
2. Select **"Redis"**
3. Railway creates cache automatically
4. **Copy the `REDIS_URL`** (you'll need this)

#### 2.4 Configure Backend Service
1. Go to your main Node.js service (the GitHub deployment)
2. Go to **Settings** tab
3. Set **Root Directory:** `backend/` (if using this structure)
4. Set **Start Command:**
   ```
   npm run build && npm start
   ```
5. Go to **Variables** tab and add:
   ```
   NODE_ENV=production
   PORT=3001
   ```
6. **Link PostgreSQL & Redis:**
   - Click "Plugins" section
   - Add PostgreSQL (auto-populates `DATABASE_URL`)
   - Add Redis (auto-populates `REDIS_URL`)
7. Add secrets:
   ```
   WHATSAPP_TOKEN=your_token_or_demo
   STRIPE_SECRET=your_secret_or_test_key
   JWT_SECRET=<generate: openssl rand -base64 32>
   ```

#### 2.5 Enable PostGIS on PostgreSQL
Railway PostgreSQL includes PostGIS. Run this once after first deployment:

```bash
# SSH into Railway PostgreSQL
psql $DATABASE_URL -c "CREATE EXTENSION postgis;"
psql $DATABASE_URL -c "CREATE EXTENSION uuid-ossp;"

# Verify
psql $DATABASE_URL -c "\dx"
```

Or Railway will auto-create these on first schema migration if added to `db/init.sql`.

#### 2.6 Test Backend
```bash
# Get your Railway backend public URL from dashboard
curl https://your-railway-backend.up.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Backend is now live!** Copy the public URL (e.g., `https://etunda-api-prod.up.railway.app`).

---

### Step 3: Deploy Frontend to Vercel (5 min)

#### 3.1 Import to Vercel
1. Go to https://vercel.com/new
2. Click **"Import GitHub Project"**
3. Authorize GitHub
4. Select `etunda-marketplace`
5. Click **"Import"**

#### 3.2 Configure Build Settings
1. **Framework Preset:** Auto-detect → Next.js ✓
2. **Root Directory:** `.` (leave blank for monorepo root)
3. **Build Command:** `npm run build`
4. **Install Command:** `npm install`
5. **Output Directory:** `.next`

#### 3.3 Set Environment Variables
1. Go to **Settings** > **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```
3. Click **"Save"**

#### 3.4 Deploy
1. Click **"Deploy"**
2. Vercel builds and deploys in ~2 minutes
3. You'll get a URL like: `https://etunda-marketplace.vercel.app`

**Frontend is live!** Test it at that URL.

---

### Step 4: CI/CD Automation (GitHub Actions)

GitHub Actions is already configured in `.github/workflows/`:

1. **`build-and-push.yml`** — Runs on every PR (tests, linting)
2. **`deploy-production.yml`** — Runs on `git push main` (builds & pushes to ghcr.io)

When you push to main:
```bash
git push origin main
```

GitHub Actions automatically:
- ✅ Tests your code (linting, build)
- ✅ Builds Docker images
- ✅ Pushes to GitHub Container Registry (ghcr.io)
- ✅ Railway detects new image → redeploys

**No manual deployment needed after this!**

---

### Step 5: Add Custom Domain (Optional)

#### Frontend (Vercel)
1. Go to Vercel project → **Settings** > **Domains**
2. Add your domain (e.g., `app.etunda.io`)
3. Follow DNS instructions
4. Auto-HTTPS in 24h

#### Backend (Railway)
1. Go to Railway service → **Settings** > **Networking**
2. Copy the public Railway URL
3. Or add custom domain via DNS CNAME

---

## 📊 Production Environment Variables

### Frontend (.env on Vercel)
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_GA_ID=your_analytics_id (optional)
```

### Backend (.env on Railway, auto-linked)
```
# Automatically set by Railway
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Manual secrets (set in Railway dashboard)
NODE_ENV=production
PORT=3001
WHATSAPP_TOKEN=your_whatsapp_token
STRIPE_SECRET=sk_live_...
STRIPE_PUBLISHABLE=pk_live_...
JWT_SECRET=your_secret_key
```

---

## 🔍 Testing Production Deployment

After deployment, test the full stack:

```bash
# 1. Frontend loads
curl https://your-frontend.vercel.app

# 2. API health check
curl https://your-api.railway.app/health

# 3. Database connectivity
curl https://your-api.railway.app/api/farms

# 4. Create test data
curl -X POST https://your-api.railway.app/api/farms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farm",
    "owner_name": "John",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "size_hectares": 10
  }'

# 5. Login to frontend
# Open frontend in browser, go to /auth/signin
# Demo accounts:
#   buyer@etunda.com / demo123
#   farmer@etunda.com / demo123
#   admin@etunda.com / demo123
```

---

## 📈 Monitoring & Logs

### Railway Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View real-time logs
railway logs

# View specific service
railway logs --service etunda-api
```

### Vercel Logs
- Dashboard → **Deployments** → click deployment → **Logs**
- Or: Dashboard → **Monitoring** → **Logs**

### Error Tracking (Optional)
Add Sentry for error monitoring:
```bash
npm install @sentry/nextjs @sentry/node
```

---

## 💾 Backups & Recovery

### Railway PostgreSQL Backups
- Automatic daily backups (7-day retention)
- Go to Railway PostgreSQL service → **Backup**
- Download or restore anytime

### Manual Backup
```bash
psql $DATABASE_URL -c "VACUUM ANALYZE"
pg_dump $DATABASE_URL > backup.sql
```

### Restore
```bash
psql $DATABASE_URL < backup.sql
```

---

## 🔐 Security Checklist

- [ ] Change demo passwords in production
- [ ] Rotate JWT_SECRET, STRIPE_SECRET, WHATSAPP_TOKEN
- [ ] Enable HTTPS everywhere (auto on Vercel/Railway)
- [ ] Add rate limiting to API (already in backend template)
- [ ] Enable database encryption (Railway default)
- [ ] Set up API authentication (NextAuth already scaffolded)
- [ ] Add Content Security Policy headers
- [ ] Enable CORS only for your frontend domain
- [ ] Rotate secrets quarterly
- [ ] Enable audit logging

---

## 🐛 Troubleshooting

### API timeout on Railway
```bash
# Increase memory in Railway settings
# Settings → Resources → CPU/Memory
# Set to at least 512MB for production
```

### Vercel can't reach API
```bash
# Check NEXT_PUBLIC_API_URL is set correctly
# Must be HTTPS, not localhost
# Verify CORS enabled in backend:
# app.use(cors());
```

### Database connection fails
```bash
# Verify DATABASE_URL is set in Railway
# Test connection:
psql $DATABASE_URL -c "SELECT 1"

# If fails, check:
# 1. PostgreSQL service is running (green status)
# 2. Network access allowed
# 3. Credentials correct
```

### PostGIS not found
```bash
# Reconnect to PostgreSQL and enable extension:
psql $DATABASE_URL -c "CREATE EXTENSION postgis;"
```

### Out of memory
```bash
# Check usage: railway logs | grep memory
# Increase Railway memory limits
# Or optimize queries in backend
```

---

## 🚦 Scaling Strategy

| Stage | Users/day | Action |
|-------|-----------|--------|
| **MVP** | < 1K | Current setup (Railway free tier) |
| **Growth** | 1K-10K | Upgrade to Railway Pro ($5-20) |
| **Scale** | 10K-100K | Add Railway memory (2GB), enable auto-scaling |
| **Enterprise** | 100K+ | Consider Kubernetes (EKS/GKE) or managed services |

---

## 📞 Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **PostgreSQL + PostGIS:** https://postgis.net/documentation
- **GitHub Actions:** https://docs.github.com/en/actions

---

## ✅ Deployment Checklist

Before going live to production:

- [ ] Code tested locally (`npm run dev`)
- [ ] All secrets added to Railway & Vercel
- [ ] Database schema migrated (`CREATE EXTENSION postgis`)
- [ ] API health endpoint returns 200
- [ ] Frontend can reach backend API
- [ ] Login page works (try demo accounts)
- [ ] WhatsApp integration tested (or disabled)
- [ ] Stripe keys configured (or use test keys)
- [ ] Backups enabled on PostgreSQL
- [ ] Error tracking set up (optional: Sentry)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate auto-renewed (auto on Vercel/Railway)
- [ ] Analytics enabled (optional: Vercel Analytics, Google Analytics)
- [ ] Rate limiting active on API

---

## 🎉 You're Live!

Your eTunda Marketplace is now in production. Monitor the logs, set up alerts, and iterate based on user feedback.

**Next steps:**
1. Configure additional integrations (WhatsApp, Stripe)
2. Add role-based access controls
3. Implement live market data feeds
4. Scale database with read replicas
5. Add CDN for image optimization

Happy farming! 🚀
