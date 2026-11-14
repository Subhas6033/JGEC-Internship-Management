export const initialDepartments = [
  {
    _id: "DEPT001",
    name: "Computer Science and Engineering",
    code: "CSE",
    hodName: "Dr. Amit Kumar",
    hodEmail: "amit.kumar@jgec.ac.in",
    tpoName: "Prof. Rajesh Das",
    tpoEmail: "rajesh.das@jgec.ac.in",
    studentCount: 120,
    status: "Active",
    establishedYear: "2002",
    description: "Department of Computer Science and Engineering.",
  },
  {
    _id: "DEPT002",
    name: "Electronics and Communication Engineering",
    code: "ECE",
    hodName: "Dr. Suman Roy",
    hodEmail: "suman.roy@jgec.ac.in",
    tpoName: "Prof. Ananya Sen",
    tpoEmail: "ananya.sen@jgec.ac.in",
    studentCount: 110,
    status: "Active",
    establishedYear: "2002",
    description: "Department of Electronics and Communication Engineering.",
  },
  {
    _id: "DEPT003",
    name: "Information Technology",
    code: "IT",
    hodName: "Dr. Arindam Paul",
    hodEmail: "arindam.paul@jgec.ac.in",
    tpoName: "Prof. Subhajit Roy",
    tpoEmail: "subhajit.roy@jgec.ac.in",
    studentCount: 100,
    status: "Active",
    establishedYear: "2006",
    description: "Department of Information Technology.",
  },
  {
    _id: "DEPT004",
    name: "Mechanical Engineering",
    code: "ME",
    hodName: "Dr. Pradip Ghosh",
    hodEmail: "pradip.ghosh@jgec.ac.in",
    tpoName: "Prof. Soumya Dey",
    tpoEmail: "soumya.dey@jgec.ac.in",
    studentCount: 90,
    status: "Inactive",
    establishedYear: "1961",
    description: "Department of Mechanical Engineering.",
  },
];

export const departmentStatusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const getDepartmentStats = (departments) => [
  {
    title: "Total Departments",
    value: departments.length,
    description: "Registered departments",
    icon: "Building2",
  },
  {
    title: "Active Departments",
    value: departments.filter((d) => d.status === "Active").length,
    description: "Currently active",
    icon: "CheckCircle2",
  },
  {
    title: "Inactive Departments",
    value: departments.filter((d) => d.status === "Inactive").length,
    description: "Currently inactive",
    icon: "Building",
  },
  {
    title: "Total Students",
    value: departments.reduce(
      (total, department) => total + Number(department.studentCount || 0),
      0,
    ),
    description: "Students across departments",
    icon: "GraduationCap",
  },
];
