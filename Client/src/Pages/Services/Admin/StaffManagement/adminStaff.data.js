export const initialStaff = [
  {
    _id: "STAFF-001",
    name: "Dr. Anirban Sen",
    employeeId: "JGEC-TPO-001",
    email: "tpo.cse@jgec.ac.in",
    phone: "9876543210",
    department: "Computer Science",
    role: "TPO",
    status: "Active",
    joinedAt: "2025-06-10",
  },
  {
    _id: "STAFF-002",
    name: "Prof. Subhajit Roy",
    employeeId: "JGEC-SPOC-001",
    email: "spoc.cse@jgec.ac.in",
    phone: "9876543211",
    department: "Computer Science",
    role: "SPOC",
    status: "Active",
    joinedAt: "2025-07-15",
  },
  {
    _id: "STAFF-003",
    name: "Dr. Madhumita Das",
    employeeId: "JGEC-TPO-002",
    email: "tpo.ece@jgec.ac.in",
    phone: "9876543212",
    department: "Electronics and Communication",
    role: "TPO",
    status: "Active",
    joinedAt: "2025-08-01",
  },
  {
    _id: "STAFF-004",
    name: "Prof. Rahul Ghosh",
    employeeId: "JGEC-SPOC-002",
    email: "spoc.ece@jgec.ac.in",
    phone: "9876543213",
    department: "Electronics and Communication",
    role: "SPOC",
    status: "Inactive",
    joinedAt: "2025-09-12",
  },
];

export const emptyStaffForm = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  role: "TPO",
};

export const staffRoleOptions = [
  { label: "All Roles", value: "All" },
  { label: "TPO", value: "TPO" },
  { label: "SPOC", value: "SPOC" },
];

export const staffStatusOptions = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const departmentOptions = [
  { label: "Computer Science", value: "Computer Science" },
  {
    label: "Electronics and Communication",
    value: "Electronics and Communication",
  },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  { label: "Electrical Engineering", value: "Electrical Engineering" },
];
