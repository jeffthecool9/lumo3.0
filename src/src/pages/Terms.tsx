export default function Terms() {
  const today = new Date().toLocaleDateString();
  return (
    <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "Inter, Arial, Helvetica, sans-serif", padding: 20 }}>
      <header style={{ maxWidth: 1100, margin: "0 auto 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(90deg,#1477FF,#21E3FF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>O</div>
          <div style={{ fontWeight: 800 }}>OmniReply</div>
        </div>
        <div>
          <a href="/" style={{ color: "#475569", textDecoration: "underline" }}>Back to site</a>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 10px 30px rgba(10,15,31,0.06)" }}>
        <h1>Terms & Policy — OmniReply</h1>
        <p><strong>Effective date:</strong> {today}</p>

        <h2>1. Refund and Cancellation</h2>
        <p>All sales are final. <strong>No refunds.</strong></p>
        <p>You may <strong>cancel anytime</strong>. When you cancel, your subscription or service remains active until the end of the current paid period. After the current paid period ends the subscription will auto-cancel. We will not issue refunds for already-paid periods.</p>

        <h2>2. Online-only operations</h2>
        <p>OmniReply is an online-only business. We <strong>do not operate</strong> a physical store or office. All meetings, demos, onboarding, and support sessions are conducted using online meeting tools (Zoom / Google Meet / Microsoft Teams or equivalent). No in-person meetings.</p>

        <h2>3. Payment after demo</h2>
        <p>For custom software edits and finalised deliverables, payment is <strong>required after the demo</strong> of the final software edits is presented to the customer. Once the customer confirms acceptance of the demo, payment becomes due immediately. If customer does not pay after acceptance, we reserve the right to suspend access and withhold final deliverables until payment is received.</p>

        <h2>4. Service scope for RM168 & RM399</h2>
        <p>RM168 (Starter Pack) and RM399 (Standard Starter) do not include message/template editing service by OmniReply. Customers receive access and are responsible for editing messages and templates themselves.</p>

        <h2>General</h2>
        <p>By using OmniReply services you acknowledge and accept these terms. We may update these Terms. Material changes will be posted on this page with a revised effective date.</p>

        <p>Contact: <a href="mailto:support@omnireply.example">support@omnireply.example</a></p>
      </main>

      <footer style={{ maxWidth: 900, margin: "18px auto 0", textAlign: "center", color: "#6b7280" }}>
        © {new Date().getFullYear()} OmniReply
      </footer>
    </div>
  );
}
