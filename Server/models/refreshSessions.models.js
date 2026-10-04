import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },
    previousTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    previousTokenValidUntil: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    revokeReason: {
      type: String,
      default: "",
      trim: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    lastRotatedAt: {
      type: Date,
      default: null,
    },
    userAgent: {
      type: String,
      default: "",
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * MongoDB automatically removes expired sessions.
 */
refreshSessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const RefreshSession = mongoose.model(
  "RefreshSession",
  refreshSessionSchema,
);
