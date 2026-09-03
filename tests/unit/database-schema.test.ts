import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { Database } from "@/types/database";

const migrationDirectory = join(process.cwd(), "supabase", "migrations");
const expectedMigrations = [
  "001_create_admin_profiles.sql",
  "002_create_analytics_tables.sql",
  "003_create_inquiries_table.sql",
  "004_enable_rls.sql",
  "005_create_admin_policies.sql",
  "006_create_analytics_views.sql",
  "007_create_dashboard_functions.sql",
  "008_add_waze_and_analytics_retention.sql",
  "009_add_inquiry_lifecycle.sql",
] as const;

function readMigration(name: (typeof expectedMigrations)[number]) {
  return readFileSync(join(migrationDirectory, name), "utf8");
}

describe("database contract through inquiry lifecycle hardening", () => {
  it("requires inquiry provenance and types narrow storage and exact-id deletion", () => {
    type InquiryTable = Database["public"]["Tables"]["contact_inquiries"];
    type InquiryIdentity = Pick<
      InquiryTable["Insert"],
      "privacy_notice_version" | "submission_id"
    >;
    type InquiryIdentityIsRequired = InquiryIdentity extends Required<InquiryIdentity>
      ? true
      : false;

    const storedProvenance = {
      privacy_notice_version: "2026-08-24",
      submission_id: "11111111-1111-4111-8111-111111111111",
    } satisfies Pick<
      InquiryTable["Row"],
      "privacy_notice_version" | "submission_id"
    >;
    const requiredInsertProvenance = {
      privacy_notice_version: "2026-08-24",
      submission_id: "11111111-1111-4111-8111-111111111111",
    } satisfies Pick<
      InquiryTable["Insert"],
      "privacy_notice_version" | "submission_id"
    >;
    const requiredAtInsert: InquiryIdentityIsRequired = true;
    const deleteArgs = {
      p_inquiry_id: "11111111-1111-4111-8111-111111111111",
    } satisfies Database["public"]["Functions"]["delete_contact_inquiry"]["Args"];
    const storeArgs = {
      p_email: "guest@example.invalid",
      p_message: "[QA] Please review this synthetic inquiry.",
      p_name: "[QA] Sample Guest",
      p_number_of_guests: 2,
      p_phone: null,
      p_preferred_check_in: null,
      p_preferred_check_out: null,
      p_privacy_notice_version: "2026-08-24",
      p_submission_id: "11111111-1111-4111-8111-111111111111",
    } satisfies Database["public"]["Functions"]["store_contact_inquiry"]["Args"];
    const storeResult: Database["public"]["Functions"]["store_contact_inquiry"]["Returns"] =
      "created";

    expect(storedProvenance.privacy_notice_version).toBe("2026-08-24");
    expect(storedProvenance.submission_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(requiredInsertProvenance).toEqual(storedProvenance);
    expect(requiredAtInsert).toBe(true);
    expect(deleteArgs.p_inquiry_id).toBe(storedProvenance.submission_id);
    expect(storeArgs.p_submission_id).toBe(storedProvenance.submission_id);
    expect(storeArgs.p_privacy_notice_version).toBe("2026-08-24");
    expect(storeResult).toBe("created");
  });

  it("keeps the required migrations ordered and documented", () => {
    const migrations = readdirSync(migrationDirectory).filter((file) => file.endsWith(".sql")).sort();

    expect(migrations).toEqual(expectedMigrations);

    for (const migration of expectedMigrations) {
      const sql = readMigration(migration);
      expect(sql).toContain("-- Purpose:");
      expect(sql).toContain("-- Security:");
      expect(sql).toContain("-- Dependencies:");
      expect(sql).toContain("-- Reversibility:");
    }
  });

  it("defines all tables, bounds, enum-like values, and requested indexes", () => {
    const schema = expectedMigrations.slice(0, 3).map(readMigration).join("\n");

    for (const table of ["admin_profiles", "page_views", "link_clicks", "contact_inquiries"]) {
      expect(schema).toMatch(new RegExp(`create table public\\.${table}\\b`));
    }

    expect(schema).toContain("references auth.users (id) on delete cascade");
    expect(schema).toContain("'mobile', 'tablet', 'desktop', 'unknown'");
    expect(schema).toContain("'airbnb', 'facebook', 'messenger', 'google_maps', 'whatsapp', 'phone', 'email', 'other'");
    expect(schema).toContain("'new', 'reviewed', 'contacted', 'closed', 'spam'");
    expect(schema).toContain("number_of_guests between 1 and 100");
    expect(schema).toContain("preferred_check_out > preferred_check_in");
    expect(schema).toContain("consent = true");
    expect(schema).toContain("contact_inquiries_contact_required");
    expect(schema).toContain("page_views_path_created_at_idx");
    expect(schema).toContain("link_clicks_type_created_at_idx");
    expect(schema).toContain("contact_inquiries_status_created_at_idx");
  });

  it("makes RLS deny-by-default and grants only administrator reads/status updates", () => {
    const rls = readMigration("004_enable_rls.sql");
    const policies = readMigration("005_create_admin_policies.sql");

    for (const table of ["admin_profiles", "page_views", "link_clicks", "contact_inquiries"]) {
      expect(rls).toContain(`alter table public.${table} enable row level security`);
      expect(rls).toContain(`revoke all on table public.${table} from public, anon, authenticated`);
    }

    expect(policies).toContain("security definer");
    expect(policies).toContain("set search_path = ''");
    expect(policies).toContain("where user_id = (select auth.uid())");
    expect(policies.match(/select private\.is_approved_admin\(\)/g)).toHaveLength(6);
    expect(policies).not.toMatch(/for\s+insert/i);
    expect(policies).not.toMatch(/to\s+anon/i);
    expect(policies).toContain("grant update (status) on table public.contact_inquiries to authenticated");
    expect(policies).not.toMatch(/grant\s+(?:insert|delete|truncate)[^;]*to\s+authenticated/i);
    expect(policies).toContain("grant insert on table public.page_views to service_role");
    expect(policies).toContain("grant insert on table public.link_clicks to service_role");
    expect(policies).toContain("grant insert on table public.contact_inquiries to service_role");
    expect(policies).not.toMatch(/grant\s+all/i);
  });

  it("keeps aggregate views RLS-aware and uses Asia/Manila dates", () => {
    const views = readMigration("006_create_analytics_views.sql");

    expect(views.match(/security_invoker = true/g)).toHaveLength(4);
    expect(views.match(/at time zone 'Asia\/Manila'/g)?.length).toBeGreaterThanOrEqual(4);
    expect(views).toContain("count(distinct anonymous_visitor_id)");
    expect(views).toContain("revoke all on table public.analytics_daily_overview from public, anon, authenticated");
  });

  it("keeps dashboard aggregates exact, bounded, and RLS-aware", () => {
    const functions = readMigration("007_create_dashboard_functions.sql");

    expect(functions.match(/security invoker/g)).toHaveLength(5);
    expect(
      functions.match(/p_end_exclusive <= p_start \+ interval '366 days'/g)?.length,
    ).toBeGreaterThanOrEqual(5);
    expect(functions).toContain("at time zone 'Asia/Manila'");
    expect(functions).toContain("count(distinct anonymous_visitor_id)");
    expect(functions).toContain("inner join period_page_views");
    expect(functions).toContain("limit 10");
    expect(functions.match(/to authenticated;/g)).toHaveLength(5);
    expect(functions).not.toMatch(/security definer/i);
    expect(functions).not.toMatch(/to anon/i);
  });

  it("adds exact Waze reporting and owner-only analytics retention", () => {
    const remediation = readMigration("008_add_waze_and_analytics_retention.sql");

    expect(remediation).toContain("create extension if not exists pg_cron");
    expect(remediation).toContain("drop constraint link_clicks_type_allowed");
    expect(remediation).toContain("'google_maps',\n      'waze',\n      'whatsapp'");
    expect(remediation).toContain("validate constraint link_clicks_type_allowed");
    expect(remediation).toContain(
      "create or replace function private.prune_expired_analytics()",
    );
    expect(remediation).toContain("security invoker");
    expect(remediation).toContain("set search_path = ''");
    expect(remediation).toContain("'365 days'::pg_catalog.interval");
    expect(remediation.match(/delete from public\.(?:page_views|link_clicks)/g)).toHaveLength(
      2,
    );
    expect(remediation).not.toMatch(/delete from public\.contact_inquiries/i);
    expect(remediation).toContain(
      "from public, anon, authenticated, service_role",
    );
    expect(remediation).not.toMatch(
      /grant\s+(?:delete|execute)[^;]*to\s+(?:public|anon|authenticated|service_role)/i,
    );
    expect(remediation).toContain("'villa-vessela-analytics-retention'");
    expect(remediation).toContain("'15 18 * * *'");
    expect(remediation).toContain(
      "$job$select * from private.prune_expired_analytics();$job$",
    );
    expect(remediation).toContain("revoke all on schema cron");
    expect(remediation).toContain("cron.alter_job(retention_job.job_id, active => true)");
    expect(remediation).not.toMatch(/drop extension/i);
  });

  it("adds idempotent inquiry provenance and an approved-admin delete boundary", () => {
    const lifecycle = readMigration("009_add_inquiry_lifecycle.sql");

    expect(lifecycle).toContain("add column submission_id uuid");
    expect(lifecycle).toContain("contact_inquiries_submission_id_unique");
    expect(lifecycle).toContain("unique (submission_id)");
    expect(lifecycle).toContain("contact_inquiries_submission_id_v4");
    expect(lifecycle).toContain("add column privacy_notice_version text");
    expect(lifecycle).toContain("privacy_notice_version = 'legacy-unversioned'");
    expect(lifecycle).toContain("alter column submission_id set not null");
    expect(lifecycle).toContain("alter column privacy_notice_version set not null");
    expect(lifecycle).not.toMatch(/(?:submission_id|privacy_notice_version)[^;]*default/i);
    expect(lifecycle).toContain(
      "contact_inquiries_privacy_notice_version_format",
    );
    expect(lifecycle).toContain(
      "privacy_notice_version = btrim(privacy_notice_version)",
    );
    expect(lifecycle).toContain(
      "privacy_notice_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'",
    );

    expect(lifecycle).toContain(
      "create or replace function public.store_contact_inquiry(",
    );
    expect(lifecycle).toContain(
      "on conflict on constraint contact_inquiries_submission_id_unique do nothing",
    );
    expect(lifecycle).toContain("get diagnostics inserted_rows = row_count");
    expect(lifecycle).toContain("then 'duplicate' else 'conflict'");
    expect(lifecycle).toContain("p_privacy_notice_version");
    expect(lifecycle).toContain("p_submission_id");
    expect(lifecycle).toContain(
      "grant execute on function public.store_contact_inquiry(",
    );
    expect(lifecycle).toMatch(
      /grant execute on function public\.store_contact_inquiry\([\s\S]*?\) to service_role;/,
    );
    expect(lifecycle).not.toMatch(
      /grant execute on function public\.store_contact_inquiry\([\s\S]*?\) to (?:public|anon|authenticated);/,
    );

    expect(lifecycle).toContain(
      "create or replace function public.delete_contact_inquiry(p_inquiry_id uuid)",
    );
    expect(lifecycle).toContain("returns boolean");
    expect(lifecycle).toContain("security definer");
    expect(lifecycle).toContain("if not (select private.is_approved_admin())");
    expect(lifecycle).toContain("where inquiries.id = p_inquiry_id");
    expect(lifecycle).toContain("get diagnostics deleted_rows = row_count");
    expect(lifecycle).toContain(
      "alter function public.delete_contact_inquiry(uuid) owner to postgres",
    );
    expect(lifecycle).toContain(
      "revoke all on function public.delete_contact_inquiry(uuid)",
    );
    expect(lifecycle).toContain(
      "grant execute on function public.delete_contact_inquiry(uuid)",
    );
    expect(lifecycle).toContain(
      "revoke delete on table public.contact_inquiries from public, anon, authenticated",
    );
    expect(lifecycle).not.toMatch(/grant\s+delete[^;]*contact_inquiries/i);
    expect(lifecycle).not.toMatch(/create\s+policy[^;]*for\s+delete/i);
    expect(lifecycle).not.toMatch(/execute\s+(?:format|\()/i);
    expect(lifecycle).not.toMatch(/truncate\s+(?:table\s+)?public\.contact_inquiries/i);
  });

  it("keeps inquiry retention owner-only, fixed, distinct, and replay-safe", () => {
    const lifecycle = readMigration("009_add_inquiry_lifecycle.sql");

    expect(lifecycle).toContain(
      "create or replace function private.prune_expired_inquiries()",
    );
    expect(lifecycle).toContain("returns bigint");
    expect(lifecycle).toContain("security invoker");
    expect(lifecycle).toContain("set search_path = ''");
    expect(lifecycle).toContain(
      "pg_catalog.statement_timestamp() - '365 days'::pg_catalog.interval",
    );
    expect(lifecycle).toMatch(
      /delete from public\.contact_inquiries[\s\S]*?where[\s\S]*?\.created_at\s*<[\s\S]*?'365 days'::pg_catalog\.interval/,
    );
    expect(lifecycle).toContain(
      "alter function private.prune_expired_inquiries() owner to postgres",
    );
    expect(lifecycle).toContain(
      "from public, anon, authenticated, service_role",
    );
    expect(lifecycle).not.toMatch(
      /grant\s+execute[^;]*prune_expired_inquiries[^;]*to\s+(?:public|anon|authenticated|service_role)/i,
    );

    expect(lifecycle.match(/cron\.schedule\(/g)).toHaveLength(1);
    expect(lifecycle).toContain("'villa-vessela-inquiry-retention'");
    expect(lifecycle).toContain("'25 18 * * *'");
    expect(lifecycle).toContain(
      "$job$select private.prune_expired_inquiries();$job$",
    );
    expect(lifecycle).toContain(
      "cron.alter_job(retention_job.job_id, active => true)",
    );

    expect(lifecycle).not.toMatch(/delete from public\.(?:page_views|link_clicks)/i);
    expect(lifecycle).not.toContain("private.prune_expired_analytics()");
    expect(lifecycle).not.toContain("'villa-vessela-analytics-retention'");
    expect(lifecycle).not.toMatch(/cron\.unschedule|drop extension/i);
  });

  it("uses repeatable, visibly synthetic seed data without creating an administrator", () => {
    const seed = readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf8");

    expect(seed).toContain("[DEMO]");
    expect(seed).toContain("example.invalid");
    expect(seed).toContain("submission_id");
    expect(seed).toContain("privacy_notice_version");
    expect(seed).toContain("'2026-08-24'");
    expect(seed).toContain("on conflict (id) do nothing");
    expect(seed).not.toMatch(/insert\s+into\s+(?:public\.)?admin_profiles/i);
    expect(seed).not.toMatch(/insert\s+into\s+auth\.users/i);
  });

  it("keeps local signup disabled and stores no credential in CLI configuration", () => {
    const config = readFileSync(join(process.cwd(), "supabase", "config.toml"), "utf8");

    expect(config.match(/enable_signup = false/g)).toHaveLength(3);
    expect(config).toContain('project_id = "villa-vessela-airbnb"');
    expect(config).not.toMatch(/service_role|access_token|database_password/i);
  });
});
