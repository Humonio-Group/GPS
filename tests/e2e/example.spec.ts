import { expect, test } from "@playwright/test";

test("dynamic alias page loads correctly", async ({ page }) => {
  // Navigate to any alias page (using 'test' as example)
  await page.goto("/test");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Verify the empty state message is displayed
  await expect(page.getByText("Oups...")).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("Pas encore développé...")).toBeVisible({ timeout: 5000 });
});

test("navigation works", async ({ page }) => {
  await page.goto("/test");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Verify the page loaded successfully
  await expect(page.getByText("Oups...")).toBeVisible({ timeout: 5000 });
});
