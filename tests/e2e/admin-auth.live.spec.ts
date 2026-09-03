import { expect, test } from "@playwright/test";

const adminEmail = process.env.SUPABASE_TEST_ADMIN_EMAIL;
const adminPassword = process.env.SUPABASE_TEST_ADMIN_PASSWORD;
const nonAdminEmail = process.env.SUPABASE_TEST_NON_ADMIN_EMAIL;
const nonAdminPassword = process.env.SUPABASE_TEST_NON_ADMIN_PASSWORD;
const inquiryEnabled =
  process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
const inquiryVisible =
  inquiryEnabled ||
  process.env.CONTACT_INQUIRY_VISIBLE?.trim().toLowerCase() === "true";

test("an approved non-production administrator can sign in, open the dashboard, and sign out", async ({
  page,
}) => {
  test.skip(!adminEmail || !adminPassword, "Dedicated approved administrator credentials were not supplied.");

  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(adminEmail!);
  await page.getByLabel("Password").fill(adminPassword!);
  await page.getByRole("button", { name: "Sign in securely" }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Analytics dashboard" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Summary metrics" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Dashboard date presets" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Recent activity" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "CSV exports" })).toBeVisible();

  const inquiryLink = page.getByRole("link", { name: "Inquiries", exact: true });
  if (inquiryVisible) {
    await inquiryLink.click();
    await expect(page).toHaveURL(/\/admin\/inquiries$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Website inquiries" }),
    ).toBeVisible();
  } else {
    await expect(inquiryLink).toHaveCount(0);
    await expect(page.getByText("New inquiries", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Recent inquiries", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Export Inquiries" })).toHaveCount(0);

    const hiddenPage = await page.goto("/admin/inquiries");
    expect(hiddenPage?.status()).toBe(404);
    await page.goto("/admin/dashboard");
  }

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login\?notice=signed-out$/);

  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("an authenticated but unapproved non-production account is denied", async ({ page }) => {
  test.skip(
    !nonAdminEmail || !nonAdminPassword,
    "Dedicated unapproved-account credentials were not supplied.",
  );

  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(nonAdminEmail!);
  await page.getByLabel("Password").fill(nonAdminPassword!);
  await page.getByRole("button", { name: "Sign in securely" }).click();

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByText("Unable to sign in with those details.", { exact: true })).toBeVisible();
  await expect(page.getByText(/user|profile|row level|credential is valid/i)).toHaveCount(0);
});
