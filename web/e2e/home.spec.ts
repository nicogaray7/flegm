import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows hero headline and Submit CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /YouTube Leaderboard/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Submit a video/i })
    ).toBeVisible();
  });
});
