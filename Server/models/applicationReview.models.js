import mongoose from "mongoose";

const applicationReviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewerRole: {
      type: String,
      enum: ["TPO", "SPOC"],
      required: true,
    },
    decision: {
      type: String,
      enum: ["approved", "rejected", "update_required"],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    previousStatus: {
      type: String,
      required: true,
    },
    nextStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

applicationReviewSchema.index({
  application: 1,
  createdAt: -1,
});

export const ApplicationReview = mongoose.model(
  "ApplicationReview",
  applicationReviewSchema,
);
