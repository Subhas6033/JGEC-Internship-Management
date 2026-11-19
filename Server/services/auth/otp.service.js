import crypto from "crypto";
import mongoose from "mongoose";
import { AuthOTP } from "../../models/authOtp.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { createUserSession } from "./session.service.js";
import { authOtpTemplate } from "../../template/authOtp.template.js";
import { sendMail, isMailConfigured } from "../../utils/Mail/mail.utils.js";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;
const OTP_SECRET = process.env.OTP_SECRET;
const SUPPORTED_MODELS = ["Student", "TPO", "SPOC", "Admin"];
const unauthorizedStatus = HTTP_STATUS.UNAUTHORIZED;

const ensureOTPConfiguration = () => {
  if (!OTP_SECRET || OTP_SECRET.length < 32) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "OTP service is not configured correctly",
    );
  }

  if (typeof sendMail !== "function") {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Email service is not available",
    );
  }

  if (typeof isMailConfigured === "function" && !isMailConfigured()) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Email service is not configured",
    );
  }
};

const validateUserModel = (userModel) => {
  if (!SUPPORTED_MODELS.includes(userModel)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Unsupported authentication role",
    );
  }
};

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = (challengeId, otp) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${challengeId}:${otp}`)
    .digest("hex");
};

const compareOTP = (storedHash, challengeId, otp) => {
  if (typeof storedHash !== "string" || !/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false;
  }

  const receivedHash = Buffer.from(hashOTP(challengeId, otp), "hex");
  const expectedHash = Buffer.from(storedHash, "hex");

  return (
    receivedHash.length === expectedHash.length &&
    crypto.timingSafeEqual(receivedHash, expectedHash)
  );
};

const maskEmail = (email) => {
  const [name, domain] = email.split("@");

  if (!domain) return email;

  const visible = name.slice(0, 2);
  const hidden = "*".repeat(Math.max(name.length - 2, 2));

  return `${visible}${hidden}@${domain}`;
};

const sendLoginOTPEmail = async ({ email, otp, userName, userModel }) => {
  const template = authOtpTemplate({
    otp,
    userName: userName || "User",
    userRole: userModel,
    expiryMinutes: OTP_EXPIRY_MINUTES,
    purpose: "LOGIN",
  });

  await sendMail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Create and send a login OTP.
 *
 * This function does not create an authenticated session.
 */
const createLoginOTP = async ({ user, userModel }) => {
  ensureOTPConfiguration();
  validateUserModel(userModel);

  if (!user?._id || !user?.email) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Valid user information is required",
    );
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  // Expire previous pending login challenges for this user.
  await AuthOTP.updateMany(
    {
      userId: user._id,
      userModel,
      purpose: "LOGIN",
      status: "PENDING",
    },
    {
      $set: {
        status: "EXPIRED",
      },
    },
  );

  const challengeId = crypto.randomUUID();
  const otp = generateOTP();
  const now = new Date();

  const challenge = await AuthOTP.create({
    challengeId,
    userId: user._id,
    userModel,
    email: normalizedEmail,
    purpose: "LOGIN",
    otpHash: hashOTP(challengeId, otp),
    attempts: 0,
    maxAttempts: MAX_OTP_ATTEMPTS,
    expiresAt: new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000),
    resendAvailableAt: new Date(now.getTime() + OTP_RESEND_SECONDS * 1000),
  });

  try {
    await sendLoginOTPEmail({
      email: normalizedEmail,
      otp,
      userName: user.fullName || user.name || "User",
      userModel,
    });
  } catch (error) {
    await AuthOTP.updateOne(
      { _id: challenge._id, status: "PENDING" },
      { $set: { status: "EXPIRED" } },
    );

    console.error("OTP email delivery failed:", error);

    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to send verification code. Please try again.",
    );
  }

  return {
    challengeId,
    email: maskEmail(normalizedEmail),
    expiresIn: OTP_EXPIRY_MINUTES * 60,
    resendAfter: OTP_RESEND_SECONDS,
  };
};

/**
 * Resend OTP for an existing challenge.
 */
const resendLoginOTP = async ({ challengeId, userModel }) => {
  ensureOTPConfiguration();
  validateUserModel(userModel);

  if (!challengeId || typeof challengeId !== "string") {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "OTP challenge ID is required");
  }

  const now = new Date();

  const existingChallenge = await AuthOTP.findOne({
    challengeId,
    userModel,
    purpose: "LOGIN",
    status: "PENDING",
  }).select("+otpHash");

  if (!existingChallenge) {
    throw new APIERR(unauthorizedStatus, "Invalid or expired OTP challenge");
  }

  if (existingChallenge.expiresAt <= now) {
    await AuthOTP.updateOne(
      { _id: existingChallenge._id, status: "PENDING" },
      { $set: { status: "EXPIRED" } },
    );

    throw new APIERR(
      unauthorizedStatus,
      "OTP has expired. Please login again.",
    );
  }

  if (existingChallenge.attempts >= existingChallenge.maxAttempts) {
    await AuthOTP.updateOne(
      { _id: existingChallenge._id, status: "PENDING" },
      { $set: { status: "LOCKED" } },
    );

    throw new APIERR(
      unauthorizedStatus,
      "Maximum OTP attempts exceeded. Please login again.",
    );
  }

  if (existingChallenge.resendAvailableAt > now) {
    throw new APIERR(429, "Please wait before requesting another OTP");
  }

  const otp = generateOTP();

  // Atomically update the challenge to prevent simultaneous resend requests.
  const updatedChallenge = await AuthOTP.findOneAndUpdate(
    {
      _id: existingChallenge._id,
      status: "PENDING",
      expiresAt: { $gt: now },
      resendAvailableAt: { $lte: now },
      $expr: {
        $lt: ["$attempts", "$maxAttempts"],
      },
    },
    {
      $set: {
        otpHash: hashOTP(challengeId, otp),
        attempts: 0,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000),
        resendAvailableAt: new Date(now.getTime() + OTP_RESEND_SECONDS * 1000),
      },
    },
    {
      new: true,
    },
  );

  if (!updatedChallenge) {
    throw new APIERR(
      unauthorizedStatus,
      "OTP challenge is no longer available. Please try again.",
    );
  }

  try {
    await sendLoginOTPEmail({
      email: updatedChallenge.email,
      otp,
      userName: "User",
      userModel,
    });
  } catch (error) {
    await AuthOTP.updateOne(
      { _id: updatedChallenge._id, status: "PENDING" },
      { $set: { status: "EXPIRED" } },
    );

    console.error("OTP resend failed:", error);

    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to resend verification code",
    );
  }

  return {
    email: maskEmail(updatedChallenge.email),
    expiresIn: OTP_EXPIRY_MINUTES * 60,
    resendAfter: OTP_RESEND_SECONDS,
  };
};

/**
 * Verify OTP and create the authenticated session.
 */
const verifyLoginOTP = async ({ challengeId, otp, userModel, req }) => {
  ensureOTPConfiguration();
  validateUserModel(userModel);

  if (
    typeof challengeId !== "string" ||
    typeof otp !== "string" ||
    !/^\d{6}$/.test(otp)
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "A valid challenge ID and six-digit OTP are required",
    );
  }

  const challenge = await AuthOTP.findOne({
    challengeId,
    userModel,
    purpose: "LOGIN",
    status: "PENDING",
  }).select("+otpHash");

  if (!challenge) {
    throw new APIERR(unauthorizedStatus, "Invalid or expired OTP challenge");
  }

  const now = new Date();

  if (challenge.expiresAt <= now) {
    await AuthOTP.updateOne(
      { _id: challenge._id, status: "PENDING" },
      { $set: { status: "EXPIRED" } },
    );

    throw new APIERR(
      unauthorizedStatus,
      "OTP has expired. Please login again.",
    );
  }

  if (challenge.attempts >= challenge.maxAttempts) {
    await AuthOTP.updateOne(
      { _id: challenge._id, status: "PENDING" },
      { $set: { status: "LOCKED" } },
    );

    throw new APIERR(
      unauthorizedStatus,
      "Maximum OTP attempts exceeded. Please login again.",
    );
  }

  const isValidOTP = compareOTP(challenge.otpHash, challengeId, otp);

  if (!isValidOTP) {
    // Atomically increment the failed attempt count.
    const updatedChallenge = await AuthOTP.findOneAndUpdate(
      {
        _id: challenge._id,
        status: "PENDING",
        expiresAt: { $gt: now },
        $expr: {
          $lt: ["$attempts", "$maxAttempts"],
        },
      },
      {
        $inc: {
          attempts: 1,
        },
      },
      {
        new: true,
      },
    );

    if (
      updatedChallenge &&
      updatedChallenge.attempts >= updatedChallenge.maxAttempts
    ) {
      await AuthOTP.updateOne(
        {
          _id: updatedChallenge._id,
          status: "PENDING",
        },
        {
          $set: {
            status: "LOCKED",
          },
        },
      );
    }

    throw new APIERR(
      unauthorizedStatus,
      updatedChallenge &&
        updatedChallenge.attempts >= updatedChallenge.maxAttempts
        ? "Maximum OTP attempts exceeded. Please login again."
        : "Invalid verification code",
    );
  }

  // Consume the challenge atomically so it cannot be reused.
  const consumedChallenge = await AuthOTP.findOneAndUpdate(
    {
      _id: challenge._id,
      status: "PENDING",
      otpHash: challenge.otpHash,
      expiresAt: { $gt: now },
      $expr: {
        $lt: ["$attempts", "$maxAttempts"],
      },
    },
    {
      $set: {
        status: "VERIFIED",
        consumedAt: now,
      },
    },
    {
      new: true,
    },
  );

  if (!consumedChallenge) {
    throw new APIERR(
      unauthorizedStatus,
      "OTP challenge has already been used or expired",
    );
  }

  // Resolve the model registered with Mongoose.
  if (!mongoose.models[userModel]) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      `${userModel} model is not registered`,
    );
  }

  const UserModel = mongoose.model(userModel);

  const user = await UserModel.findById(consumedChallenge.userId);

  if (
    !user ||
    user.email?.trim().toLowerCase() !==
      consumedChallenge.email.trim().toLowerCase()
  ) {
    throw new APIERR(unauthorizedStatus, "User account is no longer available");
  }

  if (user.isActive === false) {
    throw new APIERR(HTTP_STATUS.FORBIDDEN, "Your account is inactive");
  }

  // Update last login if this field exists in the model.
  if (user.schema.path("lastLoginAt")) {
    user.lastLoginAt = new Date();
    await user.save();
  }

  // Create session only after successful OTP verification.
  const { accessToken, refreshToken } = await createUserSession(
    user,
    userModel,
    req,
  );

  const safeUser = user.toObject();

  delete safeUser.password;
  delete safeUser.__v;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export { createLoginOTP, resendLoginOTP, verifyLoginOTP };
