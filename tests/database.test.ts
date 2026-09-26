import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {beforeAll,afterAll,beforeEach,describe,it,expect} from 'vitest';
let db:PGlite;
const userA='10000000-0000-4000-8000-000000000001',userB='10000000-0000-4000-8000-000000000002';
let a:string,b:string;
async function query(sql:string,params:any[]=[]){return (await db.query<any>(sql,params)).rows;}
async function reserve(w=a,kind='plan',cost=100){return (await query('select reserve_usage($1,$2,$3) id',[w,kind,cost]))[0].id;}
async function settle(id:string,cost:number|null=100){await query("select settle_usage($1,$2,'complete')",[id,cost]);}
beforeAll(async()=>{
  db=new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth,public to anon,authenticated,service_role;");
  await db.exec(readFileSync(new URL('../supabase/migrations/001_lumo.sql',import.meta.url),'utf8'));
  await query('insert into auth.users values($1),($2)',[userA,userB]);
  await db.exec(readFileSync(new URL('../supabase/migrations/002_firebase_auth.sql',import.meta.url),'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/003_business_operations.sql',import.meta.url),'utf8'));
  a=(await query('select ensure_workspace($1) id',[userA]))[0].id;b=(await query('select ensure_workspace($1) id',[userB]))[0].id;
});
afterAll(async()=>{await db?.close();});
beforeEach(async()=>{
  await db.exec('reset role; delete from inbox_messages; delete from inbox_threads; delete from appointments; delete from crm_leads;');
  await db.exec("reset role; delete from usage_records; delete from trial_claims; update platform_controls set ai_enabled=true,daily_cost_micros=10000000; update billing set status='trialing',tier='trial',price_valid=true,trial_verified=true,trial_used=false,review_required=false,paid_verified=false,period_start=now(),period_end=now()+interval '7 days',checkout_key=null,checkout_session=null,subscription_id=null,sync_version=0;");
});
describe('business operations integrity',()=>{
  async function lead(workspace=a){return (await query("insert into crm_leads(workspace_id,name) values($1,'Test lead') returning id",[workspace]))[0].id;}
  async function booking(workspace:string,leadId:string,start:string,end:string,resource='Chair A',status='confirmed'){
    return query('insert into appointments(workspace_id,lead_id,service,resource,starts_at,ends_at,status) values($1,$2,$3,$4,$5,$6,$7) returning id',[workspace,leadId,'Haircut',resource,start,end,status]);
  }
  it('cannot attach another business lead to an appointment or inbox',async()=>{
    const id=await lead(b);
    await expect(booking(a,id,'2027-01-01T03:00Z','2027-01-01T04:00Z')).rejects.toThrow(/foreign key/);
    await expect(query("insert into inbox_threads(workspace_id,lead_id,channel,subject) values($1,$2,'web','Test')",[a,id])).rejects.toThrow(/foreign key/);
  });
  it('rejects overlapping confirmed slots but allows adjacent slots and other resources',async()=>{
    const id=await lead();
    await booking(a,id,'2027-01-01T03:00Z','2027-01-01T04:00Z');
    await expect(booking(a,id,'2027-01-01T03:30Z','2027-01-01T04:30Z','chair a')).rejects.toThrow(/already/);
    await booking(a,id,'2027-01-01T04:00Z','2027-01-01T05:00Z');
    await booking(a,id,'2027-01-01T03:00Z','2027-01-01T04:00Z','Chair B');
    expect(await query('select id from appointments')).toHaveLength(3);
  });
  it('allows requests to overlap, but checks again when confirming',async()=>{
    const id=await lead();
    await booking(a,id,'2027-01-01T03:00Z','2027-01-01T04:00Z');
    const [request]=await booking(a,id,'2027-01-01T03:30Z','2027-01-01T04:30Z','Chair A','requested');
    await expect(query("update appointments set status='confirmed' where id=$1",[request.id])).rejects.toThrow(/already/);
  });
  it('does not mix resources between businesses and rejects reversed times',async()=>{
    await booking(a,await lead(a),'2027-01-01T03:00Z','2027-01-01T04:00Z');
    await booking(b,await lead(b),'2027-01-01T03:00Z','2027-01-01T04:00Z');
    await expect(booking(a,await lead(),'2027-01-01T04:00Z','2027-01-01T03:00Z')).rejects.toThrow(/check constraint/);
  });
  it('scopes message ownership and deduplicates incoming provider IDs',async()=>{
    const id=await lead(a);
    const [thread]=await query("insert into inbox_threads(workspace_id,lead_id,channel,subject) values($1,$2,'whatsapp','Test') returning id",[a,id]);
    const sql="insert into inbox_messages(workspace_id,thread_id,direction,body,delivery,provider_message_id) values($1,$2,'inbound','Hello','received','provider-123')";
    await expect(query(sql,[b,thread.id])).rejects.toThrow(/foreign key/);
    await query(sql,[a,thread.id]);
    await expect(query(sql,[a,thread.id])).rejects.toThrow(/unique constraint/);
  });
  it.each(['anon','authenticated'])('denies direct business-record reads and writes to %s',async role=>{
    await db.exec(`set role ${role}`);
    for(const table of ['crm_leads','appointments','inbox_threads','inbox_messages','channel_connections','workspace_settings']){
      await expect(query(`select * from ${table}`)).rejects.toThrow(/permission denied/);
      await expect(query(`delete from ${table}`)).rejects.toThrow(/permission denied/);
    }
    await db.exec('reset role');
  });
});
describe('database protection with real PostgreSQL engine',()=>{
  it('creates only one workspace per account',async()=>{expect((await query('select ensure_workspace($1) id',[userA]))[0].id).toBe(a);});
  it('blocks requests without valid billing',async()=>{
    for(const status of ['none','past_due','canceled','incomplete']){await query('update billing set status=$1 where workspace_id=$2',[status,a]);await expect(reserve()).rejects.toThrow(/active verified/);}
  });
  it('enforces the trial expiry at request time',async()=>{await query("update billing set period_end=now()-interval '1 second' where workspace_id=$1",[a]);await expect(reserve()).rejects.toThrow(/active verified/);});
  it('allows three generations and rejects the fourth',async()=>{for(let i=0;i<3;i++)await settle(await reserve());await expect(reserve()).rejects.toThrow(/allowance/);});
  it('rejects parallel reservations before overspending',async()=>{
    const results=await Promise.allSettled([reserve(),reserve()]);expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(results.filter(r=>r.status==='rejected')).toHaveLength(1);
  });
  it('shares the cost budget between planning and replies',async()=>{await settle(await reserve(a,'plan',490000),490000);await expect(reserve(a,'reply',11000)).rejects.toThrow(/AI budget/);});
  it('enforces the global daily budget across businesses',async()=>{await db.exec('update platform_controls set daily_cost_micros=150');await settle(await reserve(),100);await expect(reserve(b)).rejects.toThrow(/capacity/);});
  it('honors the operator kill switch',async()=>{await db.exec('update platform_controls set ai_enabled=false');await expect(reserve()).rejects.toThrow(/paused/);});
  it('retains cost and count after uncertain provider failures',async()=>{const id=await reserve();await query("select settle_usage($1,null,'uncertain')",[id]);const rows=await query('select cost_micros,status from usage_records where id=$1',[id]);expect(Number(rows[0].cost_micros)).toBe(100);expect(rows[0].status).toBe('uncertain');});
  it('settles once and ignores replayed settlements',async()=>{const id=await reserve();await settle(id,75);await settle(id,0);expect(Number((await query('select cost_micros from usage_records where id=$1',[id]))[0].cost_micros)).toBe(75);});
  it('blocks second trials using the same card and remembers used trials',async()=>{
    expect((await query('select claim_trial($1,$2,$3,$4) ok',[a,'email-a','sub-a','card-a']))[0].ok).toBe(true);
    expect((await query('select claim_trial($1,$2,$3,$4) ok',[b,'email-b','sub-b','card-a']))[0].ok).toBe(false);
    await expect(reserve(b)).rejects.toThrow(/active verified/);
    expect((await query('select claim_trial($1,$2,$3,$4) ok',[a,'email-a','sub-a','card-a']))[0].ok).toBe(true);
    expect((await query('select claim_trial($1,$2,$3,$4) ok',[a,'email-a','sub-new','card-new']))[0].ok).toBe(false);
  });
  it('does not let an older reconciliation overwrite newer billing',async()=>{
    const v1=(await query('select begin_sync($1) v',[a]))[0].v;const v2=(await query('select begin_sync($1) v',[a]))[0].v;
    const data={status:'past_due',tier:'paid',period_start:new Date().toISOString(),period_end:new Date(Date.now()+86400000).toISOString(),paid_verified:false,price_valid:true,cancel_at_end:false};
    await query('select apply_subscription($1,$2,$3,$4)',[a,v2,'sub-a',data]);
    await query('select apply_subscription($1,$2,$3,$4)',[a,v1,'sub-a',{...data,status:'active',paid_verified:true}]);
    expect((await query('select status from billing where workspace_id=$1',[a]))[0].status).toBe('past_due');
  });
  it('separates paid billing periods without resetting trial usage',async()=>{
    await settle(await reserve());await query("update billing set status='active',tier='paid',paid_verified=true where workspace_id=$1",[a]);
    expect((await query('select usage_summary($1) u',[a]))[0].u.plans).toBe(0);
    await query("update billing set status='trialing',tier='trial' where workspace_id=$1",[a]);expect((await query('select usage_summary($1) u',[a]))[0].u.plans).toBe(1);
  });
  it('preserves earlier plan versions',async()=>{
    const first=(await query('select (create_plan($1,$2)).*',[a,{title:'First'}]))[0];const second=(await query('select (create_plan($1,$2)).*',[a,{title:'Second'}]))[0];
    expect(second.version).toBeGreaterThan(first.version);expect((await query('select content from plans where id=$1',[first.id]))[0].content.title).toBe('First');
  });
  it('prevents browser roles reading another business or mutating entitlements',async()=>{
    await query("select set_config('request.jwt.claim.sub',$1,false)",[userA]);await db.exec('set role authenticated');
    await expect(query('select id from workspaces')).rejects.toThrow(/permission denied/);
    await expect(query('select * from app_users')).rejects.toThrow(/permission denied/);
    await expect(query('select * from billing')).rejects.toThrow(/permission denied/);
    await expect(query('select reserve_usage($1,$2,$3)',[b,'plan',1])).rejects.toThrow(/permission denied/);
    await expect(query("update knowledge set content='{}' where workspace_id=$1",[a])).rejects.toThrow(/permission denied/);
    await db.exec('reset role');
  });
  it('maps Firebase identity consistently without permitting workspace selection',async()=>{
    const first=(await query('select ensure_firebase_workspace($1) account',['firebase-user-a']))[0].account;
    const second=(await query('select ensure_firebase_workspace($1) account',['firebase-user-a']))[0].account;
    const other=(await query('select ensure_firebase_workspace($1) account',['firebase-user-b']))[0].account;
    expect(second).toEqual(first);expect(other.workspace_id).not.toBe(first.workspace_id);
    await expect(query('select ensure_firebase_workspace($1)',[''])).rejects.toThrow(/Invalid account/);
  });
  it('rejects repeat Firebase trials by verified phone, email, and card',async()=>{
    expect((await query('select claim_firebase_trial($1,$2,$3,$4) ok',[a,['email-a','phone-a'],'sub-a','card-a']))[0].ok).toBe(true);
    expect((await query('select claim_firebase_trial($1,$2,$3,$4) ok',[b,['phone-a'],'sub-b','card-b']))[0].ok).toBe(false);
    await expect(reserve(b)).rejects.toThrow(/active verified/);
    expect((await query('select claim_firebase_trial($1,$2,$3,$4) ok',[a,['email-a','phone-a'],'sub-a','card-a']))[0].ok).toBe(true);
  });
  it('fails trial eligibility closed when a card fingerprint is unavailable',async()=>{
    expect((await query('select claim_firebase_trial($1,$2,$3,$4) ok',[a,['email-a'],'sub-a',null]))[0].ok).toBe(false);
    await expect(reserve()).rejects.toThrow(/active verified/);
  });
});
