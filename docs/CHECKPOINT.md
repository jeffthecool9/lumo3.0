# Lumo Development Checkpoint

Updated 2026-10-01. This is a development preview, not a production launch.

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

### Firebase Sign-up Preview

- The owner's `lumo-22425` Firebase project has Google and email/password sign-in enabled. `Lumo Web Preview` is registered, and the stable preview domain plus `localhost` and `127.0.0.1` are authorized.
- Public web configuration and explicit Google/email provider flags are scoped to the Vercel preview branch. Phone/SMS remains disabled.
- The server identity address and Firebase Admin private key are scoped to the same branch; the private key is a protected Vercel Secret. The downloaded JSON is outside the repository and must never be committed.
- `/api/config` exposes a method only when public configuration, server verification, database configuration and the explicit provider flag are all present. The sign-up screen shows a truthful unavailable state until then.
- The preview was redeployed on 2026-10-01. Its sign-in screen now offers Google and email while phone remains hidden; no browser errors were observed. A real verified sign-in, workspace reload and two-account isolation test remain before customer onboarding.
- Rotate the test Firebase Admin key before inviting customers, then update the preview Secret and redeploy.

### Malaysian Appointment Update

- Larger, heavier typography and near-black sidebar labels; the existing blue logo, accents and dark mode remain.
- Landing copy and brief starters now focus on appointment enquiries across industries, including consultations, on-site visits and classes.
- Business Knowledge stores English, Bahasa Melayu, Chinese or auto-matched Malaysian mix, plus conversational/professional tone. Existing knowledge records remain compatible.
- Server planning/testing instructions honour language switches, use supplied RM prices and Malaysian local dates, and collect appointment requests without claiming confirmed bookings.
- Clearly labelled preset chats cover English, BM, Chinese and mixed messages. They are not live AI. The sample workspace can add a Malaysian plan version without removing old plans or the saved prompt.
- Focused localization tests cover preferences, prompt safeguards and preset routing. Live multilingual quality still requires a connected provider and benchmark conversations.
- No database migration, live provider activation or billing changes in this update.

### Remaining Connections

1. Verify Google and email sign-in with two separate accounts, workspace persistence and isolation. Rotate the test Firebase Admin key before inviting customers. Do not paste private keys into chat or GitHub.
2. Verify real account onboarding, data persistence and cross-business isolation against the hosted database.
3. Configure Stripe test secret, recurring MYR99 price, portal, signed webhook, identity hash secret and reminder email sender. Complete billing lifecycle tests before live charging.
4. Configure the chosen AI provider, benchmark actual costs, and only then enable the application and database AI switches. The current adapter is Gemini; OpenAI is not connected yet.
5. Implement and verify Meta onboarding, durable webhook processing and an outbound message queue before enabling WhatsApp. The current inbox cannot send external messages.

Do not enable paid advertising or describe the preview as a fully operating subscription or WhatsApp service before these gates pass.
