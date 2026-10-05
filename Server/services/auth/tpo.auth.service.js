import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { TPO } from "../../models/tpo.models.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  cookieConfig,
  clearCookieConfig,
  getRefreshCookieName,
} from "../../config/cookieConfig.config.js";
import {
  createUserSession,
  revokeUserSession,
} from "../../services/auth/session.service.js";

const USER_MODEL = "TPO";
const REFRESH_COOKIE_NAME = getRefreshCookieName(USER_MODEL);

// Register a TPO
const tpoRegistrations = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, department, tpoId, password } = req.body;

  if (
    [fullName, email, mobile, department, tpoId, password].some(
      (value) => !value || value.trim() === "",
    )
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide the required fields",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile.trim();
  const normalizedTPOId = tpoId.trim().toUpperCase();
  // Valide the TPO ID
  const isTPOIdValid =
    normalizedTPOId === process.env.TPO_ID?.trim().toUpperCase();

  if (!isTPOIdValid) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "TPO ID is not valid. Please provide a valid TPO ID",
    );
  }

  const existingTPO = await TPO.findOne({
    email: normalizedEmail,
  });

  if (existingTPO) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists",
    );
  }

  const tpo = await TPO.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    mobile: normalizedMobile,
    department,
    tpoId: normalizedTPOId,
    role: "TPO",
    password,
  });

  const safeTPO = await TPO.findById(tpo._id).select("-__v -password");

  return res.status(HTTP_STATUS.CREATED).json(
    new APIRES(
      HTTP_STATUS.CREATED,
      {
        tpo: safeTPO,
      },
      "TPO account created successfully",
    ),
  );
});

// Login TPO
const tpoLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required",
    );
  }
  const normalizedEmail = email.trim().toLowerCase();
  const tpo = await TPO.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!tpo) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NO TPO Account found");
  }

  if (!tpo.isActive) {
    throw new APIERR(HTTP_STATUS.FORBIDDEN, "Your TPO account is inactive");
  }

  const isPasswordCorrect = await tpo.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  await revokeUserSession(
    req.cookies?.[REFRESH_COOKIE_NAME],
    "replaced_by_new_login",
  );

  const { accessToken, refreshToken } = await createUserSession(
    tpo,
    USER_MODEL,
    req,
  );

  tpo.lastLoginAt = new Date();
  await tpo.save();
  const safeTPO = tpo.toObject();
  delete safeTPO.password;
  return res
    .status(HTTP_STATUS.SUCCESS)
    .cookie(REFRESH_COOKIE_NAME, refreshToken, cookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        {
          tpo: safeTPO,
          accessToken,
        },
        "Successfully logged in",
      ),
    );
});

// logout TPO
const tpoLogout = asyncHandler(async (req, res) => {
  await revokeUserSession(req.cookies?.[REFRESH_COOKIE_NAME], "logout");

  return res
    .status(HTTP_STATUS.SUCCESS)
    .clearCookie(REFRESH_COOKIE_NAME, clearCookieConfig)
    .json(new APIRES(HTTP_STATUS.SUCCESS, null, "Logged out successfully"));
});

// Get the current TPO
const getTPO = asyncHandler(async (req, res) => {
  const tpo = await TPO.findById(req.user._id).select("-__v -password");

  if (!tpo) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "TPO not found");
  }

  res.set("Cache-Control", "no-store");
  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        tpo,
      },
      "Current TPO fetched successfully",
    ),
  );
});

export { tpoRegistrations, tpoLogin, tpoLogout, getTPO };
