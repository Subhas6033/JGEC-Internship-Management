import { Student } from "../../models/students.models.js";
import { TPO } from "../../models/tpo.models.js";
import { SPOC } from "../../models/spoc.models.js";

// Departments are not stored in their own collection. The list comes from the
// Student schema's enum, so it always matches what students can register with.
const DEPARTMENT_NAMES = {
  CSE: "Computer Science & Engineering",
  ECE: "Electronics & Communication Engineering",
  EE: "Electrical Engineering",
  ME: "Mechanical Engineering",
  CE: "Civil Engineering",
  IT: "Information Technology",
};

const DEPARTMENT_CODES = Student.schema.path("department").enumValues;

// Active staff grouped by department: { CSE: [{ _id, name, email, mobile }] }
const groupActiveStaff = async (Model) => {
  const groups = await Model.aggregate([
    { $match: { isActive: true } },
    { $sort: { fullName: 1 } },
    {
      $group: {
        _id: "$department",
        members: {
          $push: {
            _id: "$_id",
            name: "$fullName",
            email: "$email",
            mobile: "$mobile",
          },
        },
      },
    },
  ]);

  return Object.fromEntries(groups.map((g) => [g._id, g.members]));
};

export const listDepartments = async () => {
  const [studentGroups, tposByDept, spocsByDept] = await Promise.all([
    Student.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]),
    groupActiveStaff(TPO),
    groupActiveStaff(SPOC),
  ]);

  const studentCounts = Object.fromEntries(
    studentGroups.map((g) => [g._id, g.count]),
  );

  const departments = DEPARTMENT_CODES.map((code) => ({
    _id: code,
    code,
    name: DEPARTMENT_NAMES[code] ?? code,
    studentCount: studentCounts[code] ?? 0,
    tpos: tposByDept[code] ?? [],
    spocs: spocsByDept[code] ?? [],
  })).sort((a, b) => a.name.localeCompare(b.name));

  const stats = {
    totalDepartments: departments.length,
    totalStudents: departments.reduce((sum, d) => sum + d.studentCount, 0),
    departmentsWithTpo: departments.filter((d) => d.tpos.length > 0).length,
    departmentsWithSpoc: departments.filter((d) => d.spocs.length > 0).length,
  };

  return { departments, stats };
};
