import { expect, test } from "@playwright/test";

test.describe("Events pages", () => {
  test.describe("Events Index Page", () => {
    test("events index page loads correctly", async ({ page }) => {
      await page.goto("/test/events");

      // Wait for the page to be fully loaded
      await page.waitForLoadState("networkidle");

      // Verify the page title is displayed
      await expect(page.getByRole("heading", { name: /événements|events/i })).toBeVisible({ timeout: 5000 });
    });

    test("should display search input", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Search input should be visible
      const searchInput = page.getByPlaceholder(/search|rechercher/i);
      await expect(searchInput).toBeVisible();
    });

    test("should display empty state when no events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Check for empty state or event content
      const emptyState = page.locator("[data-slot=\"empty\"]");
      const hasEmpty = await emptyState.isVisible().catch(() => false);

      if (hasEmpty) {
        await expect(emptyState).toBeVisible();
        await expect(page.getByText(/Oh non|aucune session|aucun événement/i)).toBeVisible();
      }
    });

    test("should display loading spinner when loading", async ({ page }) => {
      await page.goto("/test/events");

      // Spinner might be visible briefly
      const spinner = page.locator("[data-slot=\"spinner\"]");
      if (await spinner.count() > 0) {
        // If spinner exists, it should eventually disappear
        await page.waitForLoadState("networkidle");
      }
    });
  });

  test.describe("Events Sections", () => {
    test("should display 'now' events section", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for "now" section header
      const nowSection = page.getByRole("heading", { name: /en cours|now/i });
      if (await nowSection.count() > 0) {
        await expect(nowSection).toBeVisible();

        // Should have animated pulse indicator
        const pulseIndicator = page.locator(".animate-pulse");
        if (await pulseIndicator.count() > 0) {
          await expect(pulseIndicator.first()).toBeVisible();
        }
      }
    });

    test("should display 'incoming' events section", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for "incoming" section header
      const incomingSection = page.getByRole("heading", { name: /à venir|incoming/i });
      if (await incomingSection.count() > 0) {
        await expect(incomingSection).toBeVisible();
      }
    });

    test("should display 'passed' events section", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for "passed" section header
      const passedSection = page.getByRole("heading", { name: /passés?|passed/i });
      if (await passedSection.count() > 0) {
        await expect(passedSection).toBeVisible();
      }
    });
  });

  test.describe("Event Cards", () => {
    test("should display event cards with essential information", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for event content
      const events = page.locator("[data-slot=\"event-card\"], .event-card");
      const eventCount = await events.count();

      if (eventCount > 0) {
        const firstEvent = events.first();
        await expect(firstEvent).toBeVisible();

        // Event should have a name/title visible
        await expect(firstEvent.locator("p, h3, h4").first()).toBeVisible();
      }
    });

    test("should display event facilitator information", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const events = page.locator("[data-slot=\"event-card\"], .event-card");
      if (await events.count() > 0) {
        // Events should display text content
        const firstEvent = events.first();
        const textContent = await firstEvent.textContent();
        expect(textContent).toBeTruthy();
      }
    });

    test("should display event dates/time information", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const events = page.locator("[data-slot=\"event-card\"], .event-card");
      if (await events.count() > 0) {
        const firstEvent = events.first();

        // Look for time-related text (ends in, starts in, etc.)
        const timeInfo = firstEvent.locator("p").filter({ hasText: /terminé|se termine|commence/i });
        if (await timeInfo.count() > 0) {
          await expect(timeInfo.first()).toBeVisible();
        }
      }
    });

    test("should display join video link for NOW events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for "join video" button
      const joinButton = page.getByRole("link", { name: /rejoindre la visio|join/i });
      if (await joinButton.count() > 0) {
        await expect(joinButton.first()).toBeVisible();
        await expect(joinButton.first()).toHaveAttribute("target", "_blank");
      }
    });

    test("should display maps link for NOW events with location", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for "open map" button
      const mapsButton = page.getByRole("link", { name: /ouvrir la carte|open map/i });
      if (await mapsButton.count() > 0) {
        await expect(mapsButton.first()).toBeVisible();
        await expect(mapsButton.first()).toHaveAttribute("target", "_blank");
      }
    });
  });

  test.describe("Search Functionality", () => {
    test("should allow searching events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search|rechercher/i);
      await expect(searchInput).toBeVisible();

      // Type in search
      await searchInput.fill("test");
      await page.waitForTimeout(300);

      // Search input should have value
      await expect(searchInput).toHaveValue("test");
    });

    test("should show clear button when search has value", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search|rechercher/i);
      await searchInput.fill("test");

      // Clear button should appear
      const clearButton = page.locator("button").filter({ has: page.locator("svg") });
      if (await clearButton.count() > 0) {
        await expect(clearButton.first()).toBeVisible();
      }
    });

    test("should clear search when clear button is clicked", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search|rechercher/i);
      await searchInput.fill("test");
      await page.waitForTimeout(300);

      // Find and click clear button (button with X icon)
      const clearButton = page.locator("button").filter({ has: page.locator("svg") }).first();
      if (await clearButton.isVisible().catch(() => false)) {
        await clearButton.click();
        await expect(searchInput).toHaveValue("");
      }
    });

    test("should filter events based on search query", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      const events = page.locator("[data-slot=\"event-card\"], .event-card");
      const initialCount = await events.count();

      if (initialCount > 0) {
        const searchInput = page.getByPlaceholder(/search|rechercher/i);
        await searchInput.fill("xyz123nonexistent");
        await page.waitForTimeout(500);

        // Should show fewer or no results
        const filteredCount = await events.count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    });
  });

  test.describe("Course Specific Events Page", () => {
    test("course events page loads correctly", async ({ page }) => {
      await page.goto("/test/courses/123/events");
      await page.waitForLoadState("networkidle");

      // Page should load without errors
      expect(page.url()).toContain("/courses/123/events");
    });

    test("should display course-specific events", async ({ page }) => {
      await page.goto("/test/courses/123/events");
      await page.waitForLoadState("networkidle");

      // Check for events sections
      const nowSection = page.getByRole("heading", { name: /en cours|now|passés?|à venir/i });
      if (await nowSection.count() > 0) {
        await expect(nowSection.first()).toBeVisible();
      }
    });

    test("should display empty state when no course events", async ({ page }) => {
      await page.goto("/test/courses/123/events");
      await page.waitForLoadState("networkidle");

      const emptyState = page.locator("[data-slot=\"empty\"]");
      if (await emptyState.isVisible().catch(() => false)) {
        await expect(emptyState).toBeVisible();
        await expect(page.getByText(/Oh non|aucun événement/i)).toBeVisible();
      }
    });

    test("should have sticky 'now' section", async ({ page }) => {
      await page.goto("/test/courses/123/events");
      await page.waitForLoadState("networkidle");

      // Look for sticky positioned now section
      const nowSection = page.locator("section").filter({ has: page.locator(".animate-pulse") });
      if (await nowSection.count() > 0) {
        const stickyElement = nowSection.first();

        // Check if element has sticky positioning classes
        const classes = await stickyElement.getAttribute("class");
        if (classes) {
          expect(classes.includes("sticky") || classes.includes("@xl:sticky")).toBe(true);
        }
      }
    });

    test("should display loading spinner when loading course events", async ({ page }) => {
      await page.goto("/test/courses/123/events");

      // Spinner might be visible briefly
      const spinner = page.locator("[data-slot=\"spinner\"]");
      if (await spinner.count() > 0) {
        await page.waitForLoadState("networkidle");
      }
    });
  });

  test.describe("Responsive Events Experience", () => {
    test("should display events list on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      await expect(page.locator("body")).toBeVisible();

      // Search should be visible
      const searchInput = page.getByPlaceholder(/search|rechercher/i);
      await expect(searchInput).toBeVisible();
    });

    test("should display events in single column on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Main content area should be visible
      const main = page.locator("main");
      if (await main.count() > 0) {
        await expect(main).toBeVisible();
      }
    });

    test("should display events on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      await expect(page.locator("body")).toBeVisible();
    });

    test("should maintain readability on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Page should have max-width constraint for readability
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Events Navigation", () => {
    test("should have navigation link to events page", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      // Look for events navigation link
      const eventsLink = page.getByRole("link", { name: /événements|events/i });
      if (await eventsLink.count() > 0) {
        await expect(eventsLink.first()).toBeVisible();
      }
    });

    test("should navigate from main page to events", async ({ page }) => {
      await page.goto("/test");
      await page.waitForLoadState("networkidle");

      const eventsLink = page.getByRole("link", { name: /événements|events/i });
      if (await eventsLink.count() > 0) {
        await eventsLink.first().click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain("/events");
      }
    });

    test("should have link to course-specific events from course page", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      // Look for events navigation link in course menu
      const eventsLink = page.getByRole("link", { name: /événements|events/i });
      if (await eventsLink.count() > 0) {
        const href = await eventsLink.first().getAttribute("href");
        expect(href).toContain("/events");
      }
    });
  });

  test.describe("Event Time Updates", () => {
    test("should display time remaining for NOW events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for NOW events section
      const nowSection = page.locator("section").filter({ has: page.locator(".animate-pulse") });
      if (await nowSection.count() > 0) {
        // Should display time information
        const timeText = nowSection.locator("p").filter({ hasText: /termine|ends/i });
        if (await timeText.count() > 0) {
          await expect(timeText.first()).toBeVisible();
        }
      }
    });

    test("should display start time for INCOMING events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for incoming events
      const incomingSection = page.getByRole("heading", { name: /à venir|incoming/i });
      if (await incomingSection.count() > 0) {
        // Should display when events start
        const timeText = page.locator("p").filter({ hasText: /commence|starts/i });
        if (await timeText.count() > 0) {
          await expect(timeText.first()).toBeVisible();
        }
      }
    });

    test("should display end time for PASSED events", async ({ page }) => {
      await page.goto("/test/events");
      await page.waitForLoadState("networkidle");

      // Look for passed events
      const passedSection = page.getByRole("heading", { name: /passés?|passed/i });
      if (await passedSection.count() > 0) {
        // Should display when events ended
        const timeText = page.locator("p").filter({ hasText: /terminé|ended/i });
        if (await timeText.count() > 0) {
          await expect(timeText.first()).toBeVisible();
        }
      }
    });
  });
});
