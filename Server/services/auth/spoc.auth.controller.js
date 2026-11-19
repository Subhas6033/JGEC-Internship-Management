import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { SPOC } from "../../models/spoc.models.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  clearCookieConfig,
  getRefreshCookieName,
} from "../../config/cookieConfig.config.js";
import { revokeUserSession } from "./session.service.js";
import { createLoginOTP } from "./otp.service.js";

const USER_MODEL = "SPOC";
const REFRESH_COOKIE_NAME = getRefreshCookieName(USER_MODEL);

// Register SPOC
const spocRegistration = asyncHandler(async (req, res) => {
  const { fullName, spocId, email, mobile, password, department } = req.body;
  // Validate the required fields
  if (
    [fullName, spocId, email, mobile, password, department].some(
      (value) => !value || value.trim() === "",
    )
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide the required fields",
    );
  }
  // Normalize values
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile.trim();
  const normalizedSpocId = spocId.trim().toUpperCase();
  const normalizedDepartment = department.trim();

  // Check existing mails
  const existingEmail = await SPOC.findOne({
    email: normalizedEmail,
  });

  if (existingEmail) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists",
    );
  }

  // validate SPOC ID
  const isSPOCIdValid =
    normalizedSpocId === process.env.SPOC_ID?.trim().toUpperCase();

  if (!isSPOCIdValid) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "SPOC ID is not valid. Please provide a valid SPOC ID",
    );
  }

  // Create SPOC
  const spoc = await SPOC.create({
    fullName: fullName.trim(),
    spocId: normalizedSpocId,
    email: normalizedEmail,
    mobile: normalizedMobile,
    password,
    department: normalizedDepartment,
    role: "spoc",
  });

  // Remove sensitive fields
  const safeSPOC = await SPOC.findById(spoc._id).select("-__v -password");
  return res.status(HTTP_STATUS.CREATED).json(
    new APIRES(
      HTTP_STATUS.CREATED,
      {
        spoc: safeSPOC,
      },
      "SPOC account created successfully",
    ),
  );
});

// Login SPOC - OTP verification required
const spocLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required",
    );
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Find SPOC with password
  const spoc = await SPOC.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!spoc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "No SPOC account found");
  }

  // Check active status
  if (!spoc.isActive) {
    throw new APIERR(HTTP_STATUS.FORBIDDEN, "Your SPOC account is inactive");
  }

  // Verify password
  const isPasswordCorrect = await spoc.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZE, "Invalid email or password");
  }

  // Generate and send OTP.
  // No access token or refresh token is created here.
  const otpChallenge = await createLoginOTP({
    user: spoc,
    userModel: USER_MODEL,
  });

  return res
    .status(HTTP_STATUS.SUCCESS)
    .set("Cache-Control", "no-store")
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        {
          otp: otpChallenge,
        },
        "Verification code sent to your registered email",
      ),
    );
});

// Logout SPOC
const spocLogout = asyncHandler(async (req, res) => {
  await revokeUserSession(req.cookies?.[REFRESH_COOKIE_NAME], "logout");
  return res
    .status(HTTP_STATUS.SUCCESS)
    .clearCookie(REFRESH_COOKIE_NAME, clearCookieConfig)
    .json(new APIRES(HTTP_STATUS.SUCCESS, null, "Logged out successfully"));
});

// Get current SPOC
const getSPOC = asyncHandler(async (req, res) => {
  const spoc = await SPOC.findById(req.user._id).select("-__v -password");

  if (!spoc) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "SPOC not found");
  }
  // prevent browsers proxy/caching
  res.set("Cache-Control", "no-store");
  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        spoc,
      },
      "Current SPOC fetched successfully",
    ),
  );
});

export { spocRegistration, spocLogin, spocLogout, getSPOC };
