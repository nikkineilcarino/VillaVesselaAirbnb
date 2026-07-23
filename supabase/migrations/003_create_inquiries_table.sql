-- Migration: 003_create_inquiries_table
-- Purpose: Define optional inquiry storage before the form is activated in Phase 10.
-- Tables affected: public.contact_inquiries.
-- Security: Contact data is personal data. No public access is granted; RLS follows in migration 004.
-- Dependencies: Earlier migrations establish the ordered schema baseline; pgcrypto provides gen_random_uuid().
-- Reversibility: Drop the indexes and table; stored inquiry records are permanently lost.

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  preferred_check_in date,
  preferred_check_out date,
  number_of_guests integer,
  message text not null,
  consent boolean not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),

  constraint contact_inquiries_name_length
    check (char_length(btrim(name)) between 1 and 120),
  constraint contact_inquiries_email_length
    check (email is null or char_length(btrim(email)) between 1 and 254),
  constraint contact_inquiries_phone_length
    check (phone is null or char_length(btrim(phone)) between 1 and 40),
  constraint contact_inquiries_contact_required
    check (nullif(btrim(email), '') is not null or nullif(btrim(phone), '') is not null),
  constraint contact_inquiries_date_order
    check (preferred_check_in is null or preferred_check_out is null or preferred_check_out > preferred_check_in),
  constraint contact_inquiries_guest_count
    check (number_of_guests is null or number_of_guests between 1 and 100),
  constraint contact_inquiries_message_length
    check (char_length(btrim(message)) between 1 and 5000),
  constraint contact_inquiries_consent_required
    check (consent = true),
  constraint contact_inquiries_status_allowed
    check (status in ('new', 'reviewed', 'contacted', 'closed', 'spam'))
);

comment on table public.contact_inquiries is
  'Voluntarily submitted contact information; the feature remains disabled until Phase 10 safeguards exist.';
comment on column public.contact_inquiries.number_of_guests is
  'Technical anti-abuse bound only; it does not confirm property capacity or booking acceptance.';

create index contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
create index contact_inquiries_status_created_at_idx on public.contact_inquiries (status, created_at desc);
create index contact_inquiries_check_in_idx on public.contact_inquiries (preferred_check_in)
  where preferred_check_in is not null;

