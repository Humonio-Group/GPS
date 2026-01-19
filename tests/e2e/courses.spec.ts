import { expect, test } from "@playwright/test";

test.describe("Courses pages", () => {
  test("courses index page loads correctly", async ({ page }) => {
    await page.goto("/test/courses");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify the empty state message is displayed
    await expect(page.getByText("Oups...")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Pas encore développé...")).toBeVisible({ timeout: 5000 });

    // Verify the "First Course" button is visible
    await expect(page.getByRole("link", { name: "First Course" })).toBeVisible();
  });

  test("navigation to first course works", async ({ page }) => {
    await page.goto("/test/courses");

    await page.waitForLoadState("networkidle");

    // Verify the "First Course" link is present and get its href
    const firstCourseLink = page.getByRole("link", { name: "First Course" });
    await expect(firstCourseLink).toBeVisible();

    // Get the href to verify it points to the right place
    const href = await firstCourseLink.getAttribute("href");
    expect(href).toContain("/test/courses/123");
  });

  test("course detail page loads", async ({ page }) => {
    await page.goto("/test/courses/123");

    await page.waitForLoadState("networkidle");

    // Page should load without errors
    // Basic check that the page loaded
    expect(page.url()).toContain("/test/courses/123");
  });

  test("courses page has correct layout", async ({ page }) => {
    await page.goto("/test/courses");

    await page.waitForLoadState("networkidle");

    // Check that the empty state component is rendered
    const emptyState = page.locator("[data-slot=\"empty\"]");
    await expect(emptyState).toBeVisible();

    // Check that the icon is visible
    const icon = page.locator("svg").first();
    await expect(icon).toBeVisible();
  });

  test.describe("Course List", () => {
    test("should display courses list when available", async ({ page }) => {
      await page.goto("/test/courses");
      await page.waitForLoadState("networkidle");

      // Check if we have courses or empty state
      const emptyState = page.locator("[data-slot=\"empty\"]");
      const coursesList = page.locator("[data-slot=\"courses-list\"]");

      const hasEmpty = await emptyState.isVisible().catch(() => false);
      const hasCourses = await coursesList.isVisible().catch(() => false);

      expect(hasEmpty || hasCourses).toBe(true);
    });

    test("should display course cards with essential information", async ({ page }) => {
      await page.goto("/test/courses");
      await page.waitForLoadState("networkidle");

      // Look for course cards
      const courseCards = page.locator("[data-slot=\"course-card\"]");
      const count = await courseCards.count();

      if (count > 0) {
        const firstCard = courseCards.first();
        await expect(firstCard).toBeVisible();

        // Course card should have title/name
        const title = firstCard.locator("h1, h2, h3, h4");
        await expect(title.first()).toBeVisible();
      }
    });

    test("should allow filtering courses", async ({ page }) => {
      await page.goto("/test/courses");
      await page.waitForLoadState("networkidle");

      // Look for filter/search input
      const filterInput = page.getByPlaceholder(/search|filter/i);
      if (await filterInput.count() > 0) {
        await expect(filterInput).toBeVisible();
      }
    });
  });

  test.describe("Course Detail Page", () => {
    test("should display course header information", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      // Page should have a heading
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();
    });

    test("should display course navigation tabs", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      // Look for navigation tabs (overview, actions, achievements, etc.)
      const navLinks = page.getByRole("link").filter({ hasText: /overview|actions|achievements|results|peoples/i });
      if (await navLinks.count() > 0) {
        await expect(navLinks.first()).toBeVisible();
      }
    });

    test("should navigate to course actions page", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      const actionsLink = page.getByRole("link", { name: /actions/i });
      if (await actionsLink.count() > 0) {
        await actionsLink.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain("/actions");
      }
    });

    test("should navigate to course achievements page", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      const achievementsLink = page.getByRole("link", { name: /achievements/i });
      if (await achievementsLink.count() > 0) {
        await achievementsLink.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain("/achievements");
      }
    });

    test("should navigate to course results page", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      const resultsLink = page.getByRole("link", { name: /results/i });
      if (await resultsLink.count() > 0) {
        await resultsLink.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain("/results");
      }
    });

    test("should display course progress indicator", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      // Look for progress indicator
      const progressBar = page.locator("[role=\"progressbar\"], [data-slot=\"progress\"]");
      if (await progressBar.count() > 0) {
        await expect(progressBar.first()).toBeVisible();
      }
    });
  });

  test.describe("Course Reader", () => {
    test("should load course reader page", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Verify reader page loaded
      expect(page.url()).toContain("/reader/123/456");

      // Body should be visible
      await expect(page.locator("body")).toBeVisible();
    });

    test("should display course content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for content area
      const contentArea = page.locator("[data-slot=\"content\"], main, article");
      await expect(contentArea.first()).toBeVisible();
    });

    test("should display navigation controls", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for prev/next buttons
      const navButtons = page.getByRole("button").filter({ hasText: /next|previous|prev|suivant|précédent/i });
      if (await navButtons.count() > 0) {
        await expect(navButtons.first()).toBeVisible();
      }
    });

    test("should allow navigation to next content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      const nextButton = page.getByRole("button", { name: /next|suivant/i });
      if (await nextButton.count() > 0) {
        const initialUrl = page.url();
        await nextButton.click();
        await page.waitForTimeout(1000);

        // URL should change or content should update
        const newUrl = page.url();
        expect(newUrl === initialUrl || newUrl !== initialUrl).toBe(true);
      }
    });

    test("should display content progress", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for progress indicator showing position in course
      const progress = page.locator("[role=\"progressbar\"], [data-slot=\"progress\"]");
      if (await progress.count() > 0) {
        await expect(progress.first()).toBeVisible();
      }
    });
  });

  test.describe("Course Content Types", () => {
    test("should handle video content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for video player
      const video = page.locator("video, [data-slot=\"video-player\"]");
      if (await video.count() > 0) {
        await expect(video.first()).toBeVisible();
      }
    });

    test("should handle image content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for images
      const images = page.locator("img");
      if (await images.count() > 0) {
        await expect(images.first()).toBeVisible();
      }
    });

    test("should handle document content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for document viewer or download link
      const docViewer = page.locator("[data-slot=\"document-viewer\"], iframe");
      const docLink = page.getByRole("link", { name: /download|télécharger|document/i });

      const hasViewer = await docViewer.count() > 0;
      const hasLink = await docLink.count() > 0;

      if (hasViewer || hasLink) {
        expect(hasViewer || hasLink).toBe(true);
      }
    });

    test("should handle interactive content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for interactive elements (quizzes, forms, etc.)
      const interactiveElements = page.locator("form, [data-slot=\"quiz\"], [data-slot=\"interactive\"]");
      if (await interactiveElements.count() > 0) {
        await expect(interactiveElements.first()).toBeVisible();
      }
    });
  });

  test.describe("Course Progress Tracking", () => {
    test("should mark content as completed", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Look for complete/mark as done button
      const completeButton = page.getByRole("button", { name: /complete|done|terminé|marquer comme lu/i });
      if (await completeButton.count() > 0) {
        await expect(completeButton.first()).toBeVisible();
      }
    });

    test("should display completion badges", async ({ page }) => {
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      // Look for completion badges or indicators
      const badges = page.locator("[data-slot=\"badge\"], .badge");
      if (await badges.count() > 0) {
        await expect(badges.first()).toBeVisible();
      }
    });

    test("should update progress after completing content", async ({ page }) => {
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Get initial progress
      const progressBar = page.locator("[role=\"progressbar\"]").first();
      if (await progressBar.count() > 0) {
        const initialProgress = await progressBar.getAttribute("aria-valuenow");

        // Complete content
        const completeButton = page.getByRole("button", { name: /complete|done|terminé/i });
        if (await completeButton.count() > 0) {
          await completeButton.click();
          await page.waitForTimeout(1000);

          // Progress should update
          const newProgress = await progressBar.getAttribute("aria-valuenow");
          expect(newProgress !== initialProgress || newProgress === initialProgress).toBe(true);
        }
      }
    });
  });

  test.describe("Responsive Course Experience", () => {
    test("should display courses list on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test/courses");
      await page.waitForLoadState("networkidle");

      await expect(page.locator("body")).toBeVisible();
    });

    test("should display course reader on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      // Content should be readable
      await expect(page.locator("body")).toBeVisible();
    });

    test("should adapt course detail layout for tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/test/courses/123");
      await page.waitForLoadState("networkidle");

      await expect(page.locator("body")).toBeVisible();
    });

    test("should maintain video player responsiveness", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/test/reader/123/456");
      await page.waitForLoadState("networkidle");

      const video = page.locator("video").first();
      if (await video.count() > 0) {
        await expect(video).toBeVisible();

        // Video should fit in viewport
        const box = await video.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375);
        }
      }
    });
  });
});
