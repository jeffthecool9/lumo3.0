-- Browser roles have no table access. Verified Firebase requests use scoped server queries.
create table public.workspace_settings (
  workspace_id uuid primary key references workspaces(id),
  industry text not null default 'beauty' check(industry in ('beauty','home_services','retail','other')),
  timezone text not null default 'Asia/Kuala_Lumpur'
);
create table public.crm_leads (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id),
  name text not null check(length(name) between 1 and 100), email text not null default '', phone text not null default '',
  interest text not null default '', notes text not null default '',
  stage text not null default 'new' check(stage in ('new','qualified','follow_up','won','lost')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(workspace_id,id)
);
create table public.appointments (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id), lead_id uuid not null,
  service text not null, resource text not null check(length(resource) between 1 and 80),
  starts_at timestamptz not null, ends_at timestamptz not null,
  status text not null default 'requested' check(status in ('requested','confirmed','completed','cancelled')),
  notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(ends_at>starts_at and ends_at<=starts_at+interval '24 hours'),
  foreign key(workspace_id,lead_id) references crm_leads(workspace_id,id)
);
create table public.inbox_threads (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id), lead_id uuid not null,
  channel text not null check(channel in ('whatsapp','web')), status text not null default 'open' check(status in ('open','resolved')),
  handoff boolean not null default true, subject text not null default '', updated_at timestamptz not null default now(),
  unique(workspace_id,id), foreign key(workspace_id,lead_id) references crm_leads(workspace_id,id)
);
create table public.inbox_messages (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id), thread_id uuid not null,
  direction text not null check(direction in ('inbound','outbound','internal')), body text not null check(length(body) between 1 and 4000),
  delivery text not null check(delivery in ('received','sent','failed','internal')), provider_message_id text,
  created_at timestamptz not null default now(),
  foreign key(workspace_id,thread_id) references inbox_threads(workspace_id,id), unique(workspace_id,provider_message_id)
);
-- Public connection metadata only. Provider tokens must live in a separate encrypted store.
create table public.channel_connections (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id),
  channel text not null check(channel in ('whatsapp','web')), status text not null default 'disconnected' check(status in ('disconnected','pending','connected','error')),
  display_name text not null default '', updated_at timestamptz not null default now(), unique(workspace_id,channel)
);
create index on crm_leads(workspace_id,updated_at desc);
create index on appointments(workspace_id,starts_at);
create index on inbox_threads(workspace_id,updated_at desc);
create index on inbox_messages(workspace_id,thread_id,created_at);

create function public.prevent_appointment_overlap() returns trigger language plpgsql set search_path=public as $$
begin
  -- Serialize scheduling changes per workspace, including simultaneous confirmations.
  perform 1 from workspaces where id=new.workspace_id for update;
  if new.status='confirmed' and exists(select 1 from appointments a where a.workspace_id=new.workspace_id
    and a.id<>new.id and a.status='confirmed' and lower(a.resource)=lower(new.resource)
    and a.starts_at<new.ends_at and a.ends_at>new.starts_at) then
    raise exception 'This resource already has a confirmed appointment at that time.';
  end if;
  new.updated_at=now(); return new;
end $$;
create trigger appointment_overlap before insert or update on appointments for each row execute function prevent_appointment_overlap();

alter table workspace_settings enable row level security;
alter table crm_leads enable row level security;
alter table appointments enable row level security;
alter table inbox_threads enable row level security;
alter table inbox_messages enable row level security;
alter table channel_connections enable row level security;
revoke all on workspace_settings,crm_leads,appointments,inbox_threads,inbox_messages,channel_connections from anon,authenticated;
grant all on workspace_settings,crm_leads,appointments,inbox_threads,inbox_messages,channel_connections to service_role;
revoke execute on function prevent_appointment_overlap() from public,anon,authenticated;
