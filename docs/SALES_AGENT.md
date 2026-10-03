# Lumo Sales Agent Delivery Plan

Updated 2026-10-03. Product direction: a Malaysian sales agent that captures enquiries, qualifies buyers and helps a business close sales. Appointments are one optional next step.

## What Works Now

- Landing composer, clearly labelled multilingual sales fixtures, product/service/quote examples.
- Private plan editing, approval, versions and test chat; server AI instructions now prioritise sales qualification.
- Manual leads with new, qualified, follow_up, won and lost stages; overview and inbox notes.
- Firebase verification, server workspace authorization, Supabase ownership constraints and billing gates.
- Stripe integration code and atomic AI count/cost reservations. Live setup and acceptance tests remain.

The current AI adapter is Gemini, not OpenAI. It receives saved knowledge and an approved plan; live catalogue retrieval and action tools are not implemented. Sample replies cannot save leads or complete sales. Live WhatsApp, automated follow-ups and order verification are not enabled.

## Delivery Order

### 1. Prove account and subscription reliability

Verify two-account isolation on the hosted test database, revoked identities, persistence across devices, trial reuse, payment failures, recovery and duplicate/out-of-order webhooks. Keep preview and production credentials separate. Fix the remaining integration gates in CHECKPOINT.md before customer onboarding.

### 2. Build the verified sales knowledge layer

Add versioned products/services, MYR prices, permitted discounts, sales policies and owner-approved purchase URLs. Keep structured records as the source for exact prices and stock; semantic FAQ search is for finding relevant explanations. Record source, approval and freshness with each fact. Unknown or stale information requires clarification or human review.

Reuse Supabase PostgreSQL for linked records and transactions. Add private object storage when uploads ship and pgvector when knowledge volume justifies retrieval. Avoid a second database until a measured requirement demands it.

Acceptance: missing facts never become offers; another workspace's facts cannot be retrieved; product references and purchase links resolve only to approved records.

### 3. Add sales state and server-authorized actions

Store buying need, optional budget, timing, consent, source/campaign, owner and agreed next action alongside existing lead stages. Separate AI suggestions from committed actions. Validate structured extraction and record lead changes with actor, timestamp and conversation reference.

Use scoped, idempotent actions for saving a lead, requesting a quote, assigning a human and presenting an approved purchase link. Require a verified order/payment event or explicit staff action to mark a deal won. Lumo subscription payments are separate from customers purchasing a business's products.

Acceptance: repeated requests create one action; positive replies or link clicks cannot falsely record revenue; unsupported discounts and write operations are rejected.

### 4. Deliver reliable channel processing

Persist signed inbound events before acknowledging them. Deduplicate provider IDs; process messages in conversation order using a durable queue/worker and transactional outbox. Track delivery outcomes, bound retries and show failed work to the operator.

Check subscription, budget, approved plan and takeover state before AI and again before sending. Staff takeover must block queued automated replies. A Vercel request is not a durable background worker.

Acceptance: retried webhooks send one reply; worker restarts lose no accepted event; cancelled/revoked channels and human takeover stop queued delivery.

### 5. Ship useful follow-ups and sales reporting

Add consent-aware scheduled next actions, assignments and approved channel templates. Respect opt-outs and channel messaging rules. Show captured and qualified leads, verified won deals, lead source, delivery failures and AI cost. Avoid invented conversion statistics.

### 6. Validate RM99 economics and launch

Benchmark real English/BM/Chinese/mixed buying conversations across products and services: qualification, factual accuracy, objections, latency, handoffs and cost. Select the provider/model from measured results behind a common adapter.

RM99 currently describes private planning/testing: 30 generations, 500 private test replies and US$5 AI cost ceiling per paid month, first limit reached. Do not relabel these as 500 live WhatsApp replies without testing channel costs and defining a new entitlement.

Track per-business AI cost plus allocation for hosting, database, queue, payment fees, support and messaging. Define who pays channel fees and disclose effective limits before selling automation. Keep hard business/global caps, durable rate limits and an operator pause control.

Acceptance: concurrency cannot overspend; provider failures have visible recovery; backups restore; trial and paid cohorts have measured contribution margin; one real pilot sale can be traced from enquiry to verified outcome.

## Product Promise

Lumo helps your business sell using approved facts and Malaysian conversation context. It cannot guarantee a sale. General language models can provide the language capability; reliable data, sales state, delivery and business actions make the service valuable.
