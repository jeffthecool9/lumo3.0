import {describe,it,expect} from 'vitest';
import request from 'supertest';
import {app} from '../server/app';
describe('unconfigured API fails closed',()=>{
  it('publishes only safe config fields',async()=>{
    const result=await request(app).get('/api/config');
    expect(result.status).toBe(200);
    expect(result.body).not.toHaveProperty('STRIPE_SECRET_KEY');
    expect(result.body).not.toHaveProperty('SUPABASE_SERVICE_ROLE_KEY');
  });
  it.each(['/plans/generate','/chat','/billing/checkout','/plans','/billing/cancel','/operations/leads','/operations/appointments','/operations/threads/10000000-0000-4000-8000-000000000001/notes','/operations/threads/10000000-0000-4000-8000-000000000001/replies'])('rejects anonymous access to %s',async url=>{
    const r=await request(app).post(`/api${url}`).send({mode:'trial',paid:true,trial:true});expect(r.status).toBe(401);
  });
  it('rejects anonymous access to business records and settings',async()=>{
    expect((await request(app).get('/api/operations')).status).toBe(401);
    expect((await request(app).put('/api/operations/settings').send({industry:'beauty',workspace_id:'other'})).status).toBe(401);
  });
  it('does not trust a checkout redirect parameter',async()=>{
    const r=await request(app).get('/api/workspace?checkout=success&paid=true');expect(r.status).toBe(401);
  });
  it('rejects foreign-origin mutations',async()=>{
    const r=await request(app).post('/api/plans/generate').set('Origin','https://attacker.example').send({});expect(r.status).toBe(403);
  });
  it('never treats an unsigned webhook as payment',async()=>{
    const r=await request(app).post('/api/billing/webhook').send({type:'invoice.paid'});expect(r.status).toBeGreaterThanOrEqual(400);
  });
});
