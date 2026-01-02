import React from 'react';

export const Terms: React.FC = () => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="animate-fade-in-scale pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
             Legal
           </div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Terms & Policy</h1>
           <p className="text-slate-500">Effective date: {today}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">1</span>
              Refund and Cancellation
            </h2>
            <p className="text-slate-600 leading-relaxed pl-11">
              All sales are final. <strong>No refunds.</strong> You may cancel your subscription anytime. 
              Access remains active until the end of the paid period. We believe in transparent pricing and no hidden lock-in contracts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">2</span>
              Service Scope
            </h2>
            <p className="text-slate-600 leading-relaxed pl-11">
              Lumo provides the software infrastructure. For "Starter" plans, you are responsible for 
              configuring your specific message templates unless a "Done-For-You" setup package was purchased.
              Support is provided via email and WhatsApp during business hours.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">3</span>
              Data Privacy
            </h2>
            <p className="text-slate-600 leading-relaxed pl-11">
              We respect your data. Customer chat logs are processed solely for the purpose of 
              generating responses and are encrypted at rest. We do not sell your data to third parties.
              You retain full ownership of your customer list.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-400">
               Questions? Contact us at <a href="mailto:support@lumo.my" className="text-blue-600 hover:underline">support@lumo.my</a>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};