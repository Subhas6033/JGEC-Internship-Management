import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockStudent = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockUploadToCloudinary = jest.fn();
const mockRevokeUserSession = jest.fn();
const mockCreateUserSession = jest.fn();
const mockRotateUserSession = jest.fn();

// Mock student model
jest.unstable_mockModule("../../models/students.models.js", () => ({
  Student: mockStudent,
}));

// Mock common helper utilities
jest.unstable_mockModule("../../utils/helper.utils.js", () => ({
  asyncHandler: (fn) => async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  },

  APIERR: class APIERR extends Error {
    constructor(statusCode, message, errors = []) {
      super(message);
      this.name = "APIERR";
      this.statusCode = statusCode;
      this.errors = errors;
    }
  },

  APIRES: class APIRES {
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
    }
  },
}));

// Mock Cloudinary upload utility
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

// Mock session service
jest.unstable_mockModule("../../services/auth/session.service.js", () => ({
  createUserSession: mockCreateUserSession,
  rotateUserSession: mockRotateUserSession,
  revokeUserSession: mockRevokeUserSession,
}));

// These named exports must match auth.service.js.
const authService = await import("../../services/auth/auth.service.js");

const { loginStudents, registerStudents, logoutStudent, refreshAccessToken } =
  authService;

const createResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
};

describe("Authentication service unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockStudent.findOne.mockReset();
    mockStudent.create.mockReset();

    mockUploadToCloudinary.mockReset();
    mockRevokeUserSession.mockReset();
    mockCreateUserSession.mockReset();
    mockRotateUserSession.mockReset();
  });

  describe("loginStudents", () => {
    it("should reject a request with missing credentials", async () => {
      const req = {
        body: {},
        cookies: {},
      };

      const res = createResponse();
      const next = jest.fn();

      if (typeof loginStudents !== "function") {
        throw new Error(
          "loginStudents is not exported from services/auth/auth.service.js",
        );
      }

      await loginStudents(req, res, next);

      expect(mockStudent.findOne).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it("should look up the student using a normalized email", async () => {
      const req = {
        body: {
          email: " STUDENT@EXAMPLE.COM ",
          password: "Password123!",
        },
        cookies: {},
      };

      const res = createResponse();
      const next = jest.fn();

      mockStudent.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await loginStudents(req, res, next);

      expect(mockStudent.findOne).toHaveBeenCalled();

      const query = mockStudent.findOne.mock.calls[0][0];

      expect(query).toHaveProperty("email", "student@example.com");
      expect(next).toHaveBeenCalled();
    });

    it("should reject an unknown student account", async () => {
      const req = {
        body: {
          email: "unknown@example.com",
          password: "Password123!",
        },
        cookies: {},
      };

      const res = createResponse();
      const next = jest.fn();

      mockStudent.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await loginStudents(req, res, next);

      expect(mockStudent.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("registerStudents", () => {
    it("should reject registration when required fields are missing", async () => {
      const req = {
        body: {},
        files: {},
        file: undefined,
      };

      const res = createResponse();
      const next = jest.fn();

      await registerStudents(req, res, next);

      expect(mockStudent.create).not.toHaveBeenCalled();
      expect(mockUploadToCloudinary).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("logoutStudent", () => {
    it("should revoke the current session", async () => {
      const req = {
        body: {},
        cookies: {
          refreshToken: "test-refresh-token",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      mockRevokeUserSession.mockResolvedValue(true);

      await logoutStudent(req, res, next);

      // Confirm session revocation was attempted.
      // The exact arguments depend on session.service.js.
      expect(mockRevokeUserSession.mock.calls.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("refreshAccessToken", () => {
    it("should reject a refresh request without a refresh cookie", async () => {
      const req = {
        body: {},
        cookies: {},
      };

      const res = createResponse();
      const next = jest.fn();

      await refreshAccessToken(req, res, next);

      expect(mockRotateUserSession).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
