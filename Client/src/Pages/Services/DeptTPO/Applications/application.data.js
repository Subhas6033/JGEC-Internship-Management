export const APPLICATION_STATUS = {
  PENDING_DEPARTMENT_REVIEW: "pending_department_review",
  DEPARTMENT_ACCEPTED: "department_accepted",
  DEPARTMENT_REJECTED: "department_rejected",
  SENT_TO_TPO: "sent_to_tpo",
  TPO_ACCEPTED: "tpo_accepted",
  TPO_REJECTED: "tpo_rejected",
  SENT_TO_ADMIN: "sent_to_admin",
};

export const COMPANY_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
};

export const applicationGroups = [
  {
    id: "COMP-001",

    company: {
      name: "TCS",
      role: "Software Engineer Intern",
      location: "Kolkata, West Bengal",
      mode: "Hybrid",
    },

    deadline: "2026-10-05T23:59:00",

    status: COMPANY_STATUS.OPEN,

    students: [
      {
        id: "APP-001",
        name: "Arjun Das",
        rollNumber: "CSE2022001",
        department: "Computer Science & Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-24",
        status: APPLICATION_STATUS.PENDING_DEPARTMENT_REVIEW,
      },
      {
        id: "APP-002",
        name: "Rahul Sharma",
        rollNumber: "CSE2022012",
        department: "Computer Science & Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-25",
        status: APPLICATION_STATUS.PENDING_DEPARTMENT_REVIEW,
      },
      {
        id: "APP-003",
        name: "Priya Das",
        rollNumber: "IT2022010",
        department: "Information Technology",
        semester: "8th Semester",
        appliedAt: "2026-09-26",
        status: APPLICATION_STATUS.DEPARTMENT_ACCEPTED,
      },
      {
        id: "APP-004",
        name: "Amit Roy",
        rollNumber: "ECE2022022",
        department: "Electronics & Communication Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-26",
        status: APPLICATION_STATUS.DEPARTMENT_REJECTED,
      },
    ],
  },

  {
    id: "COMP-002",

    company: {
      name: "Infosys",
      role: "Frontend Developer Intern",
      location: "Bengaluru, Karnataka",
      mode: "On-site",
    },

    deadline: "2026-10-08T23:59:00",

    status: COMPANY_STATUS.OPEN,

    students: [
      {
        id: "APP-005",
        name: "Sneha Paul",
        rollNumber: "CSE2022042",
        department: "Computer Science & Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-25",
        status: APPLICATION_STATUS.PENDING_DEPARTMENT_REVIEW,
      },
      {
        id: "APP-006",
        name: "Amit Sen",
        rollNumber: "CSE2022017",
        department: "Computer Science & Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-27",
        status: APPLICATION_STATUS.DEPARTMENT_ACCEPTED,
      },
      {
        id: "APP-007",
        name: "Riya Roy",
        rollNumber: "IT2022030",
        department: "Information Technology",
        semester: "8th Semester",
        appliedAt: "2026-09-27",
        status: APPLICATION_STATUS.SENT_TO_TPO,
      },
    ],
  },

  {
    id: "COMP-003",

    company: {
      name: "Wipro",
      role: "Embedded Systems Intern",
      location: "Hyderabad, Telangana",
      mode: "Hybrid",
    },

    deadline: "2026-09-30T23:59:00",

    status: COMPANY_STATUS.CLOSED,

    students: [
      {
        id: "APP-008",
        name: "Rahul Roy",
        rollNumber: "ECE2022011",
        department: "Electronics & Communication Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-20",
        status: APPLICATION_STATUS.SENT_TO_TPO,
      },
      {
        id: "APP-009",
        name: "Sourav Das",
        rollNumber: "ECE2022020",
        department: "Electronics & Communication Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-21",
        status: APPLICATION_STATUS.DEPARTMENT_REJECTED,
      },
    ],
  },

  {
    id: "COMP-004",

    company: {
      name: "Accenture",
      role: "Full Stack Developer Intern",
      location: "Pune, Maharashtra",
      mode: "Hybrid",
    },

    deadline: "2026-10-12T23:59:00",

    status: COMPANY_STATUS.OPEN,

    students: [
      {
        id: "APP-010",
        name: "Neha Sharma",
        rollNumber: "CSE2022049",
        department: "Computer Science & Engineering",
        semester: "8th Semester",
        appliedAt: "2026-09-28",
        status: APPLICATION_STATUS.PENDING_DEPARTMENT_REVIEW,
      },
      {
        id: "APP-011",
        name: "Kunal Roy",
        rollNumber: "IT2022041",
        department: "Information Technology",
        semester: "8th Semester",
        appliedAt: "2026-09-28",
        status: APPLICATION_STATUS.PENDING_DEPARTMENT_REVIEW,
      },
    ],
  },
];
