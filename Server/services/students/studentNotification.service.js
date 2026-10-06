import mongoose from "mongoose";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { StudentNotification } from "../../models/studentNotification.models.js";

const EVENT_CONFIG = {
  tpo_accepted: {
    category: "application",
    title: "Application accepted by TPO",
    message:
      "Your internship application has been accepted by the TPO and has been forwarded for the next stage.",
  },

  tpo_rejected: {
    category: "application",
    title: "Application rejected by TPO",
    message: "Your internship application has been rejected by the TPO.",
  },

  tpo_update_required: {
    category: "application",
    title: "Application update required",
    message:
      "The TPO has requested changes to your internship application. Please review your application and update the required information.",
  },

  spoc_accepted: {
    category: "verification",
    title: "Application accepted by SPOC",
    message: "Your internship application has been accepted by the SPOC.",
  },

  spoc_rejected: {
    category: "verification",
    title: "Application rejected by SPOC",
    message: "Your internship application has been rejected by the SPOC.",
  },

  spoc_update_required: {
    category: "verification",
    title: "Application update required by SPOC",
    message:
      "The SPOC has requested changes to your internship application. Please review the required updates.",
  },

  noc_generated: {
    category: "document",
    title: "NOC generated",
    message:
      "Your No Objection Certificate has been generated successfully and is now available in your documents.",
  },
};

const validateObjectId = (value, fieldName) => {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, `${fieldName} is invalid`);
  }
};

export const createStudentNotification = async ({
  student,
  application = null,
  actor = null,
  actorModel = null,
  actorRole = null,
  type,
  title,
  message,
}) => {
  validateObjectId(student, "Student");

  if (application) {
    validateObjectId(application, "Application");
  }

  if (!type) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Notification type is required");
  }

  const config = EVENT_CONFIG[type];

  if (!config && (!title || !message)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Notification configuration is missing",
    );
  }

  return StudentNotification.create({
    student,

    application,

    actor,

    actorModel,

    actorRole,

    category: config?.category || "application",

    type,

    title: title || config.title,

    message: message || config.message,

    status: "unread",
  });
};

export const createApplicationNotification = async ({
  application,
  student,
  actor,
  actorModel,
  actorRole,
  type,
}) => {
  return createStudentNotification({
    student,
    application,
    actor,
    actorModel,
    actorRole,
    type,
  });
};

export const createNOCNotification = async ({
  application,
  student,
  actor = null,
  actorModel = null,
  actorRole = null,
}) => {
  return createStudentNotification({
    student,
    application,
    actor,
    actorModel,
    actorRole,
    type: "noc_generated",
  });
};

export const getStudentNotifications = async ({
  student,
  category,
  status,
  search,
}) => {
  validateObjectId(student, "Student");

  const query = {
    student,
  };

  if (category && category !== "all") {
    query.category = category;
  }

  if (status && status !== "all") {
    query.status = status;
  }

  if (search?.trim()) {
    const normalizedSearch = search.trim();

    query.$or = [
      {
        title: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
      {
        message: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
    ];
  }

  return StudentNotification.find(query)
    .populate("application", "status designation organisation")
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const markStudentNotificationRead = async ({
  notificationId,
  student,
}) => {
  validateObjectId(notificationId, "Notification");

  validateObjectId(student, "Student");

  const notification = await StudentNotification.findOneAndUpdate(
    {
      _id: notificationId,
      student,
    },
    {
      $set: {
        status: "read",
        readAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!notification) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }

  return notification;
};

export const markAllStudentNotificationsRead = async (student) => {
  validateObjectId(student, "Student");

  await StudentNotification.updateMany(
    {
      student,
      status: "unread",
    },
    {
      $set: {
        status: "read",
        readAt: new Date(),
      },
    },
  );
};

export const deleteStudentNotification = async ({
  notificationId,
  student,
}) => {
  validateObjectId(notificationId, "Notification");

  validateObjectId(student, "Student");

  const deleted = await StudentNotification.findOneAndDelete({
    _id: notificationId,
    student,
  });

  if (!deleted) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }

  return deleted;
};

export const getUnreadStudentNotificationCount = async (student) => {
  validateObjectId(student, "Student");

  return StudentNotification.countDocuments({
    student,
    status: "unread",
  });
};
