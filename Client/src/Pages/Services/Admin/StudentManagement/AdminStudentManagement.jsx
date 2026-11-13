import { useMemo, useState } from "react";
import { Plus, Search, Users, GraduationCap, Filter } from "lucide-react";

import { Button, Card, Input, Select } from "../../../../Components/index";

import StudentStatCard from "./StudentStatCard";
import StudentForm from "./StudentForm";
import StudentDetails from "./StudentDetails";
import StudentTable from "./StudentTable";

import {
  initialStudents,
  departments,
  academicYears,
  getStudentStats,
} from "./adminStudents.data";

const AdminStudentManagement = () => {
  const [students, setStudents] = useState(initialStudents);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = useMemo(() => getStudentStats(students), [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name?.toLowerCase().includes(query) ||
        student.rollNumber?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query);

      const matchesDepartment =
        !departmentFilter || student.department === departmentFilter;

      const matchesYear = !yearFilter || student.academicYear === yearFilter;

      const matchesStatus = !statusFilter || student.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
    });
  }, [students, search, departmentFilter, yearFilter, statusFilter]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setDetailsOpen(false);
    setFormOpen(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const handleSaveStudent = (formData) => {
    if (selectedStudent) {
      setStudents((previous) =>
        previous.map((student) =>
          student._id === selectedStudent._id
            ? { ...student, ...formData }
            : student,
        ),
      );
    } else {
      const newStudent = {
        ...formData,
        _id: `STU${Date.now()}`,
        joinedAt: new Date().toISOString(),
      };

      setStudents((previous) => [newStudent, ...previous]);
    }

    setFormOpen(false);
    setSelectedStudent(null);
  };

  const handleToggleStatus = (student) => {
    const nextStatus = student.status === "Active" ? "Inactive" : "Active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus === "Active" ? "activate" : "deactivate"
      } ${student.name}'s account?`,
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.map((item) =>
        item._id === student._id ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setYearFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters =
    search || departmentFilter || yearFilter || statusFilter;

  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <GraduationCap size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Students Management
            </h1>

            <p className="mt-1 text-sm leading-6 text-ink-muted">
              Manage student profiles, academic information, and account status.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Button onClick={handleAddStudent} className="w-full sm:w-auto">
            <Plus size={17} className="mr-2" />
            Add Student
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StudentStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* Student Management */}
      <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
        {/* Table Header */}
        <div className="space-y-5 border-b border-border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-ink">
                Registered Students
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-cream-soft p-3 text-brand-600">
              <Users size={20} />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 xl:col-span-1">
              <Input
                placeholder="Search name, roll number, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<Search size={17} />}
              />
            </div>

            <div className="min-w-0">
              <Select
                placeholder="All Departments"
                value={departmentFilter}
                onChange={setDepartmentFilter}
                options={departments.map((department) => ({
                  label: department,
                  value: department,
                }))}
              />
            </div>

            <div className="min-w-0">
              <Select
                placeholder="All Academic Years"
                value={yearFilter}
                onChange={setYearFilter}
                options={academicYears.map((year) => ({
                  label: year,
                  value: year,
                }))}
              />
            </div>

            <div className="min-w-0">
              <Select
                placeholder="All Statuses"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Filter size={14} className="mr-2" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="min-w-0 p-3 sm:p-5">
          <StudentTable
            students={filteredStudents}
            loading={false}
            onView={handleViewStudent}
            onEdit={handleEditStudent}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </Card>

      {/* Add / Edit Student */}
      <StudentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleSaveStudent}
        student={selectedStudent}
      />

      {/* Student Details */}
      <StudentDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        student={selectedStudent}
        onEdit={handleEditStudent}
      />
    </div>
  );
};

export default AdminStudentManagement;
