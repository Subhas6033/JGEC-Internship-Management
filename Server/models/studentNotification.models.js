import mongoose from "mongoose";

const studentNotificationSchema = new mongoose.Schema(
  {
    // Student receiving the notification
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    // Related internship application, when applicable
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      default: null,
      index: true,
    },
    // Who caused the notification
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "actorModel",
      default: null,
    },
    actorModel: {
      type: String,
      enum: ["Student", "TPO", "SPOC", "Admin"],
      default: null,
    },
    actorRole: {
      type: String,
      enum: ["student", "tpo", "spoc", "admin", null],
      default: null,
    },
    // UI category
    category: {
      type: String,
      enum: ["application", "verification", "document", "internship"],
      required: true,
      index: true,
    },
    // Machine-readable event
    type: {
      type: String,
      enum: [
        "tpo_accepted",
        "tpo_rejected",
        "tpo_update_required",

        "spoc_accepted",
        "spoc_rejected",
        "spoc_update_required",

        "noc_generated",
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

studentNotificationSchema.index({
  student: 1,
  createdAt: -1,
});

studentNotificationSchema.index({
  student: 1,
  status: 1,
  createdAt: -1,
});

export const StudentNotification = mongoose.model(
  "StudentNotification",
  studentNotificationSchema,
);
