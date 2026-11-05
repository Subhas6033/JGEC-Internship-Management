// Client/tests/e2e/auth.e2e.spec.js

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:5173";

// Update these paths to match your React router.
const ROUTES = {
  login: "/auth/login",
  signup: "/auth/signup",
  dashboard: "/students/dashboard",
};

// Use a dedicated test student created in your test database.
const TEST_EMAIL = process.env.E2E_STUDENT_EMAIL;
const TEST_PASSWORD = process.env.E2E_STUDENT_PASSWORD;

test.describe("JGEC Authentication E2E Tests", () => {
  test("should display the login page", async ({ page }) => {
    await page.goto(`${BASE_URL}${ROUTES.login}`);

    await expect(page).toHaveURL(
      new RegExp(`${ROUTES.login.replace("/", "\\/")}`),
    );

    await expect(page.getByLabel(/email/i)).toBeVisible();

    await expect(page.getByLabel(/password/i)).toBeVisible();

    await expect(
      page.getByRole("button", { name: /login|sign in/i }),
    ).toBeVisible();
  });

  test("should reject login with invalid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}${ROUTES.login}`);

    await page.getByLabel(/email/i).fill("invalid-user@example.com");
    await page.getByLabel(/password/i).fill("WrongPassword123!");

    await page.getByRole("button", { name: /login|sign in/i }).click();

    // Adapt this assertion to your application's error message.
    await expect(
      page.getByText(/invalid|incorrect|failed|unauthorized/i).first(),
    ).toBeVisible();

    // Invalid credentials must not open the student dashboard.
    await expect(page).not.toHaveURL(
      new RegExp(ROUTES.dashboard.replace("/", "\\/")),
    );
  });

  test("should log in with valid student credentials", async ({ page }) => {
    test.skip(
      !TEST_EMAIL || !TEST_PASSWORD,
      "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD to run this test.",
    );

    await page.goto(`${BASE_URL}${ROUTES.login}`);

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);

    await page.getByRole("button", { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(
      new RegExp(ROUTES.dashboard.replace("/", "\\/")),
      { timeout: 15_000 },
    );

    // Confirm the authenticated page has rendered.
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("should block access to the student dashboard when logged out", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}${ROUTES.dashboard}`);

    // The application should redirect unauthenticated users to login,
    // or display an explicit access-denied page.
    await expect
      .poll(
        async () => ({
          url: page.url(),
          body: await page.locator("body").innerText(),
        }),
        { timeout: 10_000 },
      )
      .toSatisfy(({ url, body }) => {
        const redirectedToLogin = url.includes(ROUTES.login);
        const deniedAccess =
          /unauthorized|access denied|please log in|please login/i.test(body);

        return redirectedToLogin || deniedAccess;
      });
  });

  test("should preserve the authenticated session after a page reload", async ({
    page,
  }) => {
    test.skip(
      !TEST_EMAIL || !TEST_PASSWORD,
      "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD to run this test.",
    );

    await page.goto(`${BASE_URL}${ROUTES.login}`);

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);

    await page.getByRole("button", { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(
      new RegExp(ROUTES.dashboard.replace("/", "\\/")),
      { timeout: 15_000 },
    );

    await page.reload();

    // The frontend should restore authentication, typically through
    // its refresh-token endpoint and auth-state bootstrap.
    await expect(page).toHaveURL(
      new RegExp(ROUTES.dashboard.replace("/", "\\/")),
      { timeout: 15_000 },
    );
  });

  test("should log out and prevent subsequent dashboard access", async ({
    page,
  }) => {
    test.skip(
      !TEST_EMAIL || !TEST_PASSWORD,
      "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD to run this test.",
    );

    await page.goto(`${BASE_URL}${ROUTES.login}`);

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);

    await page.getByRole("button", { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(
      new RegExp(ROUTES.dashboard.replace("/", "\\/")),
      { timeout: 15_000 },
    );

    // Update the accessible name to match your logout button/menu item.
    await page
      .getByRole("button", { name: /logout|log out|sign out/i })
      .click();

    await expect(page).toHaveURL(new RegExp(ROUTES.login.replace("/", "\\/")), {
      timeout: 15_000,
    });

    // Verify that navigating directly to a protected page does not
    // restore the logged-out session.
    await page.goto(`${BASE_URL}${ROUTES.dashboard}`);

    await expect(page).toHaveURL(new RegExp(ROUTES.login.replace("/", "\\/")), {
      timeout: 10_000,
    });
  });
});
