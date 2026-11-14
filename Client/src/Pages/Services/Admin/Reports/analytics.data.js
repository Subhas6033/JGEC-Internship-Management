export const analyticsSummary = {
  "30d": {
    totalStudents: 1248,
    applications: 186,
    placementRate: 68.4,
    activeDrives: 8,
    studentChange: "+4.8%",
    applicationChange: "+12.5%",
    placementChange: "+3.2%",
    driveChange: "+2",
  },
  "90d": {
    totalStudents: 1248,
    applications: 524,
    placementRate: 65.8,
    activeDrives: 8,
    studentChange: "+6.2%",
    applicationChange: "+15.8%",
    placementChange: "+4.1%",
    driveChange: "+3",
  },
  "12m": {
    totalStudents: 1248,
    applications: 1842,
    placementRate: 68.4,
    activeDrives: 8,
    studentChange: "+9.4%",
    applicationChange: "+21.6%",
    placementChange: "+8.3%",
    driveChange: "+5",
  },
};

export const applicationTrendData = {
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    applications: [32, 45, 39, 70],
    approved: [18, 28, 25, 46],
  },
  "90d": {
    labels: ["Aug", "Sep", "Oct"],
    applications: [142, 168, 214],
    approved: [88, 112, 146],
  },
  "12m": {
    labels: [
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    applications: [95, 112, 124, 138, 145, 132, 156, 164, 142, 168, 214, 252],
    approved: [58, 72, 78, 86, 91, 84, 98, 105, 88, 112, 146, 170],
  },
};

export const applicationStatusData = {
  labels: ["Approved", "Pending", "Rejected", "Withdrawn"],
  values: [680, 245, 142, 75],
};

export const departmentDistributionData = {
  labels: ["CSE", "ECE", "IT", "ME", "CE", "EE"],
  values: [280, 230, 210, 190, 175, 163],
};

export const drivePerformanceData = {
  labels: ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini"],
  applications: [185, 156, 132, 118, 96],
  selected: [42, 38, 31, 27, 22],
};

export const recentActivities = [
  {
    _id: "ACT001",
    activity: "New internship drive published",
    description: "TCS Internship 2026",
    category: "Drive",
    date: "11 Nov 2026",
    status: "Completed",
  },
  {
    _id: "ACT002",
    activity: "Applications approved",
    description: "32 student applications approved",
    category: "Applications",
    date: "10 Nov 2026",
    status: "Completed",
  },
  {
    _id: "ACT003",
    activity: "NOC dispatch completed",
    description: "18 NOCs sent to students",
    category: "NOC",
    date: "09 Nov 2026",
    status: "Completed",
  },
  {
    _id: "ACT004",
    activity: "Department data updated",
    description: "Computer Science and Engineering",
    category: "Department",
    date: "08 Nov 2026",
    status: "Completed",
  },
  {
    _id: "ACT005",
    activity: "Pending applications require review",
    description: "12 applications awaiting verification",
    category: "Applications",
    date: "07 Nov 2026",
    status: "Pending",
  },
];
