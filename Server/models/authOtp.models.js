import mongoose from "mongoose";

const authOtpSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "TPO", "SPOC", "Admin"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: ["LOGIN"],
      default: "LOGIN",
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    resendAvailableAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "LOCKED", "EXPIRED"],
      default: "PENDING",
    },
    consumedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Automatically remove expired challenges.
authOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthOTP = mongoose.model("AuthOTP", authOtpSchema);
