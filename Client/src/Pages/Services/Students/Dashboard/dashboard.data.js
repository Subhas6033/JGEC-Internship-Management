export const dashboardStats = [
  {
    id: "applications",
    label: "Applications",
    value: 2,
    icon: "file",
  },
  {
    id: "pending",
    label: "Pending Review",
    value: 1,
    icon: "clock",
  },
  {
    id: "approved",
    label: "Approved",
    value: 1,
    icon: "approved",
  },
  {
    id: "documents",
    label: "Documents",
    value: "4/5",
    icon: "documents",
  },
];

export const currentApplication = {
  company: "TCS",
  role: "Software Engineering Intern",
  status: "TPO Review",
  submittedDate: "24 September 2026",
  steps: [
    {
      id: 1,
      label: "Application Submitted",
      status: "completed",
    },
    {
      id: 2,
      label: "Department Verified",
      status: "completed",
    },
    {
      id: 3,
      label: "TPO Review",
      status: "current",
    },
    {
      id: 4,
      label: "Approved",
      status: "upcoming",
    },
  ],
};

export const recentApplications = [
  {
    id: "APP-001",
    company: "TCS",
    role: "Software Engineering Intern",
    status: "Approved",
    date: "24 Sep 2026",
  },
  {
    id: "APP-002",
    company: "TATA Power",
    role: "Frontend Developer Intern",
    status: "Pending Review",
    date: "26 Sep 2026",
  },
];

export const requiredDocuments = [
  {
    id: "resume",
    name: "Resume",
    status: "completed",
  },
  {
    id: "signature",
    name: "Student Signature",
    status: "completed",
  },
  {
    id: "declaration",
    name: "Student Declaration",
    status: "completed",
  },
  {
    id: "noc",
    name: "NOC",
    status: "pending",
  },
];

export const recentNotifications = [
  {
    id: "N-001",
    message: "Your application at TCS was approved.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "N-002",
    message: "Department verification has been completed.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "N-003",
    message: "A new internship opportunity is available.",
    time: "2 days ago",
    unread: false,
  },
];

export const upcomingDeadlines = [
  {
    id: "D-001",
    date: "30 Sep",
    title: "Department verification",
    description: "Complete pending verification requirements.",
  },
  {
    id: "D-002",
    date: "05 Oct",
    title: "Internship document submission",
    description: "Submit the required joining documents.",
  },
];
