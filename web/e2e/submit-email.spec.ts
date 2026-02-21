import { test, expect } from "@playwright/test";

test.describe("Submit with email (magic link sign-in)", () => {
  test("shows sign-in screen and email form when not logged in", async ({
    page,
  }) => {
    await page.goto("/submit");
    await expect(
      page.getByRole("heading", { name: /Sign in to Flegm/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Continue with Email/i })
    ).toBeVisible();
  });

  test("submitting email shows success or error when Supabase responds", async ({
    page,
  }) => {
    test.skip(
      !!process.env.CI,
      "Supabase email flow not exercised in CI; run locally with env configured"
    );
    await page.goto("/submit");
    await page
      .getByTestId("email-sign-in-form")
      .getByPlaceholder("you@example.com")
      .fill("test@example.com");
    await page
      .getByTestId("email-sign-in-form")
      .getByRole("button", { name: /Continue with Email/i })
      .click();

    await expect(
      page.getByTestId("email-sign-in-success").or(
        page.getByTestId("email-sign-in-error")
      )
    ).toBeVisible({ timeout: 25000 });
  });
});
