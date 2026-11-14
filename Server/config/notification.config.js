/**
 * Single source of truth for notification roles, categories and event types.
 * Consumed by the Notification model, the notification service and any
 * module that publishes events.
 */
export const NOTIFICATION_ROLES = Object.freeze({
  STUDENT: "student",
  TPO: "tpo",
  SPOC: "spoc",
});

/** Role -> Mongoose model name (used by `refPath` on `recipient`). */
export const RECIPIENT_MODELS = Object.freeze({
  student: "Student",
  tpo: "TPO",
  spoc: "SPOC",
});

/** Actors may additionally be admins. */
export const ACTOR_MODELS = Object.freeze({
  ...RECIPIENT_MODELS,
  admin: "Admin",
});

export const NOTIFICATION_CATEGORIES = Object.freeze([
  "application",
  "verification",
  "document",
  "internship",
  "system",
]);

export const NOTIFICATION_TYPES = Object.freeze({
  APPLICATION_SUBMITTED: "application_submitted",
  APPLICATION_FORWARDED: "application_forwarded",
  TPO_ACCEPTED: "tpo_accepted",
  TPO_REJECTED: "tpo_rejected",
  TPO_UPDATE_REQUIRED: "tpo_update_required",
  SPOC_ACCEPTED: "spoc_accepted",
  SPOC_REJECTED: "spoc_rejected",
  SPOC_UPDATE_REQUIRED: "spoc_update_required",
  NOC_GENERATED: "noc_generated",
  NOC_BATCH_GENERATED: "noc_batch_generated",
  // Sent to the TPO when a SPOC acts on an application
  SPOC_APPROVED_NOTICE: "spoc_approved_notice",
  SPOC_REJECTED_NOTICE: "spoc_rejected_notice",
  SPOC_UPDATE_REQUIRED_NOTICE: "spoc_update_required_notice",
  NOC_GENERATED_NOTICE: "noc_generated_notice",
});
