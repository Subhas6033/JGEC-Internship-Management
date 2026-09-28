export const notificationTypes = {
  APPLICATION: "application",
  DEADLINE: "deadline",
  APPROVAL: "approval",
  TPO: "tpo",
  SYSTEM: "system",
};

export const notifications = [
  {
    id: "NTF-001",
    type: notificationTypes.APPLICATION,
    title: "New internship applications received",
    message:
      "3 students have submitted applications for the Software Engineer Intern position at TCS.",
    time: "10 minutes ago",
    date: "28 Sep 2026",
    read: false,
    company: "TCS",
    applicationCount: 3,
  },

  {
    id: "NTF-002",
    type: notificationTypes.DEADLINE,
    title: "Application deadline is approaching",
    message:
      "The application deadline for Infosys is tomorrow. Review pending applications before the deadline.",
    time: "1 hour ago",
    date: "28 Sep 2026",
    read: false,
    company: "Infosys",
    applicationCount: 4,
  },

  {
    id: "NTF-003",
    type: notificationTypes.APPROVAL,
    title: "Applications approved successfully",
    message:
      "2 student applications for Wipro have been approved and are ready to be forwarded to the central TPO.",
    time: "3 hours ago",
    date: "28 Sep 2026",
    read: false,
    company: "Wipro",
    applicationCount: 2,
  },

  {
    id: "NTF-004",
    type: notificationTypes.TPO,
    title: "Central TPO reviewed applications",
    message:
      "The central TPO has acknowledged the applications forwarded by your department.",
    time: "Yesterday",
    date: "27 Sep 2026",
    read: true,
    company: "Accenture",
    applicationCount: 5,
  },

  {
    id: "NTF-005",
    type: notificationTypes.DEADLINE,
    title: "Application deadline has passed",
    message:
      "The application window for Cognizant has closed. New student applications can no longer be submitted.",
    time: "Yesterday",
    date: "27 Sep 2026",
    read: true,
    company: "Cognizant",
    applicationCount: 6,
  },

  {
    id: "NTF-006",
    type: notificationTypes.APPLICATION,
    title: "New application received",
    message:
      "A new internship application has been submitted for the Frontend Developer Intern position at Infosys.",
    time: "2 days ago",
    date: "26 Sep 2026",
    read: true,
    company: "Infosys",
    applicationCount: 1,
  },

  {
    id: "NTF-007",
    type: notificationTypes.TPO,
    title: "Applications forwarded to central TPO",
    message:
      "The approved applications for TCS have been successfully forwarded to the central TPO for further processing.",
    time: "3 days ago",
    date: "25 Sep 2026",
    read: true,
    company: "TCS",
    applicationCount: 3,
  },

  {
    id: "NTF-008",
    type: notificationTypes.SYSTEM,
    title: "Department TPO profile updated",
    message:
      "Your Department TPO profile information was successfully updated.",
    time: "5 days ago",
    date: "23 Sep 2026",
    read: true,
  },
];
