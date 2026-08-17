# eTunda production architecture

## Product boundaries

The supplied code is a fast public web and MVP portal prototype. Production operations must keep browser UI, identity, pricing, payments and messaging on separate security boundaries.

```
Next.js on Vercel / CloudFront
  ├─ Public SEO pages (SSG + ISR)
  ├─ Authenticated Buyer, Farmer and Admin portals
  └─ Server-side BFF / Route Handlers
          ├─ PostgreSQL + PostGIS (users, farms, lots, RFQs, orders, routes)
          ├─ Redis (price/widget cache, rate limiting, jobs)
          ├─ Object Storage (certificates, inspection files, media)
          ├─ Queue/Event Bus (order, inspection, dispatch events)
          ├─ WhatsApp Business API + Twilio SMS
          ├─ Payments: Stripe + M-Pesa/Flutterwave/Paystack
          └─ CMS: Sanity or Strapi (localized public content)
```

## Core records

- `Farm`, `FarmGroup`, `FieldAgent`, and `HarvestForecast`
- `ProduceLot`: origin, harvest date, grade, packaging, moisture, certificates
- `RFQ`, `Quote`, `Order`, `EscrowMilestone`, and `Payment`
- `Inspection`, `ColdChainReading`, `Shipment`, and `DeliveryProof`
- `MessageConsent` and `Notification` (WhatsApp/SMS/email)

## Reliability and security controls

- Authorize every API action at the server; do not trust role or price data from the browser.
- Use idempotency keys for payment, quote acceptance and order state changes.
- Record an immutable event trail for lot, inspection, custody and payment milestones.
- Encrypt PII, audit privileged actions, rotate integration secrets, and validate webhooks.
- Add CSP, rate limiting, bot protection, consent tracking, backups and disaster-recovery tests.
- Store media/CDN assets in regional object storage; serve optimized WebP/AVIF variants.

## Delivery plan

1. Launch public catalog, price signals, RFQ, farmer intake and WhatsApp triage.
2. Add verified accounts, lot onboarding, role dashboards and order tracking.
3. Add inspection/cold-chain events, payment workflows and finance partner integrations.
4. Add multi-country tax/currency/localisation, exports and enterprise procurement APIs.
