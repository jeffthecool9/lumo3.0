-- Apply in a Supabase project. All writes are performed by the trusted backend.
create table public.workspaces (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null unique references auth.users(id),
  name text not null default 'My business', created_at timestamptz not null default now()
);
create table public.memberships (
  workspace_id uuid references public.workspaces(id) on delete cascade, user_id uuid references auth.users(id),
  primary key (workspace_id, user_id)
);
create table public.knowledge (
  workspace_id uuid primary key references public.workspaces(id), content jsonb not null default '{}'
);
create table public.plans (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id),
  version integer not null, content jsonb not null, approved_at timestamptz, created_at timestamptz not null default now(),
  unique(workspace_id, version)
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id),
  plan_id uuid not null references public.plans(id), messages jsonb not null default '[]', updated_at timestamptz not null default now()
);
create table public.billing (
  workspace_id uuid primary key references public.workspaces(id), customer_id text unique, subscription_id text unique,
  status text not null default 'none', tier text, period_start timestamptz, period_end timestamptz,
  price_valid boolean not null default false, paid_verified boolean not null default false,
  trial_verified boolean not null default false, trial_used boolean not null default false,
  review_required boolean not null default false, cancel_at_end boolean not null default false,
  sync_version bigint not null default 0, synced_at timestamptz,
  checkout_key uuid, checkout_session text, checkout_mode text
);
-- These hashed eligibility records intentionally survive account deletion.
create table public.trial_claims (
  identity_hash text primary key, workspace_id uuid not null, subscription_id text not null,
  card_hash text, claimed_at timestamptz not null default now()
);
create index on public.trial_claims(card_hash);
create table public.usage_records (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id),
  period_key text not null, kind text not null check (kind in ('plan','reply')),
  cost_micros bigint not null check(cost_micros >= 0), status text not null default 'reserved',
  created_at timestamptz not null default now(), finished_at timestamptz
);
create index on public.usage_records(workspace_id, period_key);
create index on public.usage_records(created_at);
create table public.platform_controls (
  id integer primary key check(id=1), ai_enabled boolean not null default false,
  daily_cost_micros bigint not null default 10000000
);
insert into public.platform_controls(id) values(1);
create table public.billing_events (id text primary key, processed_at timestamptz not null default now());
create table public.email_deliveries (id text primary key, sent_at timestamptz not null default now());

create function public.ensure_workspace(p_user uuid) returns uuid language plpgsql security definer set search_path = public as $$
declare w uuid;
begin
  insert into workspaces(owner_id) values(p_user) on conflict(owner_id) do nothing;
  select id into w from workspaces where owner_id=p_user;
  insert into memberships values(w,p_user) on conflict do nothing;
  insert into knowledge(workspace_id) values(w) on conflict do nothing;
  insert into billing(workspace_id) values(w) on conflict do nothing;
  return w;
end $$;

create function public.begin_sync(p_workspace uuid) returns bigint language plpgsql security definer set search_path = public as $$
declare v bigint;
begin
  update billing set sync_version=sync_version+1 where workspace_id=p_workspace returning sync_version into v;
  return v;
end $$;

create function public.apply_subscription(p_workspace uuid, p_version bigint, p_subscription text, p_data jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  update billing set subscription_id=p_subscription, status=p_data->>'status', tier=p_data->>'tier',
    period_start=(p_data->>'period_start')::timestamptz, period_end=(p_data->>'period_end')::timestamptz,
    paid_verified=(p_data->>'paid_verified')::boolean, price_valid=(p_data->>'price_valid')::boolean,
    cancel_at_end=(p_data->>'cancel_at_end')::boolean, synced_at=now(),
    checkout_key=case when p_data->>'status' in ('active','trialing') then null else checkout_key end,
    checkout_session=case when p_data->>'status' in ('active','trialing') then null else checkout_session end
  where workspace_id=p_workspace and sync_version=p_version;
end $$;

create function public.claim_trial(p_workspace uuid, p_identity text, p_subscription text, p_card text)
returns boolean language plpgsql security definer set search_path = public as $$
declare used boolean; reviewed boolean;
begin
  -- Serialize claims across workspaces so concurrent card reuse cannot race.
  perform 1 from platform_controls where id=1 for update;
  if exists(select 1 from trial_claims where workspace_id=p_workspace and subscription_id=p_subscription) then
    return (select trial_verified and not review_required from billing where workspace_id=p_workspace);
  end if;
  select trial_used into used from billing where workspace_id=p_workspace for update;
  reviewed := used or exists(select 1 from trial_claims where identity_hash=p_identity or (card_hash=p_card and p_card is not null));
  insert into trial_claims(identity_hash,workspace_id,subscription_id,card_hash)
    values(p_identity,p_workspace,p_subscription,p_card) on conflict do nothing;
  update billing set trial_used=true, trial_verified=not reviewed, review_required=reviewed where workspace_id=p_workspace;
  return not reviewed;
end $$;

create function public.begin_checkout(p_workspace uuid, p_mode text) returns jsonb language plpgsql security definer set search_path = public as $$
declare b billing;
begin
  select * into b from billing where workspace_id=p_workspace for update;
  if b.status in ('trialing','active','past_due','unpaid','incomplete','paused') then raise exception 'Manage your existing subscription in Billing.'; end if;
  if p_mode='trial' and b.trial_used then raise exception 'A trial has already been used. Choose Subscribe now.'; end if;
  if b.checkout_key is null then
    update billing set checkout_key=gen_random_uuid(), checkout_mode=p_mode where workspace_id=p_workspace returning * into b;
  end if;
  return jsonb_build_object('key',b.checkout_key,'session',b.checkout_session,'mode',b.checkout_mode);
end $$;

create function public.create_plan(p_workspace uuid, p_content jsonb) returns public.plans language plpgsql security definer set search_path = public as $$
declare v integer; result plans;
begin
  perform 1 from workspaces where id=p_workspace for update;
  select coalesce(max(version),0)+1 into v from plans where workspace_id=p_workspace;
  insert into plans(workspace_id,version,content) values(p_workspace,v,p_content) returning * into result;
  return result;
end $$;

create function public.reserve_usage(p_workspace uuid, p_kind text, p_estimate bigint)
returns uuid language plpgsql security definer set search_path = public as $$
declare b billing; ctl platform_controls; pk text; cap bigint; qty integer; used_count bigint; used_cost bigint; rid uuid;
begin
  if p_kind not in ('plan','reply') or p_estimate <= 0 then raise exception 'Invalid usage reservation.'; end if;
  select * into ctl from platform_controls where id=1 for update;
  select * into b from billing where workspace_id=p_workspace for update;
  if not ctl.ai_enabled then raise exception 'AI is temporarily paused. Your work is saved.'; end if;
  if b.workspace_id is null or not b.price_valid or b.review_required or b.period_end is null or b.period_end <= now() or
    not ((b.status='trialing' and b.trial_verified) or (b.status='active' and b.paid_verified)) then
    raise exception 'An active verified trial or paid subscription is required.';
  end if;
  pk := case when b.tier='trial' then 'trial' else b.period_start::text end;
  cap := case when b.tier='trial' then 500000 else 5000000 end;
  qty := case when p_kind='plan' then case when b.tier='trial' then 3 else 30 end else case when b.tier='trial' then 50 else 500 end end;
  -- A crashed request keeps its full reservation. Only its concurrency lock expires.
  if exists(select 1 from usage_records where workspace_id=p_workspace and status='reserved' and created_at>now()-interval '2 minutes') then
    raise exception 'A request is already running. Please wait.';
  end if;
  if (select count(*) from usage_records where workspace_id=p_workspace and created_at>now()-interval '1 minute') >= 8 then
    raise exception 'Too many requests. Please try again in a minute.';
  end if;
  select count(*) filter(where kind=p_kind), coalesce(sum(cost_micros),0) into used_count,used_cost
    from usage_records where workspace_id=p_workspace and period_key=pk;
  if used_count>=qty then raise exception 'Your generation allowance has been reached.'; end if;
  if used_cost+p_estimate>cap then raise exception 'Your AI budget has been reached. No overage will be charged.'; end if;
  if (select coalesce(sum(cost_micros),0) from usage_records where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')+p_estimate>ctl.daily_cost_micros then
    raise exception 'AI capacity is temporarily paused. Please try later.';
  end if;
  insert into usage_records(workspace_id,period_key,kind,cost_micros) values(p_workspace,pk,p_kind,p_estimate) returning id into rid;
  return rid;
end $$;

create function public.settle_usage(p_id uuid, p_actual bigint, p_status text) returns void language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('complete','failed','uncertain') or p_actual < 0 then raise exception 'Invalid settlement.'; end if;
  -- Unknown provider outcomes retain the reservation; never silently release possible spend.
  update usage_records set cost_micros=case when p_actual is null then cost_micros else p_actual end,
    status=p_status, finished_at=now() where id=p_id and status='reserved';
end $$;

create function public.usage_summary(p_workspace uuid) returns jsonb language sql security definer set search_path = public as $$
  select jsonb_build_object('plans',count(*) filter(where u.kind='plan'),'replies',count(*) filter(where u.kind='reply'),'costMicros',coalesce(sum(u.cost_micros),0))
  from usage_records u join billing b on b.workspace_id=u.workspace_id
  where u.workspace_id=p_workspace and u.period_key=case when b.tier='trial' then 'trial' else b.period_start::text end;
$$;

alter table workspaces enable row level security;
alter table memberships enable row level security;
alter table knowledge enable row level security;
alter table plans enable row level security;
alter table conversations enable row level security;
alter table billing enable row level security;
alter table trial_claims enable row level security;
alter table usage_records enable row level security;
alter table platform_controls enable row level security;
alter table billing_events enable row level security;
alter table email_deliveries enable row level security;
create policy own_memberships on memberships for select to authenticated using(user_id=auth.uid());
create policy own_workspace on workspaces for select to authenticated using(id in (select workspace_id from memberships where user_id=auth.uid()));
create policy own_knowledge on knowledge for select to authenticated using(workspace_id in (select workspace_id from memberships where user_id=auth.uid()));
create policy own_plans on plans for select to authenticated using(workspace_id in (select workspace_id from memberships where user_id=auth.uid()));
create policy own_conversations on conversations for select to authenticated using(workspace_id in (select workspace_id from memberships where user_id=auth.uid()));
-- Billing, hashes, reservations, and controls have no public read or write policies.
revoke all on all tables in schema public from anon, authenticated;
grant select on workspaces,memberships,knowledge,plans,conversations to authenticated;
grant all on all tables in schema public to service_role;
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on all functions in schema public to service_role;
