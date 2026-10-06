import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const studentDocumentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
      index: true,
    },
    signature: {
      type: uploadedFileSchema,
      default: () => ({}),
    },
    resume: {
      type: uploadedFileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

export const StudentDocument = mongoose.model(
  "StudentDocument",
  studentDocumentSchema,
);
