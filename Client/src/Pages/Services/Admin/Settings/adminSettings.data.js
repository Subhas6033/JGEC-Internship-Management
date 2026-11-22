const initialPreferences = {
  emailNotifications: true,
  applicationNotifications: true,
  nocNotifications: true,
  driveNotifications: true,
  loginAlerts: true,
  weeklyReports: false,
  compactDashboard: false,
};

const initialLoginActivity = [
  {
    _id: "LOGIN001",
    device: "Chrome on Linux",
    browser: "Chrome",
    location: "Siliguri, West Bengal, India",
    ipAddress: "192.168.1.10",
    date: "11 Nov 2026, 11:34 AM",
    status: "Current",
  },
  {
    _id: "LOGIN002",
    device: "Firefox on Windows",
    browser: "Firefox",
    location: "Jalpaiguri, West Bengal, India",
    ipAddress: "192.168.1.12",
    date: "10 Nov 2026, 04:20 PM",
    status: "Successful",
  },
  {
    _id: "LOGIN003",
    device: "Chrome on Android",
    browser: "Chrome Mobile",
    location: "Siliguri, West Bengal, India",
    ipAddress: "192.168.1.15",
    date: "08 Nov 2026, 09:15 AM",
    status: "Successful",
  },
  {
    _id: "LOGIN004",
    device: "Unknown device",
    browser: "Unknown",
    location: "Unknown",
    ipAddress: "203.0.113.10",
    date: "06 Nov 2026, 08:40 PM",
    status: "Failed",
  },
];

const initialWorkActivity = [
  {
    _id: "WORK001",
    action: "Student account updated",
    description: "Updated student profile of Aarav Sharma",
    category: "Students",
    date: "11 Nov 2026, 10:45 AM",
    status: "Completed",
  },
  {
    _id: "WORK002",
    action: "Internship drive published",
    description: "Published TCS Internship 2026",
    category: "Internship Drives",
    date: "10 Nov 2026, 03:20 PM",
    status: "Completed",
  },
  {
    _id: "WORK003",
    action: "NOC dispatched",
    description: "Dispatched 18 approved NOCs",
    category: "NOC Management",
    date: "09 Nov 2026, 12:10 PM",
    status: "Completed",
  },
  {
    _id: "WORK004",
    action: "Department updated",
    description: "Updated Computer Science and Engineering",
    category: "Departments",
    date: "08 Nov 2026, 11:30 AM",
    status: "Completed",
  },
  {
    _id: "WORK005",
    action: "Staff account created",
    description: "Registered a new departmental SPOC",
    category: "Staff Management",
    date: "07 Nov 2026, 02:15 PM",
    status: "Completed",
  },
];

const settingsTabs = [
  {
    id: "profile",
    label: "Profile",
    icon: "UserRound",
    comingSoon: false,
  },
  {
    id: "security",
    label: "Security",
    icon: "ShieldCheck",
    comingSoon: true,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: "SlidersHorizontal",
    comingSoon: true,
  },
  {
    id: "login",
    label: "Login Activity",
    icon: "Monitor",
    comingSoon: true,
  },
  {
    id: "activity",
    label: "Work Activity",
    icon: "History",
    comingSoon: true,
  },
];

export {
  initialPreferences,
  initialLoginActivity,
  initialWorkActivity,
  settingsTabs,
};
