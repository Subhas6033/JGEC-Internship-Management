export const initialDrives = [
  {
    _id: "1",
    title: "Frontend Developer Intern",
    company: "Tech Solutions Pvt. Ltd.",
    location: "Kolkata",
    type: "Paid",
    stipend: "₹15,000/month",
    deadline: "2026-12-15",
    startDate: "2027-01-10",
    status: "Published",
    applications: 42,
    description: "Work on frontend development projects.",
  },
  {
    _id: "2",
    title: "Backend Developer Intern",
    company: "Innovate Systems",
    location: "Bengaluru",
    type: "Paid",
    stipend: "₹20,000/month",
    deadline: "2026-12-20",
    startDate: "2027-01-15",
    status: "Draft",
    applications: 0,
    description: "Work on backend development projects.",
  },
  {
    _id: "3",
    title: "Data Analyst Intern",
    company: "DataWorks",
    location: "Remote",
    type: "Unpaid",
    stipend: "Unpaid",
    deadline: "2026-11-25",
    startDate: "2026-12-10",
    status: "Closed",
    applications: 28,
    description: "Analyze business data and prepare reports.",
  },
];

export const emptyDriveForm = {
  title: "",
  company: "",
  location: "",
  type: "Paid",
  stipend: "",
  deadline: "",
  startDate: "",
  description: "",
};

export const driveStatusOptions = [
  { label: "All Status", value: "All" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
  { label: "Closed", value: "Closed" },
];

export const driveTypeOptions = [
  { label: "Paid", value: "Paid" },
  { label: "Unpaid", value: "Unpaid" },
];
