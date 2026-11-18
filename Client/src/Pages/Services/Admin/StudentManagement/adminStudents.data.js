export const departments = ["CE", "EE", "ME", "CSE", "ECE", "IT"];

export const getStudentStats = (students = [], totalStudents = 0) => {
  const departmentCounts = students.reduce((acc, student) => {
    acc[student.department] = (acc[student.department] || 0) + 1;
    return acc;
  }, {});

  return [
    {
      title: "Total Students",
      value: totalStudents,
      description: "Registered student accounts",
      icon: "users",
    },
    {
      title: "Departments",
      value: Object.keys(departmentCounts).length,
      description: "Departments in current results",
      icon: "building-2",
    },
    {
      title: "Signatures",
      value: students.filter((student) => student.signature).length,
      description: "Students with signatures",
      icon: "file-check",
    },
    {
      title: "Current Results",
      value: students.length,
      description: "Students on this page",
      icon: "graduation-cap",
    },
  ];
};
