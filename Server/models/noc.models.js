import mongoose from "mongoose";

const nocSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
      index: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      // unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
    academicYear: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileMimeType: {
      type: String,
      default: "application/pdf",
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["generated", "revoked"],
      default: "generated",
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokeReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const NOC = mongoose.model("NOC", nocSchema);
