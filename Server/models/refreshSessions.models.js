import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "TPO", "SPOC", "Admin"],
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
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    replacedBy: {
      type: String,
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

refreshSessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

export const RefreshSession = mongoose.model(
  "RefreshSession",
  refreshSessionSchema,
);
