import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createCsv, escapeCsvCell } from "@/lib/csv/csv";

describe("CSV encoding", () => {
  it("quotes commas, quotes, and line breaks", () => {
    expect(escapeCsvCell('Hello, "Villa"\nGuest')).toBe(
      '"Hello, ""Villa""\nGuest"',
    );
  });

  it("prefixes spreadsheet formula-like cells after leading whitespace", () => {
    for (const value of ["=1+2", "+SUM(A1:A2)", "-4+5", "@cmd", "  =1+2"]) {
      const encoded = escapeCsvCell(value);
      expect(encoded.startsWith('"\'')).toBe(true);
    }
    expect(escapeCsvCell("ordinary text")).toBe('"ordinary text"');
  });

  it("creates a UTF-8 BOM, CRLF rows, fixed columns, and empty missing cells", () => {
    const csv = createCsv(
      ["Name", "Message"],
      [
        ["Sample Guest", "Hello"],
        ["Second Guest"],
      ],
    );

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toBe(
      '\uFEFF"Name","Message"\r\n"Sample Guest","Hello"\r\n"Second Guest",""\r\n',
    );
  });

  it("keeps protected exports bounded, human-readable, and free of technical fields", () => {
    const root = process.cwd();
    const exportSource = readFileSync(
      join(root, "src", "lib", "csv", "export.ts"),
      "utf8",
    );
    const routeSource = readFileSync(
      join(root, "src", "app", "admin", "exports", "[type]", "route.ts"),
      "utf8",
    );

    expect(exportSource).toContain("MAXIMUM_EXPORT_ROWS = 10_000");
    expect(exportSource).toContain("EXPORT_PAGE_SIZE = 1_000");
    expect(exportSource).not.toMatch(/select\([^)]*(?:session_id|destination_url|\bid\b)/s);
    expect(routeSource).toContain("getAdminAccess");
    expect(routeSource).toContain("createServerSupabaseClient");
    expect(routeSource).not.toContain("createServiceRoleSupabaseClient");
    expect(routeSource).toContain('"Content-Disposition"');
    expect(routeSource).toContain('"X-Content-Type-Options"');
  });
});

