const emptyStaffForm = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  role: "TPO",
};

const staffRoleOptions = [
  { label: "All Roles", value: "All" },
  { label: "TPO", value: "TPO" },
  { label: "SPOC", value: "SPOC" },
];

const staffStatusOptions = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const departmentOptions = [
  { label: "Computer Science & Engineering", value: "CSE" },
  { label: "Electronics & Communication Engineering", value: "ECE" },
  { label: "Electrical Engineering", value: "EE" },
  { label: "Mechanical Engineering", value: "ME" },
  { label: "Civil Engineering", value: "CE" },
  { label: "Information Technology", value: "IT" },
];

export {
  emptyStaffForm,
  staffRoleOptions,
  staffStatusOptions,
  departmentOptions,
};
