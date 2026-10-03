import Stripe from 'stripe';
import { createHmac } from 'node:crypto';
import { config, readiness } from './config.js';
import { database, rpc, checked } from './db.js';
import { AppError, billingProjection } from './policy.js';
import { firebaseAdmin } from './firebase.js';

export const stripe = config.STRIPE_SECRET_KEY ? new Stripe(config.STRIPE_SECRET_KEY, { maxNetworkRetries: 2, timeout: 20000 }) : null;
export function paymentGateway() {
  if (!stripe || !readiness.billing) throw new AppError(503, 'Stripe checkout is not connected yet. No payment or trial has been started.');
  return stripe;
}
const hash = (s: string) => createHmac('sha256', config.IDENTITY_HASH_SECRET).update(s).digest('hex');
export async function syncBilling(workspace: string) {
  const gateway = paymentGateway();
  const b = await checked(database().from('billing').select('*').eq('workspace_id', workspace).single());
  if (!b.customer_id) return;
  const revision = await rpc('begin_sync', { p_workspace: workspace });
  // Always read current Stripe state, never project an old webhook payload.
  let subscription: Stripe.Subscription | undefined;
  if (b.subscription_id) subscription = await gateway.subscriptions.retrieve(b.subscription_id, { expand: ['latest_invoice', 'default_payment_method', 'pending_setup_intent'] });
  if (!subscription || ['canceled','incomplete_expired'].includes(subscription.status)) {
    const list = await gateway.subscriptions.list({ customer: b.customer_id, limit: 100, status: 'all' });
    const newest = list.data.filter(s => s.metadata.workspace_id === workspace).sort((a,b) => b.created-a.created)[0];
    if (newest) subscription = await gateway.subscriptions.retrieve(newest.id, { expand: ['latest_invoice', 'default_payment_method', 'pending_setup_intent'] });
  }
  if (!subscription) return;
  if (subscription.customer !== b.customer_id || subscription.metadata.workspace_id !== workspace) throw new AppError(403,'Subscription ownership mismatch.');
  if (subscription.status === 'trialing') {
    const method = subscription.default_payment_method;
    const setup = subscription.pending_setup_intent;
    const setupReady = !setup || (typeof setup !== 'string' && setup.status === 'succeeded');
    if (method && typeof method !== 'string' && method.type === 'card' && setupReady) {
      const w = await checked(database().from('workspaces').select('owner_id').eq('id',workspace).single());
      const account = await checked(database().from('app_users').select('firebase_uid').eq('id',w.owner_id).single());
      const user = await firebaseAdmin().getUser(account.firebase_uid);
      const identities = [user.emailVerified&&user.email?hash(`email:${user.email.trim().toLowerCase()}`):null,user.phoneNumber?hash(`phone:${user.phoneNumber}`):null].filter(Boolean);
      if (!identities.length || user.disabled) throw new AppError(403,'Unable to verify trial eligibility.');
      const approved = await rpc('claim_firebase_trial', {
        p_workspace: workspace, p_subscription: subscription.id,
        p_identities: identities, p_card: method.card?.fingerprint ? hash(method.card.fingerprint) : null,
      });
      if (!approved && !subscription.cancel_at_period_end) {
        subscription = await gateway.subscriptions.update(subscription.id, { cancel_at_period_end: true, expand: ['latest_invoice'] });
      }
    }
  }
  await rpc('apply_subscription', { p_workspace: workspace, p_version: revision, p_subscription: subscription.id, p_data: billingProjection(subscription, config.STRIPE_PRICE_ID) });
}

export async function checkout(workspace: string, email: string|undefined, mode: 'trial'|'paid') {
  const gateway = paymentGateway();
  const price = await gateway.prices.retrieve(config.STRIPE_PRICE_ID);
  if (!price.active || price.currency !== 'myr' || price.unit_amount !== 9900 || price.recurring?.interval !== 'month' || price.recurring.interval_count !== 1) {
    throw new AppError(503, 'The RM99 monthly price is not configured correctly. Checkout is paused.');
  }
  await syncBilling(workspace);
  const reservation = await rpc('begin_checkout', { p_workspace: workspace, p_mode: mode });
  if (reservation.session) {
    const existing = await gateway.checkout.sessions.retrieve(reservation.session);
    if (existing.status === 'open' && existing.url) return existing.url;
    if (existing.status === 'complete') {
      await syncBilling(workspace);
      throw new AppError(409,'Checkout is complete. Refresh your workspace while payment is verified.');
    }
    await checked(database().from('billing').update({ checkout_key:null, checkout_session:null, checkout_mode:null }).eq('workspace_id',workspace).eq('checkout_key',reservation.key));
    throw new AppError(409,'The checkout expired. Please start again.');
  }
  const b = await checked(database().from('billing').select('*').eq('workspace_id',workspace).single());
  let customer = b.customer_id;
  if (!customer) {
    customer = (await gateway.customers.create({ email, metadata:{ workspace_id: workspace } },{ idempotencyKey:`customer-${workspace}` })).id;
    await checked(database().from('billing').update({ customer_id:customer }).eq('workspace_id',workspace));
  }
  const isTrial = reservation.mode === 'trial';
  const session = await gateway.checkout.sessions.create({
    customer, mode:'subscription', payment_method_types:['card'], payment_method_collection:'always',
    line_items:[{price:config.STRIPE_PRICE_ID,quantity:1}], client_reference_id:workspace,
    subscription_data:{ metadata:{workspace_id:workspace}, ...(isTrial ? { trial_period_days:7, trial_settings:{end_behavior:{missing_payment_method:'cancel' as const}} } : {}) },
    success_url:`${config.APP_URL}/workspace?checkout=returned`, cancel_url:`${config.APP_URL}/workspace?checkout=cancelled`,
    consent_collection:{terms_of_service:'required'},
    custom_text:{submit:{message:isTrial ? 'RM0 today, then RM99/month after 7 days unless cancelled in Usage & Billing. One trial per business. Usage and AI budget limits apply.' : 'RM99/month, automatically renewed. Cancel renewal in Usage & Billing. Usage and AI budget limits apply.'}},
  },{idempotencyKey:`checkout-${reservation.key}`});
  await checked(database().from('billing').update({checkout_session:session.id}).eq('workspace_id',workspace).eq('checkout_key',reservation.key));
  return session.url;
}

export async function reminder(event: Stripe.Event, workspace: string, sub: any) {
  if (!config.RESEND_API_KEY || !config.EMAIL_FROM) throw new AppError(503,'Trial reminder email delivery is not configured.');
  const id = `trial-reminder-${sub.id}`;
  const old = await checked(database().from('email_deliveries').select('id').eq('id',id).maybeSingle());
  if (old) return;
  const b = await checked(database().from('billing').select('customer_id').eq('workspace_id',workspace).single());
  const customer = await paymentGateway().customers.retrieve(b.customer_id);
  if (!('email' in customer) || !customer.email) throw new AppError(503,'Billing email is missing.');
  const end = new Date(sub.trial_end*1000).toLocaleString('en-MY',{ timeZone:'Asia/Kuala_Lumpur', dateStyle:'medium', timeStyle:'short' });
  const response = await fetch('https://api.resend.com/emails',{
    method:'POST', headers:{Authorization:`Bearer ${config.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':id},
    body:JSON.stringify({from:config.EMAIL_FROM,to:[customer.email],subject:'Your Lumo trial ends in 3 days',text:`Your Lumo trial ends on ${end} (Malaysia time). ${sub.cancel_at_period_end ? 'Renewal is cancelled. You will not be charged.' : 'Your subscription renews at RM99/month. Cancel before this date to avoid being charged.'}\nManage billing: ${config.APP_URL}/workspace?tab=billing`}),
    signal:AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new AppError(503,'Trial reminder could not be delivered.');
  await checked(database().from('email_deliveries').upsert({id}));
}

export async function handleBillingEvent(event: Stripe.Event) {
  const done = await checked(database().from('billing_events').select('id').eq('id',event.id).maybeSingle());
  if (done) return;
  const obj = event.data.object as any;
  const customer = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
  if (customer) {
    const b = await checked(database().from('billing').select('workspace_id').eq('customer_id',customer).maybeSingle());
    if (b) {
      await syncBilling(b.workspace_id);
      if (event.type === 'customer.subscription.trial_will_end') {
        const current = await paymentGateway().subscriptions.retrieve(obj.id);
        if (current.status==='trialing') await reminder(event,b.workspace_id,current);
      }
    }
  }
  await checked(database().from('billing_events').upsert({id:event.id}));
}
