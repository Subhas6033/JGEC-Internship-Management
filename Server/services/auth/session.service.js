import mongoose from "mongoose";

import { RefreshSession } from "../../models/refreshSessions.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import {
  generateAccessToken,
  generateRefreshSecret,
  hashRefreshSecret,
  compareTokenHashes,
  generateTokenFamilyId,
} from "../../utils/token.utils.js";

const REFRESH_TOKEN_EXPIRY_DAYS =
  Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;

const REFRESH_TOKEN_GRACE_SECONDS =
  Number(process.env.REFRESH_TOKEN_GRACE_SECONDS) || 10;

const MIN_ROTATE_INTERVAL_MS =
  (Number(process.env.REFRESH_ROTATION_MIN_INTERVAL_SECONDS) || 0) * 1000;

const SUPPORTED_USER_MODELS = new Set(["Student", "TPO", "SPOC"]);

const validateUserModel = (userModel) => {
  if (!SUPPORTED_USER_MODELS.has(userModel)) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      `Unsupported authentication model: ${userModel}`,
    );
  }
};

const invalidToken = (message = "Invalid refresh token") =>
  new APIERR(HTTP_STATUS.UNAUTHORIZED, message);

const generateRefreshToken = () => generateRefreshSecret();

const createRefreshToken = (sessionId, secret) => `${sessionId}.${secret}`;

const parseRefreshToken = (refreshToken) => {
  if (!refreshToken || typeof refreshToken !== "string") {
    throw invalidToken("Refresh token is required");
  }

  const parts = refreshToken.split(".");

  if (parts.length !== 2) {
    throw invalidToken();
  }

  const [sessionId, secret] = parts;

  if (!mongoose.Types.ObjectId.isValid(sessionId) || !secret) {
    throw invalidToken();
  }

  return {
    sessionId,
    secret,
  };
};

const revokeSessionById = async (sessionId, reason = "logout") => {
  return RefreshSession.updateOne(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokeReason: reason,
      },
    },
  );
};

const loadUser = async (userId, userModel) => {
  validateUserModel(userModel);

  let Model;

  try {
    Model = mongoose.model(userModel);
  } catch {
    throw invalidToken("Authentication model not found");
  }

  const user = await Model.findById(userId);

  if (!user) {
    throw invalidToken(`${userModel} not found`);
  }

  if (
    Object.prototype.hasOwnProperty.call(user.toObject(), "isActive") &&
    !user.isActive
  ) {
    throw invalidToken(`${userModel} account is inactive`);
  }

  return user;
};

const createUserSession = async (user, userModel, req) => {
  validateUserModel(userModel);

  if (!user?._id) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to create authentication session",
    );
  }

  const secret = generateRefreshToken();
  const tokenHash = hashRefreshSecret(secret);
  const familyId = generateTokenFamilyId();

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  const session = await RefreshSession.create({
    user: user._id,
    userModel,
    tokenHash,
    previousTokenHash: null,
    previousTokenValidUntil: null,
    familyId,
    expiresAt,
    lastUsedAt: new Date(),
    lastRotatedAt: null,
    userAgent: req?.headers?.["user-agent"] || "",
    ipAddress: req?.ip || req?.headers?.["x-forwarded-for"] || "",
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken: createRefreshToken(session._id.toString(), secret),
  };
};

const rotateUserSession = async (
  refreshToken,
  req,
  expectedUserModel = null,
) => {
  const { sessionId, secret } = parseRefreshToken(refreshToken);

  const now = new Date();

  const session = await RefreshSession.findOne({
    _id: sessionId,
    revokedAt: null,
    expiresAt: {
      $gt: now,
    },
  }).select("+tokenHash +previousTokenHash");

  if (!session) {
    throw invalidToken("Refresh session is expired or revoked");
  }

  if (expectedUserModel && session.userModel !== expectedUserModel) {
    throw invalidToken();
  }

  const incomingHash = hashRefreshSecret(secret);

  const loadCurrentUser = () => loadUser(session.user, session.userModel);

  if (compareTokenHashes(incomingHash, session.tokenHash)) {
    const user = await loadCurrentUser();

    const lastRotation = session.lastRotatedAt || session.createdAt;

    if (
      MIN_ROTATE_INTERVAL_MS > 0 &&
      lastRotation &&
      now.getTime() - new Date(lastRotation).getTime() < MIN_ROTATE_INTERVAL_MS
    ) {
      await RefreshSession.updateOne(
        {
          _id: session._id,
          revokedAt: null,
        },
        {
          $set: {
            lastUsedAt: now,
          },
        },
      );

      return {
        accessToken: generateAccessToken(user),
        refreshToken: null,
        user,
      };
    }

    const newSecret = generateRefreshToken();

    const newTokenHash = hashRefreshSecret(newSecret);

    const previousTokenValidUntil = new Date(
      now.getTime() + REFRESH_TOKEN_GRACE_SECONDS * 1000,
    );

    const updated = await RefreshSession.findOneAndUpdate(
      {
        _id: session._id,
        tokenHash: session.tokenHash,
        revokedAt: null,
        expiresAt: {
          $gt: now,
        },
      },
      {
        $set: {
          previousTokenHash: session.tokenHash,

          previousTokenValidUntil,

          tokenHash: newTokenHash,

          lastUsedAt: now,

          lastRotatedAt: now,

          replacedBy: newTokenHash,

          userAgent: req?.headers?.["user-agent"] || "",

          ipAddress: req?.ip || req?.headers?.["x-forwarded-for"] || "",
        },
      },
      {
        new: true,
      },
    );

    if (!updated) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Refresh token was already rotated. Please retry.",
      );
    }

    return {
      accessToken: generateAccessToken(user),

      refreshToken: createRefreshToken(session._id.toString(), newSecret),

      user,
    };
  }

  const isPrevious = compareTokenHashes(
    incomingHash,
    session.previousTokenHash,
  );

  if (
    isPrevious &&
    session.previousTokenValidUntil &&
    session.previousTokenValidUntil > now
  ) {
    const user = await loadCurrentUser();

    return {
      accessToken: generateAccessToken(user),

      // Never replace the browser cookie with the
      // previous token during the grace period.
      refreshToken: null,

      user,
    };
  }

  await revokeSessionById(session._id, "refresh_token_reuse_detected");

  throw invalidToken("Refresh session is no longer valid");
};

const revokeUserSession = async (refreshToken, reason = "logout") => {
  if (!refreshToken || typeof refreshToken !== "string") {
    return;
  }

  const [sessionId] = refreshToken.split(".");

  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    return;
  }

  await revokeSessionById(sessionId, reason);
};

const revokeAllUserSessions = async (
  userId,
  userModel,
  reason = "logout_all_devices",
) => {
  validateUserModel(userModel);

  await RefreshSession.updateMany(
    {
      user: userId,
      userModel,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokeReason: reason,
      },
    },
  );
};

export {
  createUserSession,
  rotateUserSession,
  revokeUserSession,
  revokeAllUserSessions,
};
