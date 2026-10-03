-- Preserve workspace IDs while moving account verification to Firebase.
create table public.app_users (
  id uuid primary key default gen_random_uuid(), firebase_uid text unique,
  created_at timestamptz not null default now()
);
insert into app_users(id) select id from auth.users on conflict do nothing;
alter table workspaces drop constraint workspaces_owner_id_fkey;
alter table memberships drop constraint memberships_user_id_fkey;
alter table workspaces add constraint workspaces_owner_id_fkey foreign key(owner_id) references app_users(id);
alter table memberships add constraint memberships_user_id_fkey foreign key(user_id) references app_users(id);
alter table app_users enable row level security;
revoke all on app_users from anon,authenticated;
grant all on app_users to service_role;

create function public.ensure_firebase_workspace(p_uid text) returns jsonb language plpgsql security definer set search_path=public as $$
declare u uuid; w uuid;
begin
  if p_uid is null or length(p_uid)<1 or length(p_uid)>128 then raise exception 'Invalid account.'; end if;
  insert into app_users(firebase_uid) values(p_uid) on conflict(firebase_uid) do nothing;
  select id into u from app_users where firebase_uid=p_uid;
  w:=ensure_workspace(u);
  return jsonb_build_object('workspace_id',w,'user_id',u);
end $$;

create function public.claim_firebase_trial(p_workspace uuid,p_identities text[],p_subscription text,p_card text)
returns boolean language plpgsql security definer set search_path=public as $$
declare used boolean; reviewed boolean; identity text;
begin
  perform 1 from platform_controls where id=1 for update;
  if exists(select 1 from trial_claims where workspace_id=p_workspace and subscription_id=p_subscription) then
    return(select trial_verified and not review_required from billing where workspace_id=p_workspace);
  end if;
  select trial_used into used from billing where workspace_id=p_workspace for update;
  reviewed:=used or coalesce(array_length(p_identities,1),0)=0 or p_card is null or exists(
    select 1 from trial_claims where identity_hash=any(p_identities) or card_hash=p_card
  );
  foreach identity in array p_identities loop
    insert into trial_claims(identity_hash,workspace_id,subscription_id,card_hash)
      values(identity,p_workspace,p_subscription,p_card) on conflict do nothing;
  end loop;
  update billing set trial_used=true,trial_verified=not reviewed,review_required=reviewed where workspace_id=p_workspace;
  return not reviewed;
end $$;

-- Firebase clients cannot query Postgres directly. The backend validates every workspace.
drop policy own_memberships on memberships;
drop policy own_workspace on workspaces;
drop policy own_knowledge on knowledge;
drop policy own_plans on plans;
drop policy own_conversations on conversations;
revoke select on workspaces,memberships,knowledge,plans,conversations from authenticated;
revoke execute on function ensure_firebase_workspace(text) from public,anon,authenticated;
revoke execute on function claim_firebase_trial(uuid,text[],text,text) from public,anon,authenticated;
grant execute on function ensure_firebase_workspace(text) to service_role;
grant execute on function claim_firebase_trial(uuid,text[],text,text) to service_role;
