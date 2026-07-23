-- Development-only demonstration seed for local Supabase resets.
-- Every record is synthetic, visibly labelled, and safe to discard. No Auth user or admin profile is created.
-- Never apply this file to production and never replace these rows with copied visitor or inquiry records.

begin;

insert into public.page_views (
  id,
  anonymous_visitor_id,
  session_id,
  path,
  referrer,
  device_type,
  browser_type,
  created_at
)
values
  ('10000000-0000-4000-8000-000000000001', 'demo-visitor-001', 'demo-session-001', '/demo/phase-06-sample', null, 'mobile', 'safari', now() - interval '2 days'),
  ('10000000-0000-4000-8000-000000000002', 'demo-visitor-001', 'demo-session-001', '/demo/phase-06-sample/gallery', '/demo/phase-06-sample', 'mobile', 'safari', now() - interval '2 days' + interval '5 minutes'),
  ('10000000-0000-4000-8000-000000000003', 'demo-visitor-002', 'demo-session-002', '/demo/phase-06-sample', null, 'desktop', 'chrome', now() - interval '1 day')
on conflict (id) do nothing;

insert into public.link_clicks (
  id,
  anonymous_visitor_id,
  session_id,
  link_type,
  destination_url,
  source_page,
  created_at
)
values
  ('20000000-0000-4000-8000-000000000001', 'demo-visitor-001', 'demo-session-001', 'airbnb', 'https://example.invalid/demo-airbnb', '/demo/phase-06-sample', now() - interval '2 days' + interval '10 minutes'),
  ('20000000-0000-4000-8000-000000000002', 'demo-visitor-002', 'demo-session-002', 'google_maps', 'https://example.invalid/demo-map', '/demo/phase-06-sample/location', now() - interval '1 day' + interval '10 minutes')
on conflict (id) do nothing;

insert into public.contact_inquiries (
  id,
  name,
  email,
  phone,
  preferred_check_in,
  preferred_check_out,
  number_of_guests,
  message,
  consent,
  status,
  created_at
)
values (
  '30000000-0000-4000-8000-000000000001',
  '[DEMO] Sample Inquiry',
  'sample-inquiry@example.invalid',
  null,
  current_date + 30,
  current_date + 33,
  4,
  '[DEMO DATA] Synthetic inquiry used only to verify empty, loading, and populated administrator states.',
  true,
  'new',
  now() - interval '12 hours'
)
on conflict (id) do nothing;

commit;
