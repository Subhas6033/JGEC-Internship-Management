import mongoose from "mongoose";

const studentNocSchema = new mongoose.Schema(
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
    nocId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    generatedForStatus: {
      type: String,
      enum: ["approved_by_spoc", "accepted"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StudentNOC = mongoose.model("StudentNOC", studentNocSchema);
