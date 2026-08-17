# eTunda Marketplace

A Next.js App Router B2B agritech marketplace prototype with a responsive global-trade interface, live quote estimator, product marketplace, compliance workflow, modal lead capture, and WhatsApp enquiry action.

It also includes a mobile-first farmer/field-agent harvest-registration interaction, price transparency signals, and an operating-system view of sourcing, quality control, drying and distribution.

## Run locally

1. Open this folder in Visual Studio Code.
2. In the integrated terminal, run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Before production

- Replace the placeholder WhatsApp number in `app/page.tsx`.
- Replace remote photo URLs with licensed image assets hosted in your CDN.
- Add a real PDF to `public/export-specs.pdf` or change the download link.
- Connect quote calculations, lead capture, escrow, live market data and tracking to authenticated server-side APIs.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the production system design and [WIREFRAMES.md](WIREFRAMES.md) for the implemented interactive-prototype map.
