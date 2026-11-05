import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app.js";

describe("Authentication smoke tests", () => {
  it("should load the Express app", () => {
    expect(app).toBeDefined();
  });

  it("should respond to the current-user route", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    // A 401 or 403 is acceptable for an unauthenticated request.
    // A 404 means the configured route may be incorrect or unmounted.
    expect(response.status).not.toBe(404);
    expect(response.status).toBeLessThan(500);
  });

  it("should respond to the refresh-token route", async () => {
    const response = await request(app).post("/api/v1/auth/refresh-token");

    expect(response.status).not.toBe(404);
    expect(response.status).toBeLessThan(500);
  });

  it("should respond to the logout route", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    expect(response.status).not.toBe(404);
    expect(response.status).toBeLessThan(500);
  });
});
