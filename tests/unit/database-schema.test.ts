import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

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
] as const;

function readMigration(name: (typeof expectedMigrations)[number]) {
  return readFileSync(join(migrationDirectory, name), "utf8");
}

describe("database contract through analytics remediation", () => {
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

  it("uses repeatable, visibly synthetic seed data without creating an administrator", () => {
    const seed = readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf8");

    expect(seed).toContain("[DEMO]");
    expect(seed).toContain("example.invalid");
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
