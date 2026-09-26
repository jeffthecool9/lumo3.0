import React from 'react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-[900] text-slate-900 mb-8">
        Terms & Privacy Policy
      </h1>

      <div className="space-y-8">
        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Service Agreement</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              By subscribing to Lumo, you agree to use our AI automation service for legitimate business purposes only. We provide automated customer conversation management through various messaging platforms.
            </p>
            <p>
              Your subscription is active from the date of payment and renews monthly unless cancelled. You may cancel at any time, and your service will remain active until the end of your current billing period.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Pricing & Cancellation</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              <strong>Starter Pack (RM168/month):</strong> Available to first-time customers. Cancel anytime. Service remains active until end of billing period.
            </p>
            <p>
              <strong>Standard Starter (RM399/month):</strong> Available after 6 months on the Starter Pack. Same cancellation terms apply.
            </p>
            <p>
              <strong>Enterprise:</strong> Custom pricing and terms negotiated individually.
            </p>
            <p>
              All prices are in Malaysian Ringgit (RM) and exclude applicable taxes. No refunds for partial months, but you can downgrade or cancel for future billing periods.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data & Privacy</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              We take your data seriously. Here's what we collect and how we use it:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Customer Conversations:</strong> We store conversations to train and improve your AI agent. Data is encrypted and never shared with third parties.
              </li>
              <li>
                <strong>Business Information:</strong> We collect details about your products, services, and business processes to customize your AI agent.
              </li>
              <li>
                <strong>Usage Analytics:</strong> We track how your AI performs to provide insights and recommendations.
              </li>
            </ul>
            <p>
              We are GDPR compliant and follow industry best practices for data security. You own your data and can request deletion at any time.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Service Guarantees</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              We guarantee 99.5% uptime for our service. If we fall below this threshold in any given month, you'll receive a pro-rated credit.
            </p>
            <p>
              While we strive for accuracy, AI is not perfect. We recommend reviewing important conversations and having human oversight for critical business decisions.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Acceptable Use</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>You may not use Lumo to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send spam or unsolicited messages</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Violate platform terms of service (WhatsApp, Facebook, etc.)</li>
              <li>Harass, threaten, or abuse others</li>
            </ul>
            <p>
              Violation of these terms may result in immediate termination of service without refund.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              Lumo is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
            <p>
              Our total liability is limited to the amount you paid in the past 12 months.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              We may update these terms from time to time. We'll notify you of significant changes via email at least 30 days in advance. Continued use of the service after changes take effect constitutes acceptance.
            </p>
          </div>
        </section>

        <section className="glass-heavy p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              Questions about these terms? Reach out to us:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href="https://wa.me/0123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  +60 12 345 6789
                </a>
              </li>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:hello@lumo.ai" className="text-blue-600 hover:underline">
                  hello@lumo.ai
                </a>
              </li>
            </ul>
          </div>
        </section>

        <div className="text-center text-sm text-slate-500 pt-8">
          Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
