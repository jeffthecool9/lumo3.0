# Cinematic Landing Preview

## Scope

Landing-only release. No changes to authentication, billing, database, backend or public API. Keep deployment on `codex/lumo-workspace-preview`; do not merge to main for this release.

The blue dimensional mark uses local geometry matching the approved logo. Product surfaces use local illustrative records. No external models or authenticated customer screenshots are loaded. The preset demo makes no AI calls and sends no customer messages.

## Architecture

- `LumoScene.tsx` paints the static HTML composition first and defers the engine import. Reduced motion skips the renderer.
- `scene-engine.ts` owns one transparent Three.js renderer shared by the opening and journey. It renders on timeline updates, a finite intro, resize or subtle desktop pointer movement, not an indefinite animation loop. Offscreen, hidden-tab and open-dialog states suspend rendering.
- `landing-motion.ts` dynamically imports GSAP/ScrollTrigger and owns the scroll timeline. Native sticky layout does the pinning. Scene transforms and HTML captions consume the same progress.
- `use-demo-modal.ts` owns hash/history, native dialog focus containment, background inertness, scroll preservation and trigger restoration. DemoChat remains mounted when the dialog closes.
- Mobile/short-screen and reduced-motion chapters are vertical. Blocked motion bundles reveal the complete static vertical story. Renderer/context failures retain HTML evidence.

## Automated Checks

Run `npm test`, `npm run build` and `npm run test:runtime` on a supported Node runtime. Added coverage includes:

- Reversible five-chapter mapping, bounded camera transforms and pause conditions.
- Dialog direct links, previous hash/focus restoration, history navigation and Escape.
- Conversation preservation, business reset, deferred engine loading and reduced motion.
- Renderer unavailability, rendering exceptions, context loss/restoration and offscreen/demo suspension.
- Blocked motion-bundle fallback and semantic static artwork/workspace tabs.

## Browser Checks

Verified at 320, 375, 430, 768, 1280 and 1440px widths. Headings, primary controls and showcase tabs remain within the viewport; no horizontal overflow was measured. Desktop and mobile screenshots show nonblank 3D geometry. Pixel analysis found 47,855 blue-logo pixels in the desktop opening and 16,142 in the mobile opening. Right-hand canvas-region hashes differ between opening, language and handoff scenes, confirming changed rendered output.

Manual checks cover preset reply, close/reopen preservation, Escape/focus restoration, direct `#playground`, chapter controls, forward/reverse scrolling, and resize between pinned and vertical layouts. GPU/context and reduced-motion failures are automated with controlled mocks; those tests are not a substitute for a representative physical-device matrix.

## Local Performance Measurements

Production build, in-app Chromium, 375x812 viewport, three page reloads, warm browser cache, no CPU/network throttling. Temporary PerformanceObserver instrumentation in generated `dist/index.html` only; not shipped or committed.

| Run | LCP | CLS |
| --- | --- | --- |
| 1 | 168ms | 0.00685 |
| 2 | 136ms | 0 |
| 3 | 144ms | 0 |

These are local viewport measurements on desktop hardware, not Lighthouse mobile simulation, real mobile-device results or proof of hosted performance. Repeat throttled/cold-cache tests on the deployed preview before treating LCP <=2.5s and CLS <=0.1 as validated launch targets.

Three.js remains outside the initial application bundle: the engine is a separate approximately 558KB minified / 143KB gzip chunk. GSAP and ScrollTrigger are separate deferred chunks. Initial application code is approximately 588KB / 156KB gzip, about 10KB minified larger than the previous version because of the new HTML/product/modal components, not the 3D engine. Existing large-entry-bundle warnings remain; no claim of zero total JavaScript growth is made.

## Before Ads Or Production

1. Run cold-cache throttled mobile performance checks on Vercel and a real low-end phone.
2. Check actual screen-reader and physical-device WebGL/context-loss behaviour.
3. Ask five Malaysian business owners to view the opening for five seconds. At least four should identify Lumo as a sales agent and locate Try Lumo. This requires real participants and has not been conducted by the agent.
4. Review live service availability and subscription disclosures before enabling payment or customer messaging. No award, conversion gain or sales result is claimed.
