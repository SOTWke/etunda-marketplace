# eTunda Marketplace

A production-grade B2B agritech marketplace for global produce sourcing, quote negotiation, compliance, and fulfilment visibility.

This project is designed to run as a Vercel-hosted frontend and optionally connect to a backend API for live data, payments, and workflow automation.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- NextAuth.js
- Axios for API integration

## Production-ready Vercel setup

1. Push this branch to GitHub.
2. Import the repository in Vercel.
3. Use the following build settings:
   - Framework: Next.js
   - Root directory: .
   - Build command: npm run build
   - Install command: npm install
   - Output directory: .next
4. Add environment variables in Vercel:

```bash
NEXTAUTH_SECRET=replace_with_a_long_random_secret
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_TRUST_HOST=true
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

5. Deploy.

## Demo login

Use the following local demo credentials while auth is in demo mode:

- buyer@etunda.com / demo123
- farmer@etunda.com / demo123
- admin@etunda.com / demo123

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes

- The app is intentionally resilient when no backend is configured, so it can be deployed to Vercel without failing.
- If you attach a backend, point NEXT_PUBLIC_API_URL to it and the platform will use live data automatically.
- Replace the WhatsApp number and content with your business contact before production launch.

## Recommended follow-up

- Deploy the backend and database separately on a platform such as Railway, Supabase, or Neon.
- Connect auth to a real DB-backed authentication provider.
- Replace demo marketplace data with live catalog and order APIs.
- Add analytics and monitoring after launch.
