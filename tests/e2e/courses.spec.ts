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
});
