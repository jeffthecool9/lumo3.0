# Lumo

Subscription-gated conversation planning and the foundation of a business messaging workspace. The current blue Lumo logo and landing-page colour theme are preserved.

## Current release

- Landing page, prompt draft preservation, light/dark appearance and a labelled sample workspace.
- Collapsible navigation: Overview, Live chat, Leads, Appointments, Flows, Business knowledge, Test chat, Connections, Settings, Usage & billing.
- Manual leads, appointment requests and conflict-checked internal confirmations.
- Inbox data model, internal notes and resolve/reopen controls. No live customer delivery yet.
- Firebase authentication integration, Supabase PostgreSQL migrations, Stripe test-mode billing integration and server-side Gemini adapter.
- AI and payment access fail closed until their services are configured. Sample records are not real customer data.

This is a development milestone, not a production-ready WhatsApp service. Accounts, migrations and end-to-end provider verification are still required. See [the full build roadmap](docs/ROADMAP.md) and [deployment and access instructions](docs/SETUP.md).

## Run locally

Use Node.js 22.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173 and http://127.0.0.1:5173/sample. The API listens on 127.0.0.1:3001. Without credentials, the landing page and fixed sample remain usable; login, billing and live AI do not simulate success.

Create an ignored `.env` using the field names in `.env.example` for local service configuration. Never commit secrets or service-account files. No browser-facing environment variable should contain a secret.

```sh
npm test
npm run build
```

Tests use an in-process PostgreSQL engine for migrations, entitlement constraints and operation integrity; they do not contact payment or AI providers.

## Vercel

The repository contains a Vite build, a single Express API function at `api/index.ts`, explicit application rewrites and GitHub Actions verification. Link the project to `jeffthecool9/lumo3.0`; use a preview branch before changing production. Deploy from the repository root.

Keep production secrets out of ordinary preview environments. Sample previews need no external service credentials. [Setup and verification checklist](docs/SETUP.md).

## Data ownership

Firebase proves identity. The API resolves the account's workspace and never accepts a caller-selected workspace ID. Supabase stores operational data and billing references. Browser database roles have no direct table access; the server uses a protected service-role key. Stripe stores payment-card details. The AI provider receives only the context required for the current request.

Database migrations are versioned under `supabase/migrations`. Apply 001, 002 and 003 in order to a new project. Never reapply earlier migrations to an existing database.

## Known launch gates

The current API rate limiter is process-local, not a distributed abuse control. Add durable rate limits, signup/SMS protection, retention/export/deletion procedures, monitoring, backup restore checks and an operator review process before accepting real customers. WhatsApp needs its own authorized Meta onboarding, durable webhook processing and verified delivery; a connection screen is not a working integration.

Public limits remain RM99/month, a seven-day card-required trial and bounded private AI usage. They do not include live WhatsApp volume or provider charges. Do not sell external messaging until that allowance and pricing have been defined.
