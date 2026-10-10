import mongoose from "mongoose";
import {
  ACTOR_MODELS,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_ROLES,
  NOTIFICATION_TYPES,
  RECIPIENT_MODELS,
} from "../config/notification.config.js";

/**
 * Role-agnostic notification. One document per recipient, so read/unread
 * state and deletion are tracked independently for every user.
 */
const notificationSchema = new mongoose.Schema(
  {
    // User receiving the notification (Student, TPO or SPOC)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      enum: Object.values(RECIPIENT_MODELS),
      required: true,
    },
    recipientRole: {
      type: String,
      enum: Object.values(NOTIFICATION_ROLES),
      required: true,
    },

    // Related internship application, when applicable
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      default: null,
      index: true,
    },

    // Who triggered the event
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "actorModel",
      default: null,
    },
    actorModel: {
      type: String,
      enum: [...Object.values(ACTOR_MODELS), null],
      default: null,
    },
    actorRole: {
      type: String,
      enum: [...Object.keys(ACTOR_MODELS), null],
      default: null,
    },

    category: {
      type: String,
      enum: NOTIFICATION_CATEGORIES,
      required: true,
      index: true,
    },

    // Machine-readable event name
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // Event context (reference number, reason, organisation, ...)
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, recipientRole: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
