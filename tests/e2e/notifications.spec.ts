import { test, expect } from "@playwright/test";

test.describe("Notifications Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the notifications API to return empty by default
    await page.route("**/v2/notifications**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          included: [],
          meta: { total: 0 },
        }),
      });
    });

    // Navigate to the notifications page
    await page.goto("/test-workspace/notifications");

    // Wait for the page to be ready
    await page.waitForLoadState("networkidle");
  });

  test.describe("Notifications Page Layout", () => {
    test("should load notifications page successfully", async ({ page }) => {
      // Just verify the page loads without errors
      await expect(page).toHaveURL(/.*notifications/);
    });

    test("should display page body", async ({ page }) => {
      // The page should render even if empty
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Notifications List", () => {
    test("should display notifications when available", async ({ page }) => {
      // Mock API response with notifications
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              {
                id: "1",
                type: "notifications",
                attributes: {
                  eventName: "new_badge",
                  title: "Badge Awarded",
                  from: {
                    email: "system@example.com",
                    name: "System",
                    picture: { thumbnail: "https://example.com/avatar.jpg" },
                  },
                  inAppData: {
                    id: 101,
                    journeyId: 1,
                    name: "Expert Badge",
                    description: "Achievement unlocked",
                    picture: "https://example.com/badge.png",
                  },
                  message: {
                    html: "<p>Congratulations!</p>",
                    text: "Congratulations!",
                  },
                  dates: {
                    creation: "2024-01-20T10:00:00Z",
                    view: null,
                    read: null,
                  },
                },
                relationships: {
                  relatedEntity: { data: [{ id: "101", type: "badges" }] },
                  recipientJourney: { data: [{ id: "1", type: "journeys" }] },
                },
              },
            ],
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: {
                  displayName: "Session 2024",
                  picture: { thumbnail: "https://example.com/course.jpg" },
                },
                relationships: {
                  program: { data: [{ id: "100", type: "programs" }] },
                },
              },
              {
                id: "100",
                type: "programs",
                attributes: {
                  name: "Test Course",
                  picture: { thumbnail: "https://example.com/program.jpg" },
                },
              },
            ],
            meta: { total: 1 },
          }),
        });
      });

      await page.reload();

      // Wait for notifications to load
      await page.waitForTimeout(1000);

      // Check if notification items are visible
      const notificationItems = page.locator("article, [data-testid='notification-item']");
      await expect(notificationItems.first()).toBeVisible({ timeout: 5000 });
    });

    test("should display empty state when no notifications", async ({ page }) => {
      // Mock empty API response
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            included: [],
            meta: { total: 0 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      // Look for empty state message
      const emptyState = page.locator("text=/no notifications|aucune notification|empty/i");
      await expect(emptyState).toBeVisible({ timeout: 5000 });
    });

    test("should display loading state while fetching", async ({ page }) => {
      // Mock slow API response
      await page.route("**/v2/notifications**", async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            included: [],
            meta: { total: 0 },
          }),
        });
      });

      await page.reload();

      // Check for loading indicator (spinner, skeleton, etc.)
      const loadingIndicator = page.locator("[data-testid='loading'], .loading, svg.animate-spin");
      await expect(loadingIndicator.first()).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe("Notification Items", () => {
    test.beforeEach(async ({ page }) => {
      // Mock API with sample notifications
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              {
                id: "1",
                type: "notifications",
                attributes: {
                  eventName: "new_badge",
                  title: "Test Badge Notification",
                  from: {
                    email: "system@example.com",
                    name: "System",
                    picture: null,
                  },
                  inAppData: {
                    id: 101,
                    journeyId: 1,
                    name: "Test Badge",
                    description: "Test Description",
                    picture: "https://example.com/badge.png",
                  },
                  message: {
                    html: "<p>Test message</p>",
                    text: "Test message",
                  },
                  dates: {
                    creation: "2024-01-20T10:00:00Z",
                    view: null,
                    read: null,
                  },
                },
                relationships: {
                  relatedEntity: { data: [{ id: "101", type: "badges" }] },
                  recipientJourney: { data: [{ id: "1", type: "journeys" }] },
                },
              },
              {
                id: "2",
                type: "notifications",
                attributes: {
                  eventName: "content.activated",
                  title: "New Content Available",
                  from: {
                    email: "instructor@example.com",
                    name: "Instructor",
                    picture: { thumbnail: "https://example.com/instructor.jpg" },
                  },
                  inAppData: {
                    activityUserId: 501,
                    journeyId: 2,
                  },
                  message: {
                    html: "<p>New content</p>",
                    text: "New content",
                  },
                  dates: {
                    creation: "2024-01-19T14:30:00Z",
                    view: "2024-01-19T15:00:00Z",
                    read: "2024-01-19T15:00:00Z",
                  },
                },
                relationships: {
                  relatedEntity: { data: [{ id: "501", type: "activityUsers" }] },
                  recipientJourney: { data: [{ id: "2", type: "journeys" }] },
                },
              },
            ],
            included: [
              {
                id: "501",
                type: "activityUsers",
                attributes: {
                  name: "Test Content",
                  design: {
                    picture: { thumbnail: "https://example.com/content.jpg" },
                  },
                },
              },
              {
                id: "1",
                type: "journeys",
                attributes: {
                  displayName: "Session 1",
                  picture: { thumbnail: "https://example.com/course1.jpg" },
                },
                relationships: {
                  program: { data: [{ id: "100", type: "programs" }] },
                },
              },
              {
                id: "2",
                type: "journeys",
                attributes: {
                  displayName: "Session 2",
                  picture: { thumbnail: "https://example.com/course2.jpg" },
                },
                relationships: {
                  program: { data: [{ id: "200", type: "programs" }] },
                },
              },
              {
                id: "100",
                type: "programs",
                attributes: {
                  name: "Course 1",
                  picture: { thumbnail: "https://example.com/program1.jpg" },
                },
              },
              {
                id: "200",
                type: "programs",
                attributes: {
                  name: "Course 2",
                  picture: { thumbnail: "https://example.com/program2.jpg" },
                },
              },
            ],
            meta: { total: 2 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);
    });

    test("should display notification title", async ({ page }) => {
      await expect(page.locator("text=Test Badge Notification").first()).toBeVisible();
    });

    test("should display course information", async ({ page }) => {
      await expect(page.locator("text=Course 1")).toBeVisible();
    });

    test("should show unread indicator for unread notifications", async ({ page }) => {
      // The first notification is unread (no read date)
      const unreadIndicator = page.locator(".bg-primary").filter({ has: page.locator(".size-2") }).first();
      await expect(unreadIndicator).toBeVisible();
    });

    test("should be clickable", async ({ page }) => {
      const notificationItem = page.locator("article").first();
      await expect(notificationItem).toHaveClass(/cursor-pointer/);
    });
  });

  test.describe("Notification Interactions", () => {
    test("should navigate when clicking badge notification", async ({ page }) => {
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{
              id: "1",
              type: "notifications",
              attributes: {
                eventName: "new_badge",
                title: "Badge Notification",
                from: { email: "system@example.com", name: "System", picture: null },
                inAppData: {
                  id: 101,
                  journeyId: 1,
                  name: "Test Badge",
                  description: "Test",
                  picture: "https://example.com/badge.png",
                },
                message: { html: "<p>Test</p>", text: "Test" },
                dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
              },
              relationships: {
                relatedEntity: { data: [{ id: "101", type: "badges" }] },
                recipientJourney: { data: [{ id: "1", type: "journeys" }] },
              },
            }],
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "100", type: "programs" }] } },
              },
              {
                id: "100",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 1 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const notificationItem = page.locator("article").first();
      await notificationItem.click();

      // Should navigate to course results page
      await expect(page).toHaveURL(/.*courses\/1\/results/, { timeout: 5000 });
    });

    test("should navigate when clicking content notification", async ({ page }) => {
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{
              id: "2",
              type: "notifications",
              attributes: {
                eventName: "content.activated",
                title: "Content Notification",
                from: { email: "instructor@example.com", name: "Instructor", picture: null },
                inAppData: { activityUserId: 501, journeyId: 2 },
                message: { html: "<p>Test</p>", text: "Test" },
                dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
              },
              relationships: {
                relatedEntity: { data: [{ id: "501", type: "activityUsers" }] },
                recipientJourney: { data: [{ id: "2", type: "journeys" }] },
              },
            }],
            included: [
              {
                id: "501",
                type: "activityUsers",
                attributes: {
                  name: "Test Content",
                  design: { picture: { thumbnail: "https://example.com/content.jpg" } },
                },
              },
              {
                id: "2",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "200", type: "programs" }] } },
              },
              {
                id: "200",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 1 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const notificationItem = page.locator("article").first();
      await notificationItem.click();

      // Should navigate to content reader page
      await expect(page).toHaveURL(/.*reader\/2\/501/, { timeout: 5000 });
    });
  });

  test.describe("Pagination", () => {
    test("should show load more button when more notifications available", async ({ page }) => {
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: Array(25).fill(null).map((_, i) => ({
              id: `${i + 1}`,
              type: "notifications",
              attributes: {
                eventName: "new_badge",
                title: `Notification ${i + 1}`,
                from: { email: "system@example.com", name: "System", picture: null },
                inAppData: {
                  id: 101 + i,
                  journeyId: 1,
                  name: `Badge ${i + 1}`,
                  description: "Test",
                  picture: null,
                },
                message: { html: "<p>Test</p>", text: "Test" },
                dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
              },
              relationships: {
                relatedEntity: { data: [{ id: `${101 + i}`, type: "badges" }] },
                recipientJourney: { data: [{ id: "1", type: "journeys" }] },
              },
            })),
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "100", type: "programs" }] } },
              },
              {
                id: "100",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 50 }, // More than 25 available
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      // Look for load more button
      const loadMoreButton = page.locator("button:has-text(/load more|voir plus|charger plus/i)");
      await expect(loadMoreButton).toBeVisible({ timeout: 5000 });
    });

    test("should not show load more button when all notifications loaded", async ({ page }) => {
      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              {
                id: "1",
                type: "notifications",
                attributes: {
                  eventName: "new_badge",
                  title: "Test",
                  from: { email: "system@example.com", name: "System", picture: null },
                  inAppData: {
                    id: 101,
                    journeyId: 1,
                    name: "Badge",
                    description: "Test",
                    picture: null,
                  },
                  message: { html: "<p>Test</p>", text: "Test" },
                  dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
                },
                relationships: {
                  relatedEntity: { data: [{ id: "101", type: "badges" }] },
                  recipientJourney: { data: [{ id: "1", type: "journeys" }] },
                },
              },
            ],
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "100", type: "programs" }] } },
              },
              {
                id: "100",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 1 }, // Only 1 notification total
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      // Load more button should not be visible
      const loadMoreButton = page.locator("button:has-text(/load more|voir plus|charger plus/i)");
      await expect(loadMoreButton).not.toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should display notifications properly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{
              id: "1",
              type: "notifications",
              attributes: {
                eventName: "new_badge",
                title: "Test Notification",
                from: { email: "system@example.com", name: "System", picture: null },
                inAppData: {
                  id: 101,
                  journeyId: 1,
                  name: "Badge",
                  description: "Test",
                  picture: null,
                },
                message: { html: "<p>Test</p>", text: "Test" },
                dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
              },
              relationships: {
                relatedEntity: { data: [{ id: "101", type: "badges" }] },
                recipientJourney: { data: [{ id: "1", type: "journeys" }] },
              },
            }],
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "100", type: "programs" }] } },
              },
              {
                id: "100",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 1 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const notificationItem = page.locator("article").first();
      await expect(notificationItem).toBeVisible();
    });

    test("should display notifications properly on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.route("**/v2/notifications**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{
              id: "1",
              type: "notifications",
              attributes: {
                eventName: "new_badge",
                title: "Test Notification",
                from: { email: "system@example.com", name: "System", picture: null },
                inAppData: {
                  id: 101,
                  journeyId: 1,
                  name: "Badge",
                  description: "Test",
                  picture: null,
                },
                message: { html: "<p>Test</p>", text: "Test" },
                dates: { creation: "2024-01-20T10:00:00Z", view: null, read: null },
              },
              relationships: {
                relatedEntity: { data: [{ id: "101", type: "badges" }] },
                recipientJourney: { data: [{ id: "1", type: "journeys" }] },
              },
            }],
            included: [
              {
                id: "1",
                type: "journeys",
                attributes: { displayName: "Session", picture: null },
                relationships: { program: { data: [{ id: "100", type: "programs" }] } },
              },
              {
                id: "100",
                type: "programs",
                attributes: { name: "Course", picture: null },
              },
            ],
            meta: { total: 1 },
          }),
        });
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const notificationItem = page.locator("article").first();
      await expect(notificationItem).toBeVisible();
    });
  });
});
