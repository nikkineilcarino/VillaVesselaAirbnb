import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { adminLoginSchema } from "@/lib/validation/auth";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

afterEach(() => {
  if (originalUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  }

  if (originalAnonKey === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnonKey;
  }
});

describe("Phase 7 administrator authentication", () => {
  it("accepts a bounded normalized email and a non-empty password", () => {
    const result = adminLoginSchema.safeParse({
      email: "  admin@example.invalid  ",
      password: "not-a-real-password",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("admin@example.invalid");
    }
  });

  it.each([
    { email: "", password: "password" },
    { email: "not-an-email", password: "password" },
    { email: `${"a".repeat(250)}@example.invalid`, password: "password" },
    { email: "admin@example.invalid", password: "" },
    { email: "admin@example.invalid", password: "x".repeat(257) },
  ])("rejects malformed or oversized login input", (input) => {
    expect(adminLoginSchema.safeParse(input).success).toBe(false);
  });

  it("fails closed when public Supabase configuration is incomplete or unsafe", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://remote.example.invalid";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-test-key";
    expect(getSupabasePublicConfig()).toBeNull();

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.example.invalid";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(getSupabasePublicConfig()).toBeNull();
  });

  it("allows HTTPS and documented local Supabase endpoints", () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-test-key";

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.example.invalid/";
    expect(getSupabasePublicConfig()).toEqual({
      anonKey: "public-test-key",
      url: "https://project.example.invalid",
    });

    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    expect(getSupabasePublicConfig()?.url).toBe("http://127.0.0.1:54321");
  });

  it("keeps proxy session verification separate from server profile authorization", () => {
    const root = process.cwd();
    const proxy = readFileSync(join(root, "src", "lib", "supabase", "proxy.ts"), "utf8");
    const nextConfig = readFileSync(join(root, "next.config.ts"), "utf8");
    const supabaseConfig = readFileSync(
      join(root, "src", "lib", "supabase", "config.ts"),
      "utf8",
    );
    const auth = readFileSync(join(root, "src", "lib", "auth", "admin.ts"), "utf8");
    const protectedLayout = readFileSync(
      join(root, "src", "app", "admin", "(protected)", "layout.tsx"),
      "utf8",
    );

    expect(proxy).toContain("supabase.auth.getClaims()");
    expect(proxy).toContain('"Cache-Control": "private, no-cache, no-store');
    expect(nextConfig).toContain('source: "/admin/:path*"');
    expect(nextConfig).toContain('value: "private, no-cache, no-store');
    expect(supabaseConfig).toContain('sameSite: "lax"');
    expect(supabaseConfig).toContain('secure: process.env.NODE_ENV === "production"');
    expect(auth).toContain("supabase.auth.getUser()");
    expect(auth).toContain('.from("admin_profiles")');
    expect(protectedLayout).toContain("await requireAdmin()");
  });

  it("provides no public signup or credential fallback in administrator source", () => {
    const root = process.cwd();
    const sourceFiles = [
      join(root, "src", "app", "admin", "login", "actions.ts"),
      join(root, "src", "app", "admin", "login", "page.tsx"),
      join(root, "src", "components", "auth", "AdminLoginForm.tsx"),
    ];
    const source = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

    expect(source).not.toMatch(/signUp\s*\(/);
    expect(source).not.toMatch(/default.{0,20}password\s*[:=]/i);
    expect(source).not.toMatch(/console\.(?:log|error|warn)/);
    expect(source).not.toContain("returnTo");
  });
});
