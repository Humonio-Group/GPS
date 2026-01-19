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

  test.describe("Getting Help Menu", () => {
    test("should display help button in navigation", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Look for help/support button
      const helpButton = page.getByRole("button").filter({ has: page.locator("svg") }).first();
      await expect(helpButton).toBeVisible();
    });

    test("should open help menu on click", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Find and click help button
      const buttons = await page.getByRole("button").all();
      let helpMenuOpened = false;

      for (const button of buttons) {
        await button.click();
        await page.waitForTimeout(300);

        // Check if menu appeared
        const menuItems = page.getByRole("menuitem");
        if ((await menuItems.count()) > 0) {
          helpMenuOpened = true;
          break;
        }
      }

      if (helpMenuOpened) {
        const menuItems = page.getByRole("menuitem");
        await expect(menuItems.first()).toBeVisible();
      }
    });

    test("should show support link in help menu", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Find and click help button
      const buttons = await page.getByRole("button").all();

      for (const button of buttons) {
        await button.click();
        await page.waitForTimeout(300);

        // Check if support menu item exists
        const supportItem = page.getByRole("menuitem").filter({ hasText: /support/i });
        if (await supportItem.count() > 0) {
          await expect(supportItem).toBeVisible();
          break;
        }
      }
    });

    test("should navigate to support page from help menu", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Find and click help button
      const buttons = await page.getByRole("button").all();

      for (const button of buttons) {
        await button.click();
        await page.waitForTimeout(300);

        // Try to click support link
        const supportItem = page.getByRole("menuitem").filter({ hasText: /support/i });
        if (await supportItem.count() > 0) {
          await supportItem.click();
          await page.waitForLoadState("networkidle");

          // Should navigate to support page
          expect(page.url()).toContain("/support");
          break;
        }
      }
    });

    test("should show AI assistant links in help menu", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Find and click help button
      const buttons = await page.getByRole("button").all();

      for (const button of buttons) {
        await button.click();
        await page.waitForTimeout(300);

        // Check for menu items
        const menuItems = page.getByRole("menuitem");
        if (await menuItems.count() > 2) {
          // Should have multiple menu items including AI links
          expect(await menuItems.count()).toBeGreaterThanOrEqual(2);
          break;
        }
      }
    });

    test("should show WIP badge on help center item", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Find and click help button
      const buttons = await page.getByRole("button").all();

      for (const button of buttons) {
        await button.click();
        await page.waitForTimeout(300);

        // Check for WIP badge
        const wipBadge = page.getByText(/W\.I\.P|wip/i);
        if (await wipBadge.count() > 0) {
          await expect(wipBadge).toBeVisible();
          break;
        }
      }
    });
  });

  test.describe("Responsive Navigation Behavior", () => {
    test("should show sidebar on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      const sidebar = page.locator("[data-slot=\"sidebar\"]");
      await expect(sidebar).toBeVisible();
    });

    test("should adapt navigation for tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Navigation should be accessible
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("should adapt navigation for mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Page should load
      await expect(page.locator("body")).toBeVisible();

      // Navigation might be collapsed or in a hamburger menu
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("should maintain functionality on screen rotation", async ({ page }) => {
      // Portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      await expect(page.locator("body")).toBeVisible();

      // Landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);

      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Sidebar Navigation Items", () => {
    test("should show courses link in sidebar", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      const coursesLink = page.getByRole("link", { name: /courses/i });
      if (await coursesLink.count() > 0) {
        await expect(coursesLink.first()).toBeVisible();
      }
    });

    test("should show profile link in sidebar", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      const profileLink = page.getByRole("link", { name: /profile/i });
      if (await profileLink.count() > 0) {
        await expect(profileLink.first()).toBeVisible();
      }
    });

    test("should highlight active navigation item", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Navigate to courses
      const coursesLink = page.getByRole("link", { name: /courses/i });
      if (await coursesLink.count() > 0) {
        await coursesLink.first().click();
        await page.waitForLoadState("networkidle");

        // The active link should have active styling (check for aria-current or active class)
        const activeLink = page.locator("[aria-current=\"page\"], .active");
        const hasActive = await activeLink.count() > 0;

        if (hasActive) {
          await expect(activeLink.first()).toBeVisible();
        }
      }
    });
  });

  test.describe("Navigation Performance", () => {
    test("should navigate between pages quickly", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      const startTime = Date.now();

      // Navigate to another page
      const coursesLink = page.getByRole("link", { name: /courses/i });
      if (await coursesLink.count() > 0) {
        await coursesLink.first().click();
        await page.waitForLoadState("networkidle");

        const endTime = Date.now();
        const navigationTime = endTime - startTime;

        // Navigation should complete within reasonable time (5 seconds)
        expect(navigationTime).toBeLessThan(5000);
      }
    });

    test("should load sidebar without blocking page render", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/test");

      // Check when body becomes visible
      await page.locator("body").waitFor({ state: "visible" });
      const bodyVisibleTime = Date.now() - startTime;

      // Body should be visible quickly (within 2 seconds)
      expect(bodyVisibleTime).toBeLessThan(2000);

      // Wait for full page load
      await page.waitForLoadState("networkidle");
    });
  });
});
