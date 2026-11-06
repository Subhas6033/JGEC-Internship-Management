import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock the helper utils BEFORE any imports
jest.mock("../../Server/utils/helper.utils.js", () => {
  const actual = jest.requireActual("../../Server/utils/helper.utils.js");
  return {
    ...actual,
    asyncHandler: (fn) => async (req, res, next) => {
      try {
        return await fn(req, res, next);
      } catch (error) {
        // Don't log in tests
        return next(error);
      }
    },
  };
});

// Mock student model - returns a Mongoose-like query object
const mockStudentFindOne = jest.fn();
const mockStudentCreate = jest.fn();

const mockStudent = {
  findOne: mockStudentFindOne,
  create: mockStudentCreate,
};

const mockUploadToCloudinary = jest.fn();
const mockRevokeUserSession = jest.fn();
const mockCreateUserSession = jest.fn();
const mockRotateUserSession = jest.fn();

// Mock student model
jest.mock("../../Server/models/students.models.js", () => ({
  Student: mockStudent,
}));

// Mock Cloudinary upload utility
jest.mock("../../Server/upload/uploadOnCloudinary.upload.js", () => ({
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
jest.mock("../../Server/services/auth/session.service.js", () => ({
  createUserSession: mockCreateUserSession,
  rotateUserSession: mockRotateUserSession,
  revokeUserSession: mockRevokeUserSession,
}));

// Mock the auth service to return the functions
let loginStudents;
let registerStudents;
let logoutStudent;
let refreshAccessToken;

beforeAll(async () => {
  const authService = await import("../../Server/services/auth/auth.service.js");
  ({ loginStudents, registerStudents, logoutStudent, refreshAccessToken } =
    authService);
});

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

    mockStudentFindOne.mockReset();
    mockStudentCreate.mockReset();

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

      expect(mockStudentFindOne).not.toHaveBeenCalled();
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

      // Mock the query chain: Student.findOne().select()
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };
      mockStudentFindOne.mockReturnValue(mockQuery);

      await loginStudents(req, res, next);

      expect(mockStudentFindOne).toHaveBeenCalled();

      const query = mockStudentFindOne.mock.calls[0][0];

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

      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };
      mockStudentFindOne.mockReturnValue(mockQuery);

      await loginStudents(req, res, next);

      expect(mockStudentFindOne).toHaveBeenCalled();
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

      expect(mockStudentCreate).not.toHaveBeenCalled();
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
      expect(mockRevokeUserSession).toHaveBeenCalled();
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
