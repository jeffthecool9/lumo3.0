# Setup And Access Checklist

## Preview First

The landing page and /sample work without service accounts. Their records are fixtures stored in the current browser. /workspace requires a configured, verified account; credentials must never be replaced by a fake success mode.

For Vercel, import or use the existing jeffthecool9/lumo3.0 project, root directory ".", Vite preset and Node 22. The repository configuration sets the build command and output directory. Branch pushes can create previews through the Git integration. [Vercel Git documentation](https://vercel.com/docs/git).

Keep main unchanged until the preview is approved. Do not put production secrets into the general Preview environment. Before sharing, check the deployment's access protection; do not weaken protection without the owner's approval.

The API is exported from api/index.ts without opening a port. Check /api/health, /api/config and a protected /api/workspace request after deployment. [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js).

Set APP_URL to the exact deployment origin for configured environments, with no trailing slash. For unconfigured previews it falls back to VERCEL_URL. A custom domain needs its own APP_URL. Do not infer trusted origins from user-supplied request headers.

## Supabase

1. Create or choose a Lumo development project. Decide the data region and account ownership; do not buy an upgrade just for fixtures.
2. Apply supabase/migrations/001_lumo.sql, then 002_firebase_auth.sql, then 003_business_operations.sql in the SQL editor or through an approved migration workflow. Record which migrations are applied. These are not intended to be rerun.
3. Store SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY only in the backend environment. The service-role key bypasses RLS and must never reach the browser.
4. Browser roles are denied direct access. The API verifies Firebase identity, resolves membership and scopes every query. Do not add broad public RLS policies to make a preview work.
5. Test two separate accounts and actual reload persistence before entering customer data.

Tables include workspaces, memberships, app_users, knowledge, versioned plans, private conversations, billing, trial claims, usage records and platform_controls. Migration 003 adds workspace_settings, crm_leads, appointments, inbox_threads, inbox_messages and channel_connections.

Only connection metadata belongs in channel_connections. A later Meta integration needs separately protected token storage and rotation/revocation procedures.

## Firebase

Set FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID and FIREBASE_APP_ID from the Firebase web app configuration. These values identify the public web app.

The API additionally requires a protected server identity: FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS pointing to a protected file outside the repository for local development. Enter private credentials yourself in the hosting environment, not chat or GitHub. Prefer managed identity where supported and verified.

Enable only the sign-in providers being tested, authorize the actual preview/custom domains and configure email verification. For SMS, set allowed regions, budgets and abuse controls before enabling billed traffic. Use Firebase test phone numbers for development; do not send test SMS to arbitrary real numbers.

Firebase identity is used through the backend here, not as unrestricted browser access to Supabase. [Supabase Firebase integration reference](https://supabase.com/docs/guides/auth/third-party/firebase-auth).

## Stripe Test Mode

A publishable key alone cannot create subscriptions. Configure STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and STRIPE_PRICE_ID. Create a recurring MYR 9900 minor-unit monthly price. Keep ALLOW_LIVE_BILLING=false.

Enable the billing portal and configure the signed /api/billing/webhook endpoint for events handled in server/billing.ts. Add a stable random IDENTITY_HASH_SECRET of at least 32 characters; rotating it casually would break repeat-trial matching.

Trial reminders require RESEND_API_KEY, a verified sending domain and EMAIL_FROM. Configure and verify reminder delivery three days before expiry. The trial checkout is disabled without the email service. Test a phone-only account's email-collection/reminder journey explicitly.

Test successful trial setup, paid checkout, cancellation, trial expiry, renewal success/failure, authentication-required payment, duplicate and delayed webhooks, repeat fingerprint review and portal recovery. No browser redirect should independently unlock generation.

## AI

The current adapter uses GEMINI_API_KEY and GEMINI_MODEL, on the server only. AI_ENABLED and AI_PRICING_VERIFIED both default false. Verify the selected model's current input/output pricing and token accounting, set the corresponding cost variables, then benchmark against both business and platform limits.

The database platform_controls row is a second AI kill switch and daily cap. Both application and database gates must permit calls. Missing integrations return a real error, never a fabricated AI result.

An OpenAI provider is a planned option, not installed by this build. Choose it during the AI pilot and implement it behind the same atomic budget policy. Do not place any provider secret in a VITE_ variable.

## Before Real Customers

- Replace process-local IP throttling with durable account/IP/provider limits across Vercel instances. Add signup/SMS bot protection, tenant record limits and pagination.
- Complete contact details, privacy notice, legal identity, deletion/export and retention rules. The current legal pages explicitly identify themselves as development drafts.
- Confirm backups and restore; add audit logs, alerts, operator review controls and incident response.
- Configure durable processing and an outbox before live WhatsApp delivery. The current inbox does not send external messages.
- Test a real hosted database, verified Firebase sessions and Stripe test events. Local automated checks do not prove external service configuration.
- Verify no secrets in Git, logs or built browser assets. Keep previews on non-production credentials.
- Benchmark landing-page performance and cross-device conversion before paid ads. The current build still reports a large JavaScript-chunk warning.

## Access To Prepare

| Account | What the owner needs to provide or configure |
| --- | --- |
| GitHub | Access to jeffthecool9/lumo3.0 |
| Vercel | Existing project access and permission to deploy the preview branch |
| Supabase | Lumo development project and server environment values, entered securely |
| Firebase | Web app config, enabled providers, authorized domains and protected server identity |
| Stripe | Test account configuration, recurring price, portal and webhook secret |
| AI provider | Chosen provider project, API billing/spend controls and server key |
| Email provider | Verified sender for trial and service emails |
| Meta | Lumo app/business setup and designated WhatsApp test assets for the later pilot |

Do not send passwords, private keys or full payment-card details in chat. Setting up an account does not authorize a paid upgrade or live charging.
