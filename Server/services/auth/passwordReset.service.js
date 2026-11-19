import { Student } from "../../models/students.models.js";
import { TPO } from "../../models/tpo.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { Admin } from "../../models/admin.model.js";
import { PasswordReset } from "../../models/passwordReset.models.js";
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
  getPasswordResetExpiry,
} from "../../utils/passwordReset.utils.js";
import { revokeAllUserSessions } from "./session.service.js";
import { sendMail, isMailConfigured } from "../../utils/Mail/mail.utils.js";
import { buildResetEmail } from "../../template/passwordReset.template.js";
import { APIERR } from "../../utils/helper.utils.js";

const USER_MODELS = {
  student: {
    model: Student,
    modelName: "Student",
  },
  TPO: {
    model: TPO,
    modelName: "TPO",
  },
  SPOC: {
    model: SPOC,
    modelName: "SPOC",
  },
  admin: {
    model: Admin,
    modelName: "Admin",
  },
};

const RESET_SUCCESS_MESSAGE =
  "If we found any account matches the provided details, password reset instructions will be sent to its registered email.";

const getUserModel = (role) => {
  const config = USER_MODELS[role];

  if (!config) {
    throw new APIERR(400, "Invalid account role.");
  }

  return config;
};

const buildResetLink = (token) => {
  let frontendUrl;

  process.env.NODE_ENV === "production"
    ? (frontendUrl = process.env.PRODUCTION_URL)
    : (frontendUrl = process.env.DEV_URL);

  if (!frontendUrl) {
    throw new APIERR(500, "Password reset URL is not configured.");
  }

  return `${frontendUrl.replace(/\/+$/, "")}/auth/reset-password?token=${encodeURIComponent(token)}`;
};

/**
 * Request a password reset.
 *
 * The same response is returned whether the account exists or not.
 */
const requestPasswordReset = async ({ email, role }) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  const { model: UserModel, modelName } = getUserModel(role);

  if (!normalizedEmail) {
    throw new APIERR(400, "Email address is required.");
  }

  if (!isMailConfigured()) {
    throw new APIERR(500, "Password reset email service is unavailable.");
  }

  const user = await UserModel.findOne({
    email: normalizedEmail,
  });

  // Do not reveal whether an account exists.
  if (!user || user.isActive === false) {
    return {
      message: RESET_SUCCESS_MESSAGE,
    };
  }

  const rawToken = generatePasswordResetToken();
  const tokenHash = hashPasswordResetToken(rawToken);
  const expiresAt = getPasswordResetExpiry();
  const resetLink = buildResetLink(rawToken);
  const emailContent = buildResetEmail(resetLink);

  // Invalidate previous outstanding requests for this account.
  await PasswordReset.deleteMany({
    userId: user._id,
    userModel: modelName,
    usedAt: null,
  });

  await PasswordReset.create({
    userId: user._id,
    userModel: modelName,
    role,
    tokenHash,
    expiresAt,
  });

  try {
    await sendMail({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
  } catch (error) {
    // Do not leave a valid reset token when email delivery fails.
    await PasswordReset.deleteOne({ tokenHash });

    throw new APIERR(
      500,
      "Unable to send password reset email. Please try again later.",
    );
  }

  return {
    message: RESET_SUCCESS_MESSAGE,
  };
};

/**
 * Validate a new password against the existing
 * password rules for each user model.
 */
const validateNewPassword = (password, role) => {
  if (typeof password !== "string") {
    throw new APIERR(400, "Password is required.");
  }

  switch (role) {
    case "student": {
      const studentPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!*?&]{6,20}$/;

      if (!studentPasswordRegex.test(password)) {
        throw new APIERR(
          400,
          "Student password must contain 6-20 characters, including uppercase, lowercase, number and special character.",
        );
      }

      break;
    }

    case "TPO": {
      if (password.length < 8) {
        throw new APIERR(400, "Password must contain at least 8 characters.");
      }

      break;
    }

    case "SPOC": {
      if (password.length < 6) {
        throw new APIERR(400, "Password must contain at least 6 characters.");
      }

      break;
    }

    case "admin": {
      if (password.length < 8) {
        throw new APIERR(400, "Password must contain at least 8 characters.");
      }

      break;
    }

    default:
      throw new APIERR(400, "Invalid account role.");
  }
};

/**
 * Reset the user's password using a valid reset token.
 */
const resetUserPassword = async ({ token, newPassword }) => {
  if (!token || typeof token !== "string" || token.length !== 64) {
    throw new APIERR(401, "Invalid or expired password reset link.");
  }

  const tokenHash = hashPasswordResetToken(token);

  const now = new Date();

  /*
   * Atomically claim the token.
   * Only one request can successfully consume it.
   */
  const resetRequest = await PasswordReset.findOneAndUpdate(
    {
      tokenHash,
      expiresAt: { $gt: now },
      usedAt: null,
    },
    {
      $set: {
        usedAt: now,
      },
    },
    {
      new: true,
    },
  );

  if (!resetRequest) {
    throw new APIERR(401, "Invalid or expired password reset link.");
  }

  validateNewPassword(newPassword, resetRequest.role);
  const config = getUserModel(resetRequest.role);
  const user = await config.model.findById(resetRequest.userId);

  if (!user || user.isActive === false) {
    throw new APIERR(401, "Invalid or expired password reset link.");
  }

  // Assign plaintext password.
  // The existing user schema pre-save hook hashes it.
  user.password = newPassword;

  await user.save();

  // Remove other outstanding reset requests for this account.
  await PasswordReset.deleteMany({
    userId: user._id,
    userModel: resetRequest.userModel,
    _id: { $ne: resetRequest._id },
  });

  // Revoke all existing refresh sessions.
  await revokeAllUserSessions(
    user._id,
    resetRequest.userModel,
    "password_reset",
  );

  return {
    message: "Your password has been reset successfully.",
  };
};

/**
 * Optional helper for checking reset-link validity.
 *
 * Does not consume the token. Email security scanners may
 * open links automatically, so only the final reset request
 * should consume it.
 */
const verifyPasswordResetToken = async (token) => {
  if (!token || typeof token !== "string" || token.length !== 64) {
    return false;
  }

  const tokenHash = hashPasswordResetToken(token);

  const resetRequest = await PasswordReset.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
    usedAt: null,
  }).lean();

  return Boolean(resetRequest);
};

export { requestPasswordReset, resetUserPassword, verifyPasswordResetToken };
