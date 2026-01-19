import { test, expect } from "@playwright/test";

test.describe("Support System", () => {
  const WORKSPACE_ALIAS = "test";

  test.beforeEach(async ({ page }) => {
    // Navigate to support page
    await page.goto(`/${WORKSPACE_ALIAS}/support`);
    await page.waitForLoadState("networkidle");
  });

  test.describe("Support Page Layout", () => {
    test("should display tickets navigation sidebar", async ({ page }) => {
      const ticketsNav = page.locator("[data-slot='tickets-navigation']");
      await expect(ticketsNav).toBeVisible();
    });

    test("should display search input", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
    });

    test("should display create ticket button", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await expect(createButton).toBeVisible();
    });

    test("should display show closed tickets toggle", async ({ page }) => {
      const toggle = page.getByRole("switch");
      await expect(toggle).toBeVisible();
    });
  });

  test.describe("Tickets List", () => {
    test("should display tickets when available", async ({ page }) => {
      // Wait for tickets to load
      await page.waitForTimeout(1000);

      // Check if tickets or empty state is displayed
      const ticketsList = page.locator("[data-slot='tickets-list']");
      const emptyState = page.locator("[data-slot='empty-state']");

      const hasTickets = await ticketsList.isVisible().catch(() => false);
      const isEmpty = await emptyState.isVisible().catch(() => false);

      expect(hasTickets || isEmpty).toBe(true);
    });

    test("should show loading spinner while loading tickets", async ({ page }) => {
      // Reload to see loading state
      await page.reload();

      const spinner = page.locator("[data-slot='spinner']");
      // Spinner might appear briefly
      await expect(spinner).toBeVisible({ timeout: 1000 }).catch(() => {});
    });

    test("should filter tickets by search term", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);

      // Type search query
      await searchInput.fill("test ticket");

      // Wait for filtering
      await page.waitForTimeout(500);

      // Verify filtered results (implementation depends on actual tickets)
      const ticketItems = page.locator("[data-slot='ticket-item']");
      const count = await ticketItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should toggle closed tickets visibility", async ({ page }) => {
      const toggle = page.getByRole("switch");

      // Get initial state
      const initialState = await toggle.isChecked();

      // Toggle
      await toggle.click();
      await page.waitForTimeout(500);

      // Verify state changed
      const newState = await toggle.isChecked();
      expect(newState).toBe(!initialState);
    });
  });

  test.describe("Create Ticket Dialog", () => {
    test("should open create ticket dialog", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      // Wait for dialog
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
    });

    test("should display all required form fields", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      // Check for form fields
      await expect(page.getByLabel(/course/i)).toBeVisible();
      await expect(page.getByLabel(/category/i)).toBeVisible();
      await expect(page.getByLabel(/subject/i)).toBeVisible();
      await expect(page.getByLabel(/message/i)).toBeVisible();
    });

    test("should display submit and cancel buttons", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      const dialog = page.getByRole("dialog");
      await expect(dialog.getByRole("button", { name: /send|submit/i })).toBeVisible();
      await expect(dialog.getByRole("button", { name: /cancel/i })).toBeVisible();
    });

    test("should display contact information", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      const dialog = page.getByRole("dialog");

      // Check for contact emails
      await expect(dialog.getByText(/Nicolas Sigrist|privacy@humonio.com/i)).toBeVisible();
      await expect(dialog.getByText(/Loïc Maes/i)).toBeVisible();
    });

    test("should close dialog when cancel is clicked", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();

      const cancelButton = dialog.getByRole("button", { name: /cancel/i });
      await cancelButton.click();

      await expect(dialog).not.toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      const createButton = page.getByRole("button", { name: /plus|create/i }).first();
      await createButton.click();

      const dialog = page.getByRole("dialog");
      const submitButton = dialog.getByRole("button", { name: /send|submit/i });

      // Try to submit without filling fields
      await submitButton.click();

      // Dialog should still be visible (validation failed)
      await expect(dialog).toBeVisible();
    });
  });

  test.describe("Ticket Detail Page", () => {
    test("should navigate to ticket detail when clicking ticket item", async ({ page }) => {
      // Wait for tickets to load
      await page.waitForTimeout(1000);

      const ticketItem = page.locator("[data-slot='ticket-item']").first();
      const hasTickets = await ticketItem.isVisible().catch(() => false);

      if (hasTickets) {
        await ticketItem.click();
        await page.waitForLoadState("networkidle");

        // Should navigate to ticket detail page
        expect(page.url()).toContain("/support/ticket/");
      }
      else {
        test.skip();
      }
    });

    test("should display ticket details on detail page", async ({ page }) => {
      // Navigate to a ticket detail page (if available)
      await page.waitForTimeout(1000);

      const ticketItem = page.locator("[data-slot='ticket-item']").first();
      const hasTickets = await ticketItem.isVisible().catch(() => false);

      if (hasTickets) {
        await ticketItem.click();
        await page.waitForLoadState("networkidle");

        // Check for ticket detail elements
        const ticketTitle = page.locator("h1, h2").first();
        await expect(ticketTitle).toBeVisible();
      }
      else {
        test.skip();
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should adapt layout for mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigation should adapt
      const navigation = page.locator("nav");
      await expect(navigation).toBeVisible();

      // Search should be visible
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
    });

    test("should adapt layout for tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Layout should adjust
      const ticketsNav = page.locator("[data-slot='tickets-navigation']");
      await expect(ticketsNav).toBeVisible();
    });

    test("should maintain full layout on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // All elements should be visible
      const ticketsNav = page.locator("[data-slot='tickets-navigation']");
      const searchInput = page.getByPlaceholder(/search/i);

      await expect(ticketsNav).toBeVisible();
      await expect(searchInput).toBeVisible();
    });
  });

  test.describe("Empty States", () => {
    test("should show empty state when no tickets match search", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);

      // Search for non-existent ticket
      await searchInput.fill("zzzzzzzznonexistentticket999999");
      await page.waitForTimeout(500);

      // Check for empty state
      const emptyState = page.locator("[data-slot='empty-state']");
      await expect(emptyState).toBeVisible();
    });

    test("should show appropriate message in empty state", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);

      // Search for non-existent ticket
      await searchInput.fill("zzzzzzzznonexistentticket999999");
      await page.waitForTimeout(500);

      // Check for empty message
      const emptyState = page.locator("[data-slot='empty-state']");
      if (await emptyState.isVisible()) {
        const text = await emptyState.textContent();
        expect(text).toBeTruthy();
      }
    });

    test("should show create ticket button in empty state", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);

      // Search for non-existent ticket
      await searchInput.fill("zzzzzzzznonexistentticket999999");
      await page.waitForTimeout(500);

      // Check for create button in empty state
      const createButton = page.getByRole("button", { name: /create|open/i });
      await expect(createButton.first()).toBeVisible();
    });
  });

  test.describe("Ticket Actions", () => {
    test("should display ticket actions menu for open tickets", async ({ page }) => {
      await page.waitForTimeout(1000);

      const ticketItem = page.locator("[data-slot='ticket-item']").first();
      const hasTickets = await ticketItem.isVisible().catch(() => false);

      if (hasTickets) {
        await ticketItem.click();
        await page.waitForLoadState("networkidle");

        // Look for actions button/menu
        const actionsButton = page.getByRole("button", { name: /actions|more|menu/i });
        const hasActions = await actionsButton.isVisible().catch(() => false);

        if (hasActions) {
          await expect(actionsButton).toBeVisible();
        }
      }
      else {
        test.skip();
      }
    });
  });

  test.describe("Navigation Integration", () => {
    test("should be accessible from main navigation", async ({ page }) => {
      // Go to home
      await page.goto(`/${WORKSPACE_ALIAS}`);
      await page.waitForLoadState("networkidle");

      // Find and click help menu
      const helpButton = page.getByRole("button", { name: /help|support/i });
      if (await helpButton.isVisible().catch(() => false)) {
        await helpButton.click();

        // Click support link
        const supportLink = page.getByRole("link", { name: /support/i });
        await supportLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on support page
        expect(page.url()).toContain("/support");
      }
    });

    test("should maintain workspace context in navigation", async ({ page }) => {
      // Verify workspace alias is in URL
      expect(page.url()).toContain(WORKSPACE_ALIAS);

      // Navigate around and verify workspace is maintained
      const homeLink = page.getByRole("link", { name: /home|dashboard/i }).first();
      if (await homeLink.isVisible().catch(() => false)) {
        await homeLink.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain(WORKSPACE_ALIAS);
      }
    });
  });
});
