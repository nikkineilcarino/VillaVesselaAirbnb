import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/analytics/TrackedExternalLink", () => ({
  TrackedExternalLink: ({
    children,
    linkType,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    linkType: string;
  }) => (
    <a data-link-type={linkType} {...props}>
      {children}
    </a>
  ),
}));

import { InteractiveMaps } from "@/components/location/InteractiveMaps";

describe("location outbound analytics", () => {
  it("renders the configured Waze destination through the Waze tracking category", () => {
    const wazeUrl =
      "https://www.waze.com/ul?ll=16.1%2C120.1&navigate=yes&zoom=17";
    const html = renderToStaticMarkup(
      <InteractiveMaps
        googleMapsEmbedUrl={null}
        googleMapsUrl={null}
        wazeEmbedUrl="https://embed.waze.com/iframe?zoom=17&lat=16.1&lon=120.1&pin=1"
        wazeUrl={wazeUrl}
      />,
    );

    expect(html).toContain("Navigate with Waze");
    expect(html).toContain('data-link-type="waze"');
    expect(html).toContain(`href="${wazeUrl.replaceAll("&", "&amp;")}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("keeps tracked navigation native and does not cancel it for failed delivery", () => {
    const trackedLinkSource = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "analytics",
        "TrackedExternalLink.tsx",
      ),
      "utf8",
    );

    expect(trackedLinkSource).toContain(
      "return <a {...props} href={href} onClick={handleClick} />;",
    );
    expect(trackedLinkSource).not.toMatch(/preventDefault\s*\(/);
  });
});
