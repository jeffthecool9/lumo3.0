// HotfixApp.tsx
import React, { useEffect, useRef } from "react";

/**
 * Single-file React component:
 * - Header
 * - Hero
 * - Financial highlight card (replaces old badge)
 * - Benefits (4 cards) with animated icon, IntersectionObserver reveal
 * - Starter pack CTA
 *
 * Inline styles and inline <style> keyframes only. No external scripts.
 */

export default function HotfixApp() {
  const benefitsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // IntersectionObserver for reveal animation
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const root = benefitsRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(".benefit-card")) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            // start icon bobbing when in view
            const icon = el.querySelector(".float-icon");
            if (icon) icon.classList.add("bob");
          }
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // Utilities for inline styles to keep code tidy
  const gridBg = {
    backgroundImage:
      "linear-gradient(0deg, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        /* Keyframes and small utility styles */
        @keyframes bob {
          0% { transform: translateY(-6px) rotate(-1deg); }
          50% { transform: translateY(6px) rotate(1.5deg); }
          100% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .hero-glass { backdrop-filter: blur(12px); background: rgba(255,255,255,0.9); border-radius: 14px; box-shadow: 0 10px 30px rgba(10,15,31,0.06); padding: 22px; }
        .financial-card { max-width: 720px; margin: 18px auto; border-radius:14px; padding:22px; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 30px rgba(10,15,31,0.06); }
        .benefit-card { transition: transform .32s cubic-bezier(.2,.9,.2,1), box-shadow .32s; transform: translateY(12px); opacity: 0; will-change: transform; border-radius:12px; background: rgba(255,255,255,0.92); box-shadow: 0 8px 20px rgba(15,23,42,0.04); padding:16px; display:flex; gap:12px; align-items:flex-start; }
        .benefit-card.in-view { transform: translateY(0); opacity: 1; transition: transform .5s cubic-bezier(.2,.9,.2,1), opacity .5s; }
        .benefit-card:hover { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(10,15,31,0.09); }
        .float-icon { width:44px; height:44px; min-width:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg,#1477FF,#21E3FF); color:#fff; box-shadow: 0 6px 18px rgba(20,40,80,0.12), inset 0 2px 6px rgba(255,255,255,0.12); transform-origin:center; transition: transform .24s ease; will-change: transform; }
        .float-icon.bob { animation: bob 3.8s ease-in-out infinite; }
        .float-icon:active { transform: scale(0.98); }
        .float-icon.pulse { animation: pulse .36s ease-out; }
        .benefit-body { flex:1; }
        .benefit-title { font-weight:700; margin:0 0 6px 0; font-size:16px; color:#0f172a; }
        .benefit-text { margin:0; color:#6b7280; font-size:14px; line-height:1.45; }
        .hero-headline { font-size:28px; line-height:1.05; margin:0; color:#08203a; font-weight:800; }
        .hero-sub { color:#6b7280; margin-top:12px; }
        .cta-btn { background:#1477FF;color:#fff;border:none;padding:10px 14px;border-radius:10px;font-weight:700; cursor:pointer; }
        @media (max-width:640px) {
          .hero-headline { font-size:22px; }
          .financial-card { padding:16px; margin:14px 10px; }
          .benefit-card { padding:14px; flex-direction:column; align-items:flex-start; gap:10px; }
          .float-icon { width:48px; height:48px; border-radius:12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-icon.bob { animation: none; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", padding: 16, fontFamily: "Inter, Arial, Helvetica, sans-serif", ...gridBg }}>
        {/* Header */}
        <header style={{ maxWidth: 1100, margin: "16px auto", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "12px 16px", boxShadow: "0 10px 30px rgba(10,15,31,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(180deg,#1477FF,#21E3FF)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>O</div>
            <div style={{ fontWeight: 700 }}>Lumo</div>
          </div>
          <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none" }}>
            <div style={{ width: 26, height: 2, background: "#0f172a", borderRadius: 2 }} />
          </div>
        </header>

        {/* Hero */}
        <main style={{ maxWidth: 980, margin: "22px auto", textAlign: "center" }}>
          <section style={{ marginBottom: 18 }}>
            <div className="hero-glass" style={{ display: "inline-block", padding: 28, textAlign: "center" }}>
              <h1 className="hero-headline">
                Why Malaysian Bosses Love
                <br />
                <span style={{ background: "linear-gradient(90deg,#1477FF,#21E3FF)", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block", fontWeight: 900 }}>
                  Saving Tons of Money with Lumo!
                </span>
              </h1>
              <p className="hero-sub">You didn't start a business to become a 24/7 admin. Let the AI handle the noise.</p>
            </div>
          </section>

          {/* FINANCIAL HIGHLIGHT CARD — replaces any old badge */}
          <section aria-label="financial-highlight" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div className="financial-card" role="article" aria-label="Financial highlight">
              <p style={{ margin: 0, color: "#6b7280", fontSize: 15, textAlign: "center", lineHeight: 1.45 }}>
                According to our 1-year analysis, you can save up to{" "}
                <strong style={{ display: "block", color: "#0f5132", fontSize: 20, fontWeight: 900, marginTop: 6 }}>RM360,000/year.</strong>
                <span style={{ display: "block", marginTop: 10 }}>
                  By automating repetitive tasks, businesses cut support teams from <strong style={{ fontWeight: 800, color: "#0f172a" }}>20 to 5</strong>, slashing monthly overhead by{" "}
                  <strong style={{ color: "#16a34a", fontWeight: 900 }}>RM25k-RM30k</strong> instantly.
                </span>
              </p>
            </div>
          </section>

          {/* BENEFITS */}
          <section aria-label="benefits" ref={benefitsRef as any} style={{ marginTop: 8 }}>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
              {/* Card 1 */}
              <article className="benefit-card" style={{ alignItems: "center" }}>
                <div
                  tabIndex={0}
                  role="button"
                  aria-pressed="false"
                  className="float-icon"
                  onClick={(e) => {
                    const el = (e.currentTarget as HTMLElement);
                    el.classList.add("pulse");
                    setTimeout(() => el.classList.remove("pulse"), 380);
                    const card = el.closest(".benefit-card") as HTMLElement | null;
                    if (card) {
                      const extra = card.querySelector(".extra");
                      if (extra) extra.classList.toggle("visible");
                    }
                  }}
                >
                  {/* Simple SVG glyph */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="0" fill="transparent"></circle>
                    <path d="M8 12h8" stroke="white" strokeWidth="1.6" strokeLinecap="round"></path>
                  </svg>
                </div>
                <div className="benefit-body">
                  <h3 className="benefit-title">Don't Leave Them on 'Bluetick'</h3>
                  <p className="benefit-text">Malaysians shop late. Our AI replies instantly at 2 AM so you don't lose the sale.</p>
                  <div className="extra" style={{ display: "none", marginTop: 8, color: "#475569", fontSize: 13 }} aria-hidden>
                    Example: Auto-reply with delivery ETA or quick order link.
                  </div>
                </div>
              </article>

              {/* Card 2 */}
              <article className="benefit-card">
                <div
                  tabIndex={0}
                  role="button"
                  aria-pressed="false"
                  className="float-icon"
                  onClick={(e) => {
                    const el = (e.currentTarget as HTMLElement);
                    el.classList.add("pulse");
                    setTimeout(() => el.classList.remove("pulse"), 380);
                    const card = el.closest(".benefit-card") as HTMLElement | null;
                    if (card) {
                      const extra = card.querySelector(".extra");
                      if (extra) extra.classList.toggle("visible");
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 12h12" stroke="white" strokeWidth="1.6" strokeLinecap="round"></path>
                    <path d="M6 8h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9"></path>
                  </svg>
                </div>
                <div className="benefit-body">
                  <h3 className="benefit-title">Handle 'PM Price' Automatically</h3>
                  <p className="benefit-text">Stop copying & pasting the same price list 50 times a day. The bot handles repetitive FAQs for you.</p>
                  <div className="extra" style={{ display: "none", marginTop: 8, color: "#475569", fontSize: 13 }} aria-hidden>
                    Example: Auto-send price sheets, variants, and bulk order links.
                  </div>
                </div>
              </article>

              {/* Card 3 */}
              <article className="benefit-card">
                <div
                  tabIndex={0}
                  role="button"
                  className="float-icon"
                  onClick={(e) => {
                    const el = (e.currentTarget as HTMLElement);
                    el.classList.add("pulse");
                    setTimeout(() => el.classList.remove("pulse"), 380);
                    const card = el.closest(".benefit-card") as HTMLElement | null;
                    if (card) {
                      const extra = card.querySelector(".extra");
                      if (extra) extra.classList.toggle("visible");
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 7h16" stroke="white" strokeWidth="1.6" strokeLinecap="round"></path>
                    <path d="M4 12h10" stroke="white" strokeWidth="1.6" strokeLinecap="round"></path>
                    <path d="M4 17h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"></path>
                  </svg>
                </div>
                <div className="benefit-body">
                  <h3 className="benefit-title">Responds instantly</h3>
                  <p className="benefit-text">Never miss a customer — replies in seconds.</p>
                  <div className="extra" style={{ display: "none", marginTop: 8, color: "#475569", fontSize: 13 }} aria-hidden>
                    Example: Auto-acknowledgement + triage to human agent.
                  </div>
                </div>
              </article>

              {/* Card 4 */}
              <article className="benefit-card">
                <div
                  tabIndex={0}
                  role="button"
                  className="float-icon"
                  onClick={(e) => {
                    const el = (e.currentTarget as HTMLElement);
                    el.classList.add("pulse");
                    setTimeout(() => el.classList.remove("pulse"), 380);
                    const card = el.closest(".benefit-card") as HTMLElement | null;
                    if (card) {
                      const extra = card.querySelector(".extra");
                      if (extra) extra.classList.toggle("visible");
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.6" fill="none" />
                  </svg>
                </div>
                <div className="benefit-body">
                  <h3 className="benefit-title">Qualifies leads automatically</h3>
                  <p className="benefit-text">Collects info, filters prospects, hands you warm leads.</p>
                  <div className="extra" style={{ display: "none", marginTop: 8, color: "#475569", fontSize: 13 }} aria-hidden>
                    Example: Ask budget, timeline, and product interest automatically.
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Starter pack */}
          <section id="starter-pack" style={{ marginTop: 20 }}>
            <div style={{ maxWidth: 720, margin: "18px auto", padding: 18, borderRadius: 12, background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 30px rgba(10,15,31,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>Starter Pack <span style={{ background: "#1477FF", color: "#fff", padding: "4px 8px", borderRadius: 999, fontSize: 12, marginLeft: 8 }}>First-Time Exclusive</span></div>
                  <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>RM168</div>
                </div>
                <div>
                  <a href="https://wa.me/6012XXXXXXXX?text=Hi%20Lumo%20Starter%20Pack" style={{ textDecoration: "none" }}>
                    <button className="cta-btn" aria-label="Get Starter Pack">Get Started for RM168</button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ marginTop: 28, padding: 22, color: "#6b7280", textAlign: "center" }}>© {new Date().getFullYear()} Lumo</footer>
        </main>
      </div>

      {/* tiny script to ensure any visible ".extra" toggles are managed post-render */}
      <script>{`(function(){document.querySelectorAll('.benefit-card .extra').forEach(e=>{e.style.display='none'});})();`}</script>
    </>
  );
}