import request from "supertest";
import { describe, it, expect, jest } from "@jest/globals";

process.env.CORS_ORIGIN ??= "http://localhost:5173";

// Mock dependencies before importing the app.
const mockUploadToCloudinary = jest.fn();

jest.unstable_mockModule("../../upload/uploadOnCloudinary.upload.js", () => ({
  uploadToCloudinary: mockUploadToCloudinary,
  removeSignatureBackground: jest.fn(),
  cloudinary: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

jest.unstable_mockModule("../../utils/nocStorage.utils.js", () => ({
  getNocPdfStream: jest.fn(),
  saveNocPdf: jest.fn(),
  deleteNocPdf: jest.fn(),
}));

// Dynamically import app only after mocks are registered.
const { app } = await import("../../app.js");

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
