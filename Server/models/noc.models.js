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
    // tells the application where the file is stored.
    storageProvider: {
      type: String,
      enum: ["local", "google_drive"],
      default: "google_drive",
      required: true,
    },
    // Google Drive file ID for newly uploaded PDFs.
    driveFileId: {
      type: String,
      default: null,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    // Retained for compatibility; for Drive files this is the Drive ID.
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
    // No public Drive URL is needed.
    fileUrl: {
      type: String,
      default: null,
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
      min: 0,
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
