import React from "react";

/**
 * Minimal, self-contained landing page.
 * No router, no external scripts, no inline <script> tags.
 * Overwrite your existing App.tsx with this exact file.
 */

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "Inter, Arial, Helvetica, sans-serif", padding: 20 }}>
      <header style={{ maxWidth: 1100, margin: "0 auto 18px", background: "rgba(255,255,255,0.95)", padding: 12, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 24px rgba(6,8,20,0.04)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(90deg,#1477FF,#21E3FF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>O</div>
          <div style={{ fontWeight: 800 }}>OmniReply</div>
        </div>
        <div>
          <button style={{ background: "#1477FF", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none" }}>Get Started</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ display: "inline-block", padding: 22, borderRadius: 14, background: "rgba(255,255,255,0.92)", boxShadow: "0 10px 30px rgba(10,15,31,0.06)" }}>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.05 }}>
              Why Malaysian Bosses Love
              <br />
              <span style={{ background: "linear-gradient(90deg,#1477FF,#21E3FF)", WebkitBackgroundClip: "text", color: "transparent", fontWeight: 900 }}>
                Saving Tons of Money with OmniReply!
              </span>
            </h1>
            <p style={{ marginTop: 8, color: "#6b7280" }}>You didn't start a business to become a 24/7 admin. Let the AI handle the noise.</p>
          </div>
        </section>

        <section aria-label="financial" style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: "100%", maxWidth: 720, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.94)", textAlign: "center", boxShadow: "0 8px 28px rgba(10,15,31,0.06)" }}>
            <div style={{ color: "#475569", fontSize: 15, lineHeight: 1.6 }}>
              According to our 1-year analysis, you can save up to
              <div style={{ fontSize: 20, fontWeight: 900, color: "#0f5132", marginTop: 8 }}>RM360,000/year.</div>
              <div style={{ marginTop: 10, color: "#334155" }}>
                By automating repetitive tasks, businesses cut support teams from <strong>20 to 5</strong>, slashing monthly overhead by <strong style={{ color: "#16a34a" }}>RM25k–RM30k</strong>.
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr", marginBottom: 18 }}>
          {[
            { i: "💬", t: "Responds instantly", d: "Never miss a customer — replies in seconds." },
            { i: "🔁", t: "Qualifies leads automatically", d: "Collects info, filters prospects, hands you warm leads." },
            { i: "⚙️", t: "Close sales in chat", d: "Send product info, payment links, and confirmations inside WhatsApp." },
            { i: "🕒", t: "24/7 uptime", d: "Works around the clock — no extra staff needed." }
          ].map((b) => (
            <div key={b.t} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14, borderRadius: 12, background: "#fff", boxShadow: "0 8px 20px rgba(15,23,42,0.04)" }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: "linear-gradient(180deg, rgba(20,120,255,0.08), rgba(33,227,255,0.04))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{b.i}</div>
              <div>
                <div style={{ fontWeight: 800 }}>{b.t}</div>
                <div style={{ color: "#556173", marginTop: 6 }}>{b.d}</div>
              </div>
            </div>
          ))}
        </section>

        <section id="pricing" style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 8px 24px rgba(10,15,31,0.05)" }}>
              <div style={{ fontWeight: 900 }}>Starter Pack</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>RM168</div>
              <div style={{ marginTop: 10, color: "#6b7280" }}>First-time exclusive. Cancel anytime; active until end of billing period.</div>
              <div style={{ marginTop: 12 }}>
                <a href="https://wa.me/6012XXXXXXXX?text=Hi%20OmniReply%20Starter%20Pack"><button style={{ background: "#1477FF", color: "#fff", padding: "10px 12px", borderRadius: 8, border: "none" }}>Buy RM168</button></a>
                <a href="/terms" style={{ marginLeft: 12, color: "#475569", textDecoration: "underline" }}>Terms & Policy</a>
              </div>
            </div>

            <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 8px 24px rgba(10,15,31,0.05)" }}>
              <div style={{ fontWeight: 900 }}>Standard Starter</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>RM399</div>
              <div style={{ marginTop: 10, color: "#6b7280" }}>Upgrade eligibility after 6 months active on RM168.</div>
              <div style={{ marginTop: 12 }}>
                <a href="https://wa.me/6012XXXXXXXX?text=Hi%20OmniReply%20Standard%20Starter"><button style={{ background: "#0f172a", color: "#fff", padding: "10px 12px", borderRadius: 8, border: "none" }}>Buy RM399</button></a>
                <a href="/terms" style={{ marginLeft: 12, color: "#475569", textDecoration: "underline" }}>Terms & Policy</a>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ textAlign: "center", color: "#6b7280", paddingBottom: 30 }}>© {new Date().getFullYear()} OmniReply</footer>
      </main>
    </div>
  );
}