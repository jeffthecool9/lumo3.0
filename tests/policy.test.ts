import {describe,it,expect} from 'vitest';
import {accessAllowed,billingProjection,estimateMicros} from '../server/policy';
const now=Date.now(), start=Math.floor(now/1000)-60, end=start+86400;
const subscription={status:'active',items:{data:[{price:{id:'price_starter'},current_period_start:start,current_period_end:end}]},latest_invoice:{status:'paid',amount_paid:9900},cancel_at_period_end:false};
describe('billing entitlement policy',()=>{
  it('requires a paid invoice for an active subscription',()=>{
    expect(billingProjection(subscription,'price_starter',now).paid_verified).toBe(true);
    for(const invoice of [null,'in_unknown',{status:'open',amount_paid:0},{status:'paid',amount_paid:0}])expect(billingProjection({...subscription,latest_invoice:invoice},'price_starter',now).paid_verified).toBe(false);
  });
  it('does not grant access for an unrelated price or expired period',()=>{
    expect(billingProjection(subscription,'price_other',now).paid_verified).toBe(false);
    expect(billingProjection(subscription,'price_starter',end*1000+1).paid_verified).toBe(false);
  });
  it.each(['past_due','unpaid','incomplete','paused','canceled'])('blocks %s even if the previous invoice was paid',status=>{
    const projected=billingProjection({...subscription,status},'price_starter',now);
    expect(accessAllowed(projected,now)).toBe(false);
  });
  it('keeps paid access through cancellation at period end',()=>{
    expect(accessAllowed(billingProjection({...subscription,cancel_at_period_end:true},'price_starter',now),now)).toBe(true);
  });
  it('requires trial verification and blocks review holds',()=>{
    const trial=billingProjection({...subscription,status:'trialing',trial_start:start,trial_end:end},'price_starter',now);
    expect(accessAllowed(trial,now)).toBe(false);
    expect(accessAllowed({...trial,trial_verified:true},now)).toBe(true);
    expect(accessAllowed({...trial,trial_verified:true,review_required:true},now)).toBe(false);
    expect(accessAllowed({...trial,trial_verified:true},end*1000)).toBe(false);
  });
  it('rounds provider usage up to a whole microdollar',()=>expect(estimateMicros(11,2,.1,.4)).toBe(2));
});
