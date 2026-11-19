import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // Actual registered Mongoose model name
    userModel: {
      type: String,
      required: true,
      index: true,
      enum: ["Student", "TPO", "SPOC", "Admin"],
    },
    // Role supplied by the frontend
    role: {
      type: String,
      required: true,
      enum: ["student", "TPO", "SPOC", "admin"],
    },
    // SHA-256 hash of the original reset token
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = mongoose.model(
  "PasswordReset",
  passwordResetSchema,
);
