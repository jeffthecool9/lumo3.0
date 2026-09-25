# Lumo Full Product Roadmap

## Product Boundary

Lumo is a business workspace, not only a chatbot. A business owner should be able to describe the business, approve the assistant's behaviour, connect a customer-owned channel, and handle leads, conversations and appointments in one place. The landing-page theme and blue Lumo identity remain the starting point.

The current milestone adds the workspace and database foundation. It does not activate WhatsApp, take live payments or claim that sample data is cloud-synced.

## Customer Journey

1. A visitor describes the business on the landing page. The draft stays on that device through sign-in and checkout.
2. The visitor can browse a fixed example without generating AI output.
3. Real generation asks for an account, verified identity, and a subscription or eligible seven-day card-required trial.
4. Checkout shows RM0 today for the trial, RM99/month afterwards, the first billing date and cancellation terms. The backend, not the redirect, grants access after Stripe verification.
5. The business adds services, prices, FAQs, language and handoff rules, then requests a plan. Missing facts should become questions, not inventions.
6. The owner edits and approves a version, then privately tests it. A revision requires new approval. The previously approved version remains available.
7. After channel delivery is implemented, Connections starts Meta's authorization flow for the customer's own WhatsApp Business account. Account authorization alone does not mean delivery is ready.
8. Once verified and explicitly activated, incoming enquiries appear in Live chat, customer details become leads, and appointment requests appear in Appointments.
9. A human can take over. Automation pauses for that conversation and cannot race a staff reply. Slot requests are not confirmed bookings until the booking transaction succeeds.
10. On expiry, failed payment or exhausted allowance, new billable AI stops. Saved work and billing recovery remain available; customers receive a defined non-AI fallback where channel rules allow it.

Returning customers sign in directly to their workspace. A preserved landing-page prompt opens Flows. Otherwise Overview shows the next business actions. Navigation collapses on desktop and becomes a menu on mobile.

## Owner Journey

1. Configure separate development and production service projects and spending limits.
2. Watch signups, trial starts, payment failures, AI spend and blocked channel deliveries.
3. Review repeat-card trial flags without exposing full payment details. Legitimate shared-card cases require an audited decision.
4. Answer support requests, honor deletion/export requests and track integration incidents.
5. Compare actual cost per trial and paying business against revenue. RM99 must cover payment fees, hosting, database, email, SMS, AI and any messaging costs; it is not all margin.
6. Pause AI globally or per business when needed. Keep billing recovery and saved work accessible.
7. Roll out changes through GitHub checks and Vercel previews; approve production releases only after the corresponding acceptance gate.

The operator dashboard, delegated support access and audit log are future work, not current UI features. Use provider dashboards and restricted administrative access during development.

## Architecture

| Component | Role | Current status |
| --- | --- | --- |
| React + Vite | Landing page and business workspace | Implemented |
| Vercel | Web hosting and short API requests | Deployment configuration added |
| Firebase Auth | Google, verified email, verified phone identity | Integration code; provider setup required |
| Supabase PostgreSQL | Linked business records, subscription state and quotas | Three migrations; hosted database not connected |
| Stripe | Checkout, saved payment method, renewal and portal | Test-mode integration; credentials and tests required |
| AI adapter | Plan JSON and private test replies | Existing Gemini adapter; disabled without configuration |
| Durable queue / worker | WhatsApp events, outbound delivery, retries | Future milestone |
| Transactional email | Trial reminders and service notifications | Existing reminder integration needs provider setup |
| Monitoring / operator controls | Failures, spend, abuse and support | Database AI cap exists; production operations incomplete |

Do not add MongoDB alongside PostgreSQL now. This codebase already uses Postgres, and appointments, leads, subscriptions and messages need ownership relationships and transactions. JSON plan content can remain in Postgres. A second database would add synchronization and maintenance without a current requirement.

### AI brain decision

The code currently calls Gemini on the server. It has not been switched to ChatGPT. To use an OpenAI model, add an OpenAI Responses API adapter behind the same access, reservation and settlement checks; choose the model after testing real beauty/service conversations for quality, latency and cost. Do not let the model directly charge a card, send a WhatsApp message or confirm an appointment. Those are permission-checked server operations. [Official OpenAI API quickstart](https://developers.openai.com/api/docs/quickstart).

Do not buy a second AI subscription merely for the sample preview. Provider access and model choice can be settled at the AI pilot milestone.

## Delivery Milestones

### 1. Preserve and preview

Deliver the latest local landing page and logo to a new branch in lumo3.0, preserve main, add CI, and create a Vercel preview. No secrets, local logs, dependency folders or generated archives belong in Git.

Acceptance: a remote browser can load the landing page and sample workspace; API health/config are JSON; private endpoints reject anonymous requests; build and automated tests pass.

### 2. Business workspace foundation

This build: collapsible navigation, overview, manual lead creation/editing, appointment requests and internal confirmation, inbox browsing and internal notes, settings and connection readiness. Schema, authenticated endpoints and tests accompany the views.

Acceptance: records survive reload after real database setup; workspace ownership cannot be chosen in a request; cross-business foreign keys fail; confirmed bookings for one resource cannot overlap. Sample mode is visibly labelled.

Limitations: records are capped to 200 loaded rows, not a full pagination/search backend; no staff invitations; no outbound customer messages; no external calendar; no realtime delivery; sample inbox notes are session-local. Add pagination and durable limits before growth.

### 3. Connect identity and persistent storage

Use a dedicated Supabase development project, apply migrations, configure Firebase public and server values securely and verify authorized domains. Start with Google/email. Enable billed SMS only after quotas, country restrictions and bot protection are set. Implement account linking deliberately so email and phone identities cannot create unrelated duplicate businesses.

Acceptance: sign up, verify, sign in on another device, retrieve the same workspace, sign out/revoke access, and prove two accounts cannot view each other's records. Decide data region, retention, backup and deletion policy before customer data arrives.

### 4. Prove billing and private AI

Configure RM99 MYR monthly price in Stripe test mode, customer portal and signed webhooks. Verify trial eligibility, verified email for reminders, saved payment method, first invoice, trial end, cancellation, failed payment and recovery. Test missing fingerprints and repeated/out-of-order notifications.

Benchmark model calls, structured plan validation, English/Bahasa Melayu, invented prices, prompt injection, handoff and uncertain provider failures. Check actual token pricing before enabling AI.

Acceptance: browser flags cannot buy access; trial is one per eligible account/business; paid periods reset only with verified period state; simultaneous requests cannot overspend; cost, count and global limits all apply; a provider failure never silently resets spend.

Current limits: trial 3 generations / 50 test replies / US$0.50 total; paid month 30 / 500 / US$5. First limit reached wins, no overage billing. Platform AI budget initially US$10 per day. These are development policy defaults, not cost benchmarks.

### 5. WhatsApp pilot

Build Meta customer onboarding, bind the authorized WhatsApp Business account and phone number to the correct workspace, store tokens in protected server storage, validate webhook signatures, and deduplicate inbound event IDs. Persist events before acknowledging them and process with a durable queue. Never rely on background work surviving a Vercel request.

Process each conversation in order. Reserve quota before AI, use only the approved active plan, record response intent in an outbox, and track sent/delivered/read/failed states. Retry safely without duplicate customer messages. Implement opt-in, messaging-window/template rules, disconnect/revocation and safe manual takeover using current Meta policies. Test with designated test recipients first.

Acceptance: an authorized test customer sends a message, it reaches only their business inbox, the correct reply is sent once, takeover blocks automation, failures remain visible, and reconnect cannot attach another workspace's channel.

Access: Lumo-owned Meta developer app, business ownership/verification and permissions as required by Meta; customer-owned account authorization. Never ask customers for their WhatsApp password or promise every number can be connected. [Meta WhatsApp Business Platform collection](https://www.postman.com/meta/whatsapp-business-platform/overview).

### 6. Appointment product

Replace free-text resources with staff/resources, services and duration tables. Add availability, working hours, breaks, closures, capacity, temporary slot holds, timezone handling and a calendar view. Confirmation must be transactional; AI can propose a time but cannot invent availability. Add cancellation/rescheduling and calendar integration with idempotent external updates.

Acceptance: simultaneous customers cannot confirm the same capacity; explicit confirmation and policy checks precede customer notifications; timezone/DST boundaries and external calendar failure are tested.

### 7. Teams, operator controls and web chat

Add owner/admin/agent roles, staff invitations, assignment, unread state, realtime updates, activity history and a restricted operator dashboard. Build website chat with domain ownership, origin checks, anonymous visitor isolation and per-visitor limits. Add inbox and lead pagination/search; document retention, exports and deletion.

Acceptance: least-privilege roles, auditable access, no internal notes sent to customers, safe disconnect, and a recovery route for provider failures.

### 8. Controlled commercial launch

Pilot with a small group, review actual conversion and spend, finalize support/legal details and operational playbooks, prove backups restore, test incident response, configure durable rate limiting and monitoring. Define live-message quotas and who pays Meta fees before selling WhatsApp automation.

Do not run paid acquisition into unavailable sign-in, a fake connection button or unverified billing. Start live charging only after end-to-end test-mode verification and an explicit production release decision.

## Release Rules

- Keep development and production databases, Stripe modes and provider credentials separate.
- No paid add-on or service upgrade without the owner's approval.
- No automatic channel activation on plan generation or payment.
- No full card numbers, CVVs, access tokens or private keys in application logs or browser bundles.
- Add provider webhook integration tests and multi-connection Postgres concurrency tests before live external delivery. The local PGlite suite is useful but does not reproduce every hosted concurrency condition.
- A saved card bounds some abuse; it does not guarantee future payment or make trials cost-free.
