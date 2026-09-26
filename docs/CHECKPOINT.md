# Lumo Development Checkpoint

Updated 2026-09-26. This is a development preview, not a production launch.

## Source And Hosting

- Repository: jeffthecool9/lumo3.0; branch: codex/lumo-workspace-preview.
- Pull request: https://github.com/jeffthecool9/lumo3.0/pull/1. Main remains unchanged.
- Preview: https://lumo3-0-git-codex-lumo-workspace-preview-jeffthecool9s-projects.vercel.app
- Vercel preview protection remains enabled. A Vercel sign-in can be required.
- Blue Lumo logo and existing landing-page theme are preserved.

## Test Database

- Applied migrations 001_lumo.sql, 002_firebase_auth.sql and 003_business_operations.sql to the owner-approved Lumo test Supabase project on 2026-09-26.
- Verified 18 public application tables; all have RLS enabled. Anonymous and authenticated browser roles have no SELECT privileges on these tables.
- Confirmed platform AI is disabled and the daily ceiling is 10000000 USD micro-units (US$10).
- Existing server key is stored only in Vercel's secret environment settings for the preview branch. No credentials are committed.
- SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL and NODE_OPTIONS are configured for that branch only.
- Schema creation is complete. Do not rerun migrations 001-003 on this project. Use a new migration for future changes.

## Implemented Experience

Landing composer and preset demo; sample workspace with sidebar, overview, leads, appointment requests, inbox, internal notes, flow editing and approval, private test chat, connections, settings, and usage/billing views. Sample records are browser-local fixtures, not real customers. Inbox fixture messages are session-local.

The backend contains Firebase verification, workspace authorization, scoped business APIs, subscription gates, Stripe test-mode integration, and atomic AI budget reservations. A missing provider never reports simulated live success.

## Next Integration Gates

1. Configure Firebase public web values and a protected server identity, then authorize the preview domain and verify two separate accounts. Do not paste private keys into chat or GitHub.
2. Verify real account onboarding, data persistence and cross-business isolation against the hosted database.
3. Configure Stripe test secret, recurring MYR99 price, portal, signed webhook, identity hash secret and reminder email sender. Complete billing lifecycle tests before live charging.
4. Configure the chosen AI provider, benchmark actual costs, and only then enable the application and database AI switches. The current adapter is Gemini; OpenAI is not connected yet.
5. Implement and verify Meta onboarding, durable webhook processing and an outbound message queue before enabling WhatsApp. The current inbox cannot send external messages.

Do not enable paid advertising or describe the preview as a fully operating subscription or WhatsApp service before these gates pass.
