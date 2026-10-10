import mongoose from "mongoose";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Notification } from "../../models/notification.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { TPO } from "../../models/tpo.models.js";
import {
  ACTOR_MODELS,
  NOTIFICATION_ROLES as R,
  NOTIFICATION_TYPES as T,
  RECIPIENT_MODELS,
} from "../../config/notification.config.js";

/* 
   EVENT CATALOGUE
   role: audience the event is delivered to
   title / message: string or (context) => string
*/

const withReason = (text, reason) =>
  reason ? `${text} Reason: ${reason}` : text;

const atOrganisation = ({ organisationName }) =>
  organisationName ? ` at ${organisationName}` : "";

const EVENT_CONFIG = {
  [T.APPLICATION_SUBMITTED]: {
    role: R.TPO,
    category: "application",
    title: "New application submitted",
    message: ({ studentName }) =>
      `${studentName || "A student"} has submitted an internship application for your review.`,
  },

  [T.APPLICATION_FORWARDED]: {
    role: R.SPOC,
    category: "verification",
    title: "Application awaiting SPOC review",
    message: ({ studentName }) =>
      `The application of ${studentName || "a student"} has been approved by the TPO and is awaiting your review.`,
  },

  [T.TPO_ACCEPTED]: {
    role: R.STUDENT,
    category: "application",
    title: "Application accepted by TPO",
    message:
      "Your internship application has been accepted by the TPO and has been forwarded for the next stage.",
  },

  [T.TPO_REJECTED]: {
    role: R.STUDENT,
    category: "application",
    title: "Application rejected by TPO",
    message: ({ reason }) =>
      withReason(
        "Your internship application has been rejected by the TPO.",
        reason,
      ),
  },

  [T.TPO_UPDATE_REQUIRED]: {
    role: R.STUDENT,
    category: "application",
    title: "Application update required",
    message: ({ reason }) =>
      withReason(
        "The TPO has requested changes to your internship application. Please review your application and update the required information.",
        reason,
      ),
  },

  [T.SPOC_ACCEPTED]: {
    role: R.STUDENT,
    category: "verification",
    title: "Application accepted by SPOC",
    message: "Your internship application has been accepted by the SPOC.",
  },

  [T.SPOC_REJECTED]: {
    role: R.STUDENT,
    category: "verification",
    title: "Application rejected by SPOC",
    message: ({ reason }) =>
      withReason(
        "Your internship application has been rejected by the SPOC.",
        reason,
      ),
  },

  [T.SPOC_UPDATE_REQUIRED]: {
    role: R.STUDENT,
    category: "verification",
    title: "Application update required by SPOC",
    message: ({ reason }) =>
      withReason(
        "The SPOC has requested changes to your internship application. Please review the required updates.",
        reason,
      ),
  },

  [T.NOC_GENERATED]: {
    role: R.STUDENT,
    category: "document",
    title: "NOC generated",
    message: (context) =>
      `Your No Objection Certificate${atOrganisation(context)} has been generated (Ref: ${context.referenceNumber || "-"}) and is now available in your documents.`,
  },

  [T.NOC_BATCH_GENERATED]: {
    role: R.SPOC,
    category: "document",
    title: "NOC generated",
    message: (context) =>
      `NOC ${context.referenceNumber || ""} was generated for ${context.count || 0} student(s)${atOrganisation(context)}.`.replace(
        /\s+/g,
        " ",
      ),
  },
};

// Helpers functions
const render = (value, context) =>
  typeof value === "function" ? value(context) : value;

const validateObjectId = (value, fieldName) => {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, `${fieldName} is invalid`);
  }
};

const assertRole = (role) => {
  if (!RECIPIENT_MODELS[role]) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Notification role is invalid");
  }
};

const uniqueValidIds = (ids = []) =>
  [...new Set(ids.filter(Boolean).map((id) => String(id?._id ?? id)))].filter(
    (id) => mongoose.Types.ObjectId.isValid(id),
  );

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeActor = (actor) => {
  const model = actor?.role && ACTOR_MODELS[actor.role];

  return model && mongoose.Types.ObjectId.isValid(actor.id)
    ? { actor: actor.id, actorModel: model, actorRole: actor.role }
    : { actor: null, actorModel: null, actorRole: null };
};

/**
 * Explicit ids always win. Otherwise TPOs resolve to every active TPO and
 * SPOCs to the active SPOCs of `department`.
 */
const resolveRecipientIds = async ({ role, recipientIds, department }) => {
  if (recipientIds?.length) return uniqueValidIds(recipientIds);

  if (role === R.TPO) {
    const tpos = await TPO.find({ isActive: true }).select("_id").lean();
    return tpos.map((tpo) => String(tpo._id));
  }

  if (role === R.SPOC && department) {
    const spocs = await SPOC.find({ department, isActive: true })
      .select("_id")
      .lean();
    return spocs.map((spoc) => String(spoc._id));
  }

  return [];
};

const insertNotifications = async ({
  role,
  recipientIds,
  application = null,
  actor = null,
  type,
  category,
  title,
  message,
  metadata = {},
}) =>
  Notification.insertMany(
    recipientIds.map((recipient) => ({
      recipient,
      recipientModel: RECIPIENT_MODELS[role],
      recipientRole: role,
      application,
      ...normalizeActor(actor),
      category,
      type,
      title,
      message,
      metadata,
    })),
    { ordered: false },
  );

/**
 * Publishes a catalogued event to its audience.
 *
 * Notifications are a side effect, so this never throws: failures are logged
 * and must not break the business operation that raised the event.
 *
 * @param {object} params
 * @param {string} params.type          One of NOTIFICATION_TYPES.
 * @param {string} [params.application] Related application id.
 * @param {{ id: string, role: string }} [params.actor]
 * @param {string[]} [params.recipientIds] Overrides audience resolution.
 * @param {string} [params.department]  Department code (SPOC audiences).
 * @param {object} [params.context]     Template data, stored as metadata.
 */
export const publishEvent = async ({
  type,
  application = null,
  actor = null,
  recipientIds,
  department,
  context = {},
}) => {
  try {
    const config = EVENT_CONFIG[type];

    if (!config) throw new Error(`Unknown notification event "${type}"`);

    const ids = await resolveRecipientIds({
      role: config.role,
      recipientIds,
      department,
    });

    if (!ids.length) {
      console.warn(`Notification "${type}": no recipients resolved.`);
      return [];
    }

    return await insertNotifications({
      role: config.role,
      recipientIds: ids,
      application,
      actor,
      type,
      category: config.category,
      title: render(config.title, context),
      message: render(config.message, context),
      metadata: context,
    });
  } catch (error) {
    console.error(`Notification "${type}" failed:`, error.message);
    return [];
  }
};

/** Creates a custom (non-catalogued) notification for one recipient. */
export const createNotification = async ({
  role,
  recipient,
  application = null,
  actor = null,
  type,
  category,
  title,
  message,
  metadata = {},
}) => {
  assertRole(role);
  validateObjectId(recipient, "Recipient");

  if (application) validateObjectId(application, "Application");

  const config = EVENT_CONFIG[type];

  if (!type || (!config && (!category || !title || !message))) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Notification type and content are required",
    );
  }

  const [created] = await insertNotifications({
    role,
    recipientIds: [recipient],
    application,
    actor,
    type,
    category: category || config.category,
    title: title || render(config.title, metadata),
    message: message || render(config.message, metadata),
    metadata,
  });

  return created;
};

/*
   QUERIES (shared by TPO / SPOC / student)
*/
export const getNotifications = async ({
  recipient,
  role,
  category,
  status,
  search,
  limit = 200,
}) => {
  assertRole(role);
  validateObjectId(recipient, "Recipient");

  const query = { recipient, recipientRole: role };

  if (category && category !== "all") query.category = category;
  if (status && status !== "all") query.status = status;

  const term = search?.trim();

  if (term) {
    const pattern = { $regex: escapeRegex(term), $options: "i" };
    query.$or = [{ title: pattern }, { message: pattern }];
  }

  return Notification.find(query)
    .populate("application", "status designation organisation")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const markNotificationRead = async ({
  notificationId,
  recipient,
  role,
}) => {
  assertRole(role);
  validateObjectId(notificationId, "Notification");
  validateObjectId(recipient, "Recipient");

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient, recipientRole: role },
    { $set: { status: "read", readAt: new Date() } },
    { new: true },
  );

  if (!notification) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }

  return notification;
};

export const markAllNotificationsRead = async ({ recipient, role }) => {
  assertRole(role);
  validateObjectId(recipient, "Recipient");

  await Notification.updateMany(
    { recipient, recipientRole: role, status: "unread" },
    { $set: { status: "read", readAt: new Date() } },
  );
};

export const deleteNotification = async ({
  notificationId,
  recipient,
  role,
}) => {
  assertRole(role);
  validateObjectId(notificationId, "Notification");
  validateObjectId(recipient, "Recipient");

  const deleted = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient,
    recipientRole: role,
  });

  if (!deleted) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }

  return deleted;
};

export const getUnreadNotificationCount = async ({ recipient, role }) => {
  assertRole(role);
  validateObjectId(recipient, "Recipient");

  return Notification.countDocuments({
    recipient,
    recipientRole: role,
    status: "unread",
  });
};

/*
   BACKWARD-COMPATIBLE STUDENT API
   Keeps existing student controllers working unchanged.
*/

export const createStudentNotification = ({ student, ...rest }) =>
  createNotification({
    role: R.STUDENT,
    recipient: student,
    application: rest.application,
    actor: rest.actor ? { id: rest.actor, role: rest.actorRole } : null,
    type: rest.type,
    title: rest.title,
    message: rest.message,
  });

export const createApplicationNotification = ({
  application,
  student,
  actor,
  actorRole,
  type,
}) =>
  publishEvent({
    type,
    application,
    actor: actor ? { id: actor, role: actorRole } : null,
    recipientIds: [student],
  });

export const createNOCNotification = ({
  application,
  student,
  actor,
  actorRole,
}) =>
  publishEvent({
    type: T.NOC_GENERATED,
    application,
    actor: actor ? { id: actor, role: actorRole } : null,
    recipientIds: [student],
  });

export const getStudentNotifications = ({ student, ...filters }) =>
  getNotifications({ recipient: student, role: R.STUDENT, ...filters });

export const markStudentNotificationRead = ({ notificationId, student }) =>
  markNotificationRead({ notificationId, recipient: student, role: R.STUDENT });

export const markAllStudentNotificationsRead = (student) =>
  markAllNotificationsRead({ recipient: student, role: R.STUDENT });

export const deleteStudentNotification = ({ notificationId, student }) =>
  deleteNotification({ notificationId, recipient: student, role: R.STUDENT });

export const getUnreadStudentNotificationCount = (student) =>
  getUnreadNotificationCount({ recipient: student, role: R.STUDENT });
