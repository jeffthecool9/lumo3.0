export class AppError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function billingProjection(subscription: any, expectedPrice: string, now = Date.now()) {
  const item = subscription.items?.data?.[0];
  const trial = subscription.status === 'trialing';
  const invoice = subscription.latest_invoice;
  const paymentConfirmed = invoice && typeof invoice !== 'string' && invoice.status === 'paid' && invoice.amount_paid >= 9900;
  const matchesPrice = subscription.items?.data?.length === 1 && item?.price?.id === expectedPrice;
  const end = trial ? subscription.trial_end : item?.current_period_end;
  const start = trial ? subscription.trial_start : item?.current_period_start;
  const access = matchesPrice && end * 1000 > now && (trial || (subscription.status === 'active' && paymentConfirmed));
  return {
    status: subscription.status, tier: trial ? 'trial' : 'paid',
    period_start: start ? new Date(start * 1000).toISOString() : null,
    period_end: end ? new Date(end * 1000).toISOString() : null,
    paid_verified: Boolean(!trial && access), cancel_at_end: Boolean(subscription.cancel_at_period_end), price_valid: matchesPrice,
  };
}
export function accessAllowed(b: any, now = Date.now()) {
  return Boolean(b && b.price_valid && new Date(b.period_end).getTime() > now && !b.review_required &&
    ((b.status === 'trialing' && b.trial_verified) || (b.status === 'active' && b.paid_verified)));
}
export function estimateMicros(inputTokens: number, outputTokens: number, inputRate: number, outputRate: number) {
  return Math.ceil(inputTokens * inputRate + outputTokens * outputRate);
}
