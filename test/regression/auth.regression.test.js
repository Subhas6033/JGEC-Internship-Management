import request from "supertest";
import { describe, it, expect } from "@jest/globals";

process.env.CORS_ORIGIN ??= "http://localhost:5173";

// Dynamically import app only after mocks are registered (from setup.js).
let app;
beforeAll(async () => {
  const mod = await import("../../Server/app.js");
  app = mod.app;
});

describe("Authentication regression tests", () => {
  it("should reject a malformed Bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid.token.value");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("should reject an empty Bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer ");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("should not return an access token when refresh is attempted without a cookie", async () => {
    const response = await request(app).post("/api/v1/auth/refresh-token");

    expect(response.status).toBeGreaterThanOrEqual(400);

    if (response.body?.data?.accessToken) {
      throw new Error(
        "An access token should not be issued without a valid refresh token.",
      );
    }

    if (response.body?.accessToken) {
      throw new Error(
        "An access token should not be issued without a valid refresh token.",
      );
    }
  });

  it("should not allow access to a protected endpoint without authentication", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it.todo(
    "should reject a valid token whose role does not have permission for the endpoint",
  );

  it.todo("should reject reuse of a rotated or revoked refresh token");
});
