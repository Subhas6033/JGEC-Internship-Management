import crypto from "crypto";
import mongoose from "mongoose";
import { RefreshSession } from "../../models/refreshSessions.models.js";
import { Student } from "../../models/students.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

const REFRESH_TOKEN_EXPIRY_DAYS =
  Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;

const REFRESH_TOKEN_GRACE_SECONDS =
  Number(process.env.REFRESH_TOKEN_GRACE_SECONDS) || 10;

const MIN_ROTATE_INTERVAL_MS =
  (Number(process.env.REFRESH_ROTATION_MIN_INTERVAL_SECONDS) || 0) * 1000;

// Helpers
const generateRefreshSecret = () =>
  crypto.randomBytes(64).toString("base64url");

const hashRefreshSecret = (secret) =>
  crypto.createHash("sha256").update(secret).digest("hex");

const compareTokenHashes = (incomingHash, storedHash) => {
  if (!incomingHash || !storedHash) return false;

  const a = Buffer.from(incomingHash, "hex");
  const b = Buffer.from(storedHash, "hex");

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
};

const invalidToken = (message = "Invalid refresh token") =>
  new APIERR(HTTP_STATUS.UNAUTHORIZED, message);

const parseRefreshToken = (refreshToken) => {
  if (!refreshToken || typeof refreshToken !== "string") {
    throw invalidToken("Refresh token is required");
  }

  const parts = refreshToken.split(".");

  if (parts.length !== 2) throw invalidToken();

  const [sessionId, secret] = parts;

  if (!mongoose.Types.ObjectId.isValid(sessionId) || !secret) {
    throw invalidToken();
  }

  return { sessionId, secret };
};

const revokeSessionById = (sessionId, reason) =>
  RefreshSession.updateOne(
    { _id: sessionId, revokedAt: null }, // idempotent
    { $set: { revokedAt: new Date(), revokeReason: reason } },
  );


// Create
const createStudentSession = async (student, req) => {
  const secret = generateRefreshSecret();

  const session = await RefreshSession.create({
    student: student._id,
    tokenHash: hashRefreshSecret(secret),
    previousTokenHash: null,
    previousTokenValidUntil: null,
    expiresAt: new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    ),
    lastUsedAt: new Date(),
    lastRotatedAt: null,
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.ip || "",
  });

  return {
    accessToken: student.generateAccessToken(),
    refreshToken: `${session._id.toString()}.${secret}`,
  };
};

/* ---------------- rotate ----------------
 *
 * Returns { accessToken, refreshToken, student }
 *
 * refreshToken === null means the refresh token was NOT rotated:
 *   - grace-window hit (a concurrent request already rotated), or
 *   - minimum rotation interval not yet elapsed.
 * In both cases a fresh access token is issued and the controller must
 * NOT set a cookie, so the existing cookie stays untouched.
 */
const rotateStudentSession = async (refreshToken, req) => {
  const { sessionId, secret } = parseRefreshToken(refreshToken);

  const now = new Date();

  const session = await RefreshSession.findOne({
    _id: sessionId,
    revokedAt: null,
    expiresAt: { $gt: now },
  }).select("+tokenHash +previousTokenHash");

  if (!session) throw invalidToken("Refresh session is expired or revoked");

  const incomingHash = hashRefreshSecret(secret);

  const loadStudent = async () => {
    const student = await Student.findById(session.student);

    if (!student) {
      await revokeSessionById(session._id, "student_not_found");
      throw invalidToken("Student not found");
    }

    return student;
  };

  /* ---- 1. Current token ---- */
  if (compareTokenHashes(incomingHash, session.tokenHash)) {
    const student = await loadStudent();

    /* 1a. Rotated recently: issue an access token only, keep the same refresh token */
    const lastRotation = session.lastRotatedAt || session.createdAt;

    if (
      MIN_ROTATE_INTERVAL_MS > 0 &&
      lastRotation &&
      now.getTime() - new Date(lastRotation).getTime() < MIN_ROTATE_INTERVAL_MS
    ) {
      RefreshSession.updateOne(
        { _id: session._id },
        { $set: { lastUsedAt: now } },
      ).catch(() => {});

      return {
        accessToken: student.generateAccessToken(),
        refreshToken: null,
        student,
      };
    }

    /* 1b. Normal rotation */
    const newSecret = generateRefreshSecret();

    // Atomic compare-and-swap: only one concurrent caller can win.
    const updated = await RefreshSession.findOneAndUpdate(
      {
        _id: session._id,
        tokenHash: session.tokenHash,
        revokedAt: null,
        expiresAt: { $gt: now },
      },
      {
        $set: {
          previousTokenHash: session.tokenHash,
          previousTokenValidUntil: new Date(
            now.getTime() + REFRESH_TOKEN_GRACE_SECONDS * 1000,
          ),
          tokenHash: hashRefreshSecret(newSecret),
          lastUsedAt: now,
          lastRotatedAt: now,
          userAgent: req.headers["user-agent"] || "",
          ipAddress: req.ip || "",
        },
      },
      { new: true },
    );

    // Lost the race. The client retries and will then hit the grace path.
    if (!updated) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Refresh token was already rotated. Please retry.",
      );
    }

    return {
      accessToken: student.generateAccessToken(),
      refreshToken: `${session._id.toString()}.${newSecret}`,
      student,
    };
  }

  /* ---- 2. Previous token inside grace window ---- */
  const isPrevious = compareTokenHashes(
    incomingHash,
    session.previousTokenHash,
  );

  if (
    isPrevious &&
    session.previousTokenValidUntil &&
    session.previousTokenValidUntil > now
  ) {
    const student = await loadStudent();

    return {
      accessToken: student.generateAccessToken(),
      refreshToken: null,
      student,
    };
  }

  /* ---- 3. Anything else = reuse of a stale token ---- */
  await revokeSessionById(session._id, "refresh_token_reuse_detected");

  throw invalidToken("Refresh session is no longer valid");
};

/* ---------------- revoke ---------------- */

const revokeStudentSession = async (refreshToken, reason = "logout") => {
  if (!refreshToken || typeof refreshToken !== "string") return;

  const [sessionId] = refreshToken.split(".");

  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) return;

  await revokeSessionById(sessionId, reason);
};

const revokeAllStudentSessions = async (studentId) => {
  await RefreshSession.updateMany(
    { student: studentId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: "logout_all_devices" } },
  );
};

export {
  createStudentSession,
  rotateStudentSession,
  revokeStudentSession,
  revokeAllStudentSessions,
};
