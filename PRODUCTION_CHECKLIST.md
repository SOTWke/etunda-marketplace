# Production deployment checklist

Before deploying to production, verify:

## Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run build` completes without errors
- [ ] All TypeScript errors resolved
- [ ] No `console.error()` or `debugger` in production code

## Security
- [ ] No secrets in environment variables file
- [ ] All secrets set via Railway/Vercel dashboard
- [ ] JWT_SECRET generated and stored securely
- [ ] CORS configured for your domain only
- [ ] No API keys logged to stdout

## Database
- [ ] PostgreSQL schema migrated
- [ ] PostGIS extension enabled (`CREATE EXTENSION postgis`)
- [ ] Backup strategy in place
- [ ] Connection pooling configured

## Frontend
- [ ] `NEXT_PUBLIC_API_URL` set to production API URL
- [ ] Authentication flow tested (login/logout)
- [ ] Error pages configured (404, 500)
- [ ] Favicon and metadata set
- [ ] Analytics configured (optional)

## Backend
- [ ] Health endpoint returns 200
- [ ] Database connection works (`/api/farms` returns data)
- [ ] Redis connection works
- [ ] Error logging configured
- [ ] Rate limiting active

## DevOps
- [ ] Docker images build successfully
- [ ] GitHub Actions secrets configured
- [ ] Railway PostgreSQL backups enabled
- [ ] Vercel deployment logs clean
- [ ] Custom domain configured (optional)

## Testing
- [ ] Manual API testing with `curl` or Postman
- [ ] Login flow works
- [ ] Create/read/update endpoints tested
- [ ] Error handling verified
- [ ] Load testing (optional: `k6` or `locust`)

## Monitoring
- [ ] Error tracking set up (Sentry optional)
- [ ] Logging aggregation configured (optional)
- [ ] Uptime monitoring enabled
- [ ] Alert thresholds set
