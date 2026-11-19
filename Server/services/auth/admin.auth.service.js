import crypto from "crypto";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  findAdminByEmail,
  createAdmin,
} from "../queries/auth/admin.auth.queries.js";
import { createLoginOTP } from "./otp.service.js";

const USER_MODEL = "Admin";

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

const loginAdmin = async ({ email, password } = {}) => {
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
    throw new APIERR(HTTP_STATUS.UNAUTHORIZE, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "Your administrator account is inactive",
    );
  }

  // Generate an OTP challenge instead of creating a session.
  const otpChallenge = await createLoginOTP({
    user: admin,
    userModel: USER_MODEL,
  });

  return {
    otp: otpChallenge,
  };
};

export { registerAdmin, loginAdmin };
