export const APPLICATION_STATUSES = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const APPLICATION_TYPES = {
  SUMMER: "summer",
  WINTER: "winter",
  FULL_TIME: "full_time",
};

export const applications = [
  {
    id: "APP-2026-001",
    company: "TCS",
    role: "Software Engineering Intern",
    type: APPLICATION_TYPES.SUMMER,
    location: "Kolkata, West Bengal",
    mode: "Hybrid",
    submittedAt: "18 Sep 2026",
    status: APPLICATION_STATUSES.UNDER_REVIEW,

    timeline: [
      {
        title: "Application submitted",
        description: "Your application was successfully submitted.",
        date: "18 Sep 2026",
        completed: true,
      },
      {
        title: "Documents verified",
        description: "Your submitted documents have been verified.",
        date: "19 Sep 2026",
        completed: true,
      },
      {
        title: "Department review",
        description: "Your application is currently being reviewed.",
        date: "20 Sep 2026",
        completed: true,
        current: true,
      },
      {
        title: "Final decision",
        description: "The final application decision is pending.",
        date: null,
        completed: false,
      },
    ],
  },

  {
    id: "APP-2026-002",
    company: "Wipro",
    role: "Frontend Development Intern",
    type: APPLICATION_TYPES.SUMMER,
    location: "Bengaluru, Karnataka",
    mode: "Remote",
    submittedAt: "11 Sep 2026",
    status: APPLICATION_STATUSES.APPROVED,

    timeline: [
      {
        title: "Application submitted",
        description: "Your application was successfully submitted.",
        date: "11 Sep 2026",
        completed: true,
      },
      {
        title: "Documents verified",
        description: "Your submitted documents have been verified.",
        date: "12 Sep 2026",
        completed: true,
      },
      {
        title: "Department review",
        description: "Your application passed the department review.",
        date: "14 Sep 2026",
        completed: true,
      },
      {
        title: "Application approved",
        description: "Your internship application has been approved.",
        date: "16 Sep 2026",
        completed: true,
        current: true,
      },
    ],
  },

  {
    id: "APP-2026-003",
    company: "Tech Mahindra",
    role: "Data Analytics Intern",
    type: APPLICATION_TYPES.WINTER,
    location: "Pune, Maharashtra",
    mode: "On-site",
    submittedAt: "05 Sep 2026",
    status: APPLICATION_STATUSES.SUBMITTED,

    timeline: [
      {
        title: "Application submitted",
        description: "Your application was successfully submitted.",
        date: "05 Sep 2026",
        completed: true,
        current: true,
      },
      {
        title: "Documents verified",
        description: "Document verification has not started yet.",
        date: null,
        completed: false,
      },
      {
        title: "Department review",
        description: "Department review will begin after verification.",
        date: null,
        completed: false,
      },
      {
        title: "Final decision",
        description: "The final application decision is pending.",
        date: null,
        completed: false,
      },
    ],
  },

  {
    id: "APP-2026-004",
    company: "Infosys",
    role: "Cloud Engineering Intern",
    type: APPLICATION_TYPES.FULL_TIME,
    location: "Hyderabad, Telangana",
    mode: "Hybrid",
    submittedAt: "28 Aug 2026",
    status: APPLICATION_STATUSES.REJECTED,

    timeline: [
      {
        title: "Application submitted",
        description: "Your application was successfully submitted.",
        date: "28 Aug 2026",
        completed: true,
      },
      {
        title: "Documents verified",
        description: "Your submitted documents have been verified.",
        date: "29 Aug 2026",
        completed: true,
      },
      {
        title: "Department review",
        description: "Your application was reviewed by the department.",
        date: "02 Sep 2026",
        completed: true,
      },
      {
        title: "Application closed",
        description: "The application was not approved.",
        date: "04 Sep 2026",
        completed: true,
        current: true,
      },
    ],
  },
];
