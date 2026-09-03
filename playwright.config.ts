import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Serial execution avoids a Turbopack development-only router race when several
  // freshly opened pages begin hydration at the same instant.
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    env: {
      ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED ?? "true",
      CONTACT_INQUIRY_ENABLED: process.env.CONTACT_INQUIRY_ENABLED ?? "false",
      CONTACT_INQUIRY_VISIBLE: process.env.CONTACT_INQUIRY_VISIBLE ?? "false",
      ...(process.env.NEXT_PUBLIC_AIRBNB_URL
        ? { NEXT_PUBLIC_AIRBNB_URL: process.env.NEXT_PUBLIC_AIRBNB_URL }
        : {}),
      NEXT_PUBLIC_CARETAKER_NIDA_PHONE:
        process.env.NEXT_PUBLIC_CARETAKER_NIDA_PHONE ?? "",
      NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
      ...(process.env.NEXT_PUBLIC_FACEBOOK_URL
        ? { NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_MESSENGER_URL
        ? { NEXT_PUBLIC_MESSENGER_URL: process.env.NEXT_PUBLIC_MESSENGER_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL
        ? { NEXT_PUBLIC_GOOGLE_MAPS_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL
        ? { NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_WAZE_URL
        ? { NEXT_PUBLIC_WAZE_URL: process.env.NEXT_PUBLIC_WAZE_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_WAZE_EMBED_URL
        ? { NEXT_PUBLIC_WAZE_EMBED_URL: process.env.NEXT_PUBLIC_WAZE_EMBED_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
        ? { NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER }
        : {}),
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? baseURL,
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
});
