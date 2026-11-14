export const departments = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export const studentStatusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const initialStudents = [
  {
    _id: "STU001",
    name: "Aarav Sharma",
    rollNumber: "CSE2023001",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    department: "Computer Science and Engineering",
    academicYear: "4th Year",
    admissionYear: "2023",
    status: "Active",
    joinedAt: "2023-08-10",
  },
  {
    _id: "STU002",
    name: "Priya Das",
    rollNumber: "ECE2023002",
    email: "priya.das@example.com",
    phone: "9876543211",
    department: "Electronics and Communication Engineering",
    academicYear: "4th Year",
    admissionYear: "2023",
    status: "Active",
    joinedAt: "2023-08-12",
  },
  {
    _id: "STU003",
    name: "Rahul Roy",
    rollNumber: "IT2022003",
    email: "rahul.roy@example.com",
    phone: "9876543212",
    department: "Information Technology",
    academicYear: "3rd Year",
    admissionYear: "2022",
    status: "Inactive",
    joinedAt: "2022-08-15",
  },
  {
    _id: "STU004",
    name: "Sneha Ghosh",
    rollNumber: "ME2024004",
    email: "sneha.ghosh@example.com",
    phone: "9876543213",
    department: "Mechanical Engineering",
    academicYear: "3rd Year",
    admissionYear: "2024",
    status: "Active",
    joinedAt: "2024-08-10",
  },
];

export const getStudentStats = (students) => [
  {
    title: "Total Students",
    value: students.length,
    description: "Registered student accounts",
    icon: "users",
  },
  {
    title: "Active Students",
    value: students.filter((student) => student.status === "Active").length,
    description: "Currently active accounts",
    icon: "user-check",
  },
  {
    title: "Inactive Students",
    value: students.filter((student) => student.status === "Inactive").length,
    description: "Deactivated accounts",
    icon: "user-x",
  },
  {
    title: "Departments",
    value: new Set(students.map((student) => student.department)).size,
    description: "Departments represented",
    icon: "building-2",
  },
];
