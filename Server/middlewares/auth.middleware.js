import jwt from "jsonwebtoken";
import { Student } from "../models/students.models.js";
import { TPO } from "../models/tpo.models.js";
// import { SPOC } from "../models/spoc.models.js";
// import { Admin } from "../models/admin.models.js";
import { APIERR, asyncHandler } from "../utils/helper.utils.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";
import { normalizeRole } from "../config/auth.config.js";

const USER_MODEL_MAP = {
  student: Student,
  TPO,
  // spoc: SPOC,
  // admin: Admin,
};

const authenticateUser = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authentication is required");
  }
  const accessToken = authorization.slice(7).trim();
  if (!accessToken) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token is required");
  }
  let decoded;
  try {
    const verifyOptions = {};
    if (process.env.ACCESS_TOKEN_ISSUER) {
      verifyOptions.issuer = process.env.ACCESS_TOKEN_ISSUER;
    }
    if (process.env.ACCESS_TOKEN_AUDIENCE) {
      verifyOptions.audience = process.env.ACCESS_TOKEN_AUDIENCE;
    }
    decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      verifyOptions,
    );
  } catch (error) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Invalid access token");
  }
  const userId = decoded?.sub;
  const role = normalizeRole(decoded?.role);
  if (!userId || !role) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid authentication credentials",
    );
  }
  const UserModel = USER_MODEL_MAP[role];
  if (!UserModel) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      `Authentication model is not configured for role: ${role}`,
    );
  }
  const user = await UserModel.findById(userId).select("-password -__v").lean();
  if (!user) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Authenticated user was not found",
    );
  }
  if (user.isActive === false) {
    throw new APIERR(HTTP_STATUS.FORBIDDEN, "Your account is inactive");
  }
  const normalizedUserRole = normalizeRole(user.role);

  if (!normalizedUserRole || normalizedUserRole !== role) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid authentication credentials",
    );
  }
  req.user = {
    ...user,
    role: normalizedUserRole,
  };
  return next();
});

export { authenticateUser };
