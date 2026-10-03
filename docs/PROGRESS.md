# Lumo Progress: 3 October 2026

## Delivered in this tranche

- Sales catalogue: exact MYR minor-unit prices, descriptions and selling terms; draft and explicit approval states.
- Editing removes approval. Approval requires the timestamp the owner reviewed, preventing stale-screen approval.
- Private AI receives only the current workspace's approved catalogue, with current offer facts taking precedence over older knowledge or plan prices.
- At most 30 approved offers per private AI request; exceeding this fails explicitly rather than silently omitting offers. AI remains a language model and is not a guarantee of factual correctness.
- Internal lead follow-up tasks with due dates, overdue filtering, completion and cancellation. These do not send customer messages.
- Supabase migration with RLS, revoked browser grants, business-scoped APIs and cross-business lead constraints.
- Local sample UI is clearly labelled and uses fictional browser-local records. Actual persistence requires configured server database access.

## Estimated Milestone Completion

These are engineering estimates, not measured percentages or a promise of launch readiness.

| Milestone | Weight | Earned |
|---|---:|---:|
| Landing page and workspace experience | 10 | 9 |
| Verified accounts and workspace access | 10 | 7 |
| Business storage, leads and team operations | 15 | 11 |
| Approved sales knowledge, plans and private AI | 15 | 10 |
| Customer channels and reliable delivery | 20 | 2 |
| Subscription lifecycle and cost controls | 10 | 6 |
| Reliability, monitoring and security hardening | 10 | 4 |
| Real-customer pilot and launch verification | 10 | 1 |
| Total product implementation | 100 | 50 |

Estimated readiness to operate a paid customer-facing service: roughly 30%. Code and sample screens are further along than verified live integrations.

## Next Delivery Order

1. Restore hosted Firebase verification with the replacement protected credential; verify a real login and persistent workspace. Configure local server database credentials securely if local persistence is needed.
2. Configure the AI provider securely, benchmark English/BM/Chinese mixed conversations, exact offers, missing facts, and quota/cost boundaries.
3. Verify Stripe test checkout, trial expiry, cancellation, renewal, declined payments and webhook replay end to end. No live charging yet.
4. Build website chat first: validated domains, consent-based lead capture, server-authorized actions and durable message processing. Then implement Meta-owned WhatsApp onboarding and delivery.
5. Add opt-in automated follow-ups through a durable queue, opt-out enforcement, delivery tracking, retries and human takeover.
6. Pilot with real businesses, validate RM99 unit economics, then complete backup recovery, monitoring, privacy and launch checks.

## Remaining Limitations

No live WhatsApp delivery, automatic customer follow-ups, verified orders or customer-facing autonomous sales actions are activated. No subscription purchase occurred during development. Private AI needs a configured provider and verified pricing flags. The catalogue reduces guessing by supplying approved facts, but hard factual guarantees require structured quote/action validation in the upcoming customer-channel layer.
