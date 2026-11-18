import crypto from "crypto";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  findAdminByEmail,
  createAdmin,
  updateAdminLastLogin,
} from "../queries/auth/admin.auth.queries.js";
import { createUserSession, revokeUserSession } from "./session.service.js";
import { getRefreshCookieName } from "../../config/cookieConfig.config.js";

const USER_MODEL = "Admin";
const REFRESH_COOKIE_NAME = getRefreshCookieName(USER_MODEL);

const badRequest = (message) => new APIERR(HTTP_STATUS.BAD_REQUEST, message);

const validateRegistrationKey = (providedKey) => {
  const configuredKey = process.env.ADMIN_REGISTRATION_KEY;

  if (!configuredKey) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Admin registration is not configured",
    );
  }

  if (typeof providedKey !== "string" || !providedKey.trim()) {
    throw badRequest("Administrator authorization key is required");
  }

  const expected = Buffer.from(configuredKey.trim());
  const received = Buffer.from(providedKey.trim());

  const valid =
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received);

  if (!valid) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "Invalid administrator authorization key",
    );
  }
};

const registerAdmin = async (payload = {}) => {
  const { name, email, mobile, adminKey, password } = payload;

  if (
    [name, email, mobile, adminKey, password].some(
      (value) => typeof value !== "string" || !value.trim(),
    )
  ) {
    throw badRequest("Please provide all required fields");
  }

  const fullName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile.trim();

  if (fullName.length < 3 || fullName.length > 100) {
    throw badRequest("Full name must contain 3 to 100 characters");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw badRequest("Please provide a valid email address");
  }

  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    throw badRequest("Please provide a valid 10-digit mobile number");
  }

  if (password.length < 8) {
    throw badRequest("Password must contain at least 8 characters");
  }

  validateRegistrationKey(adminKey);

  const existingAdmin = await findAdminByEmail(normalizedEmail);

  if (existingAdmin) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An administrator with this email already exists",
    );
  }

  const admin = await createAdmin({
    fullName,
    email: normalizedEmail,
    mobile: normalizedMobile,
    password,
    role: "admin",
  });

  return {
    _id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    mobile: admin.mobile,
    role: admin.role,
    isActive: admin.isActive,
  };
};

const loginAdmin = async ({ email, password } = {}, req) => {
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw badRequest("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admin = await findAdminByEmail(normalizedEmail, true);

  // Do not reveal whether the email exists.
  if (!admin || !(await admin.comparePassword(password))) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "Your administrator account is inactive",
    );
  }

  // Replace only an existing Admin session cookie.
  await revokeUserSession(
    req.cookies?.[REFRESH_COOKIE_NAME],
    "replaced_by_new_login",
  );

  // Shared centralized session creation.
  const { accessToken, refreshToken } = await createUserSession(
    admin,
    USER_MODEL,
    req,
  );

  const safeAdmin = await updateAdminLastLogin(admin._id);

  return {
    admin: safeAdmin,
    accessToken,
    refreshToken,
    refreshCookieName: REFRESH_COOKIE_NAME,
  };
};

export { registerAdmin, loginAdmin };
