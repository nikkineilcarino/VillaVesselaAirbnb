import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combines conditional class values", () => {
    expect(cn("base", false && "hidden", { active: true })).toBe("base active");
  });

  it("keeps the final conflicting Tailwind utility", () => {
    expect(cn("px-2 text-sm", "px-6 text-lg")).toBe("px-6 text-lg");
  });
});
