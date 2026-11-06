import request from "supertest";
import { describe, it, expect } from "@jest/globals";

// Import the app, not the file that starts listening on a port.
import { app } from "../../Server/app.js";

describe("Authentication API integration tests", () => {
  it("should respond to the login endpoint", async () => {
    const response = await request(app).post("/api/v1/students/login").send({});

    // Empty credentials should not result in a successful login.
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("should reject refresh when no refresh cookie is provided", async () => {
    const response = await request(app).post("/api/v1/auth/refresh-token");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("should reject an unauthenticated request to the current-user endpoint", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("should respond to the logout endpoint without crashing", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    // Depending logout policy, an unauthenticated logout
    // may return 200 or 204, so this checks only that the server
    // returns a valid HTTP response.
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});
