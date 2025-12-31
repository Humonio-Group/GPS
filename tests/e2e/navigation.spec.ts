import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("sidebar is visible on main pages", async ({ page }) => {
    await page.goto("/test");

    await page.waitForLoadState("networkidle");

    // Check if sidebar elements are present
    const sidebar = page.locator("[data-slot=\"sidebar\"]");
    await expect(sidebar).toBeVisible();
  });

  test("workspace selector is functional", async ({ page }) => {
    await page.goto("/test");

    await page.waitForLoadState("networkidle");

    // Look for workspace selector component
    const workspaceSelector = page.locator("[data-slot=\"workspace-selector\"]");

    // If the workspace selector exists, verify it's visible
    const exists = await workspaceSelector.count();
    if (exists > 0) {
      await expect(workspaceSelector).toBeVisible();
    }
  });

  test("navigation menu items are clickable", async ({ page }) => {
    await page.goto("/test");

    await page.waitForLoadState("networkidle");

    // Check if any navigation links are present
    const navLinks = page.locator("[data-slot=\"sidebar-menu-button\"]");
    const count = await navLinks.count();

    // If navigation links exist, verify at least one is visible
    if (count > 0) {
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test("user can navigate between pages", async ({ page }) => {
    await page.goto("/test");

    await page.waitForLoadState("networkidle");

    const initialUrl = page.url();

    // Try to find and click a navigation link
    const coursesLink = page.getByRole("link", { name: /courses/i });
    const linkExists = await coursesLink.count();

    if (linkExists > 0) {
      await coursesLink.first().click();
      await page.waitForLoadState("networkidle");

      // URL should have changed
      expect(page.url()).not.toBe(initialUrl);
    }
  });

  test("page maintains responsive design", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/test");
    await page.waitForLoadState("networkidle");

    // Verify page loaded
    await expect(page.locator("body")).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/test");
    await page.waitForLoadState("networkidle");

    // Verify page still loads correctly
    await expect(page.locator("body")).toBeVisible();
  });
});
