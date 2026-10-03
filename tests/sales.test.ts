import {describe,it,expect} from 'vitest';
import {offerInput,followupInput,followupPatch,priceToSen,rm} from '../shared/sales';
describe('sales inputs',()=>{
 it('stores exact sen rather than rounded floating point prices',()=>{expect(priceToSen('99.99')).toBe(9999);expect(priceToSen('0.01')).toBe(1);expect(rm(9999)).toBe('RM 99.99');});
 it.each(['-1','1.001','NaN','1e3','1,000',''])('rejects invalid price %s',value=>{expect(()=>priceToSen(value)).toThrow();});
 it('rejects client approval or workspace injection',()=>{expect(offerInput.safeParse({name:'Offer',description:'',terms:'',price_sen:9900,approved_at:'now'}).success).toBe(false);expect(followupPatch.safeParse({status:'completed',workspace_id:'other'}).success).toBe(false);});
 it('requires a real lead id and unambiguous due date',()=>{expect(followupInput.safeParse({lead_id:'other',title:'Call',notes:'',due_at:'tomorrow'}).success).toBe(false);});
});
