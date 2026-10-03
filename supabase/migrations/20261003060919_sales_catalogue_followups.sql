create table public.sales_offers (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id),
 name text not null check(length(name) between 1 and 120), description text not null default '' check(length(description)<=1000),
 price_sen integer not null check(price_sen between 0 and 100000000), terms text not null default '' check(length(terms)<=1000),
 approved_at timestamptz, updated_at timestamptz not null default now()
);
create table public.sales_followups (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id), lead_id uuid not null,
 title text not null check(length(title) between 1 and 200), notes text not null default '' check(length(notes)<=1000), due_at timestamptz not null,
 status text not null default 'pending' check(status in ('pending','completed','cancelled')), updated_at timestamptz not null default now(),
 foreign key(workspace_id,lead_id) references public.crm_leads(workspace_id,id)
);
create index on public.sales_offers(workspace_id,updated_at desc);
create index on public.sales_followups(workspace_id,status,due_at);
create function public.review_sales_offer() returns trigger language plpgsql set search_path=public as $$
begin
 if (new.name,new.description,new.price_sen,new.terms) is distinct from (old.name,old.description,old.price_sen,old.terms) then new.approved_at=null; end if;
 new.updated_at=now(); return new;
end $$;
create trigger review_sales_offer before update on public.sales_offers for each row execute function public.review_sales_offer();
alter table public.sales_offers enable row level security;
alter table public.sales_followups enable row level security;
revoke all on public.sales_offers,public.sales_followups from anon,authenticated;
grant all on public.sales_offers,public.sales_followups to service_role;
revoke execute on function public.review_sales_offer() from public,anon,authenticated;
