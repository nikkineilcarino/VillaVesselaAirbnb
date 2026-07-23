-- Migration: 005_create_admin_policies
-- Purpose: Allow only approved authenticated administrators to read protected data and update inquiry status.
-- Tables affected: all four public application tables; creates private.is_approved_admin().
-- Security: The SECURITY DEFINER helper uses an empty search_path to prevent object-shadowing attacks. No anon policy is created.
-- Dependencies: Migrations 001-004 and Supabase auth.uid().
-- Reversibility: Drop policies and the helper after revoking its grants; tables return to deny-by-default RLS.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_approved_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_approved_admin() from public, anon, authenticated;
grant execute on function private.is_approved_admin() to authenticated;

comment on function private.is_approved_admin() is
  'Returns true only when the current authenticated user has a manually provisioned admin_profiles row.';

create policy "approved administrators can read admin profiles"
  on public.admin_profiles
  for select
  to authenticated
  using ((select private.is_approved_admin()));

create policy "approved administrators can read page views"
  on public.page_views
  for select
  to authenticated
  using ((select private.is_approved_admin()));

create policy "approved administrators can read link clicks"
  on public.link_clicks
  for select
  to authenticated
  using ((select private.is_approved_admin()));

create policy "approved administrators can read inquiries"
  on public.contact_inquiries
  for select
  to authenticated
  using ((select private.is_approved_admin()));

create policy "approved administrators can update inquiry status"
  on public.contact_inquiries
  for update
  to authenticated
  using ((select private.is_approved_admin()))
  with check ((select private.is_approved_admin()));

grant select on table public.admin_profiles to authenticated;
grant select on table public.page_views to authenticated;
grant select on table public.link_clicks to authenticated;
grant select on table public.contact_inquiries to authenticated;
grant update (status) on table public.contact_inquiries to authenticated;

-- The current Supabase Data API does not auto-expose new objects. Grant only the operations
-- required by future trusted server endpoints and out-of-band administrator provisioning.
grant select, insert, update, delete on table public.admin_profiles to service_role;
grant insert on table public.page_views to service_role;
grant insert on table public.link_clicks to service_role;
grant insert on table public.contact_inquiries to service_role;
