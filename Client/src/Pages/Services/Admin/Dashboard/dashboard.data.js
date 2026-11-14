import {
  Building2,
  GraduationCap,
  FileCheck2,
  BriefcaseBusiness,
  Users,
  Clock3,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

export const overviewStats = [
  {
    title: "Total Students",
    value: "2,480",
    change: "+12.5%",
    description: "Compared to last session",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Registered Companies",
    value: "86",
    change: "+8.2%",
    description: "Across all industries",
    icon: Building2,
    color: "indigo",
  },
  {
    title: "Active Internships",
    value: "124",
    change: "+18.4%",
    description: "Currently available",
    icon: BriefcaseBusiness,
    color: "green",
  },
  {
    title: "Pending NOCs",
    value: "32",
    change: "Needs attention",
    description: "Awaiting administration",
    icon: FileCheck2,
    color: "amber",
  },
  {
    title: "Total Applications",
    value: "1,842",
    change: "+14.6%",
    description: "This academic session",
    icon: Users,
    color: "violet",
  },
  {
    title: "Selected Students",
    value: "486",
    change: "+9.8%",
    description: "Successfully selected",
    icon: UserCheck,
    color: "green",
  },
  {
    title: "Pending Applications",
    value: "218",
    change: "Under review",
    description: "Across all companies",
    icon: Clock3,
    color: "amber",
  },
  {
    title: "Active TPOs",
    value: "12",
    change: "All departments",
    description: "Department coordinators",
    icon: CheckCircle2,
    color: "blue",
  },
];

export const internshipTrends = [
  { month: "Jan", applications: 120, selections: 45 },
  { month: "Feb", applications: 180, selections: 65 },
  { month: "Mar", applications: 150, selections: 80 },
  { month: "Apr", applications: 240, selections: 110 },
  { month: "May", applications: 210, selections: 95 },
  { month: "Jun", applications: 300, selections: 145 },
  { month: "Jul", applications: 260, selections: 120 },
  { month: "Aug", applications: 360, selections: 180 },
  { month: "Sep", applications: 320, selections: 160 },
  { month: "Oct", applications: 420, selections: 210 },
  { month: "Nov", applications: 380, selections: 190 },
  { month: "Dec", applications: 460, selections: 240 },
];

export const departmentStats = [
  { name: "Computer Science", students: 420, selected: 128 },
  { name: "Information Technology", students: 360, selected: 105 },
  { name: "Electronics", students: 390, selected: 86 },
  { name: "Electrical", students: 340, selected: 72 },
  { name: "Mechanical", students: 410, selected: 65 },
  { name: "Civil", students: 320, selected: 30 },
  { name: "Food Technology", students: 240, selected: 24 },
];

export const pendingNOCs = [
  {
    id: "NOC-2026-041",
    student: "Aarav Sharma",
    department: "CSE",
    company: "Google",
    submitted: "Today",
    status: "Pending",
  },
  {
    id: "NOC-2026-040",
    student: "Priya Das",
    department: "IT",
    company: "Microsoft",
    submitted: "Yesterday",
    status: "Pending",
  },
  {
    id: "NOC-2026-039",
    student: "Rahul Roy",
    department: "ECE",
    company: "TCS",
    submitted: "2 days ago",
    status: "Under Review",
  },
  {
    id: "NOC-2026-038",
    student: "Sneha Paul",
    department: "EE",
    company: "Infosys",
    submitted: "3 days ago",
    status: "Pending",
  },
];

export const recentActivities = [
  {
    title: "New company registered",
    description: "Accenture was added to the company directory.",
    time: "10 minutes ago",
    type: "company",
  },
  {
    title: "NOC approved",
    description: "NOC-2026-036 was approved by administration.",
    time: "35 minutes ago",
    type: "success",
  },
  {
    title: "New student registered",
    description: "A student account was successfully created.",
    time: "1 hour ago",
    type: "student",
  },
  {
    title: "Internship opportunity published",
    description: "A new opportunity was published by Microsoft.",
    time: "3 hours ago",
    type: "internship",
  },
];
