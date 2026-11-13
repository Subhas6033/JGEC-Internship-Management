import { useMemo, useState } from "react";
import { Plus, Search, Building2, Filter } from "lucide-react";

import { Button, Card, Input, Select } from "../../../../Components/index";

import DepartmentStatCard from "./DepartmentStatCard";
import DepartmentForm from "./DepartmentForm";
import DepartmentDetails from "./DepartmentDetails";
import DepartmentTable from "./DepartmentTable";

import {
  initialDepartments,
  getDepartmentStats,
} from "./adminDepartments.data";

const AdminDepartmentManagement = () => {
  const [departments, setDepartments] = useState(initialDepartments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const stats = useMemo(() => getDepartmentStats(departments), [departments]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesSearch =
        !query ||
        department.name?.toLowerCase().includes(query) ||
        department.code?.toLowerCase().includes(query) ||
        department.hodName?.toLowerCase().includes(query) ||
        department.tpoName?.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setFormOpen(true);
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setDetailsOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setDetailsOpen(false);
    setFormOpen(true);
  };

  const handleSaveDepartment = (formData) => {
    const normalizedCode = formData.code.trim().toUpperCase();

    const duplicateCode = departments.some(
      (department) =>
        department.code?.toUpperCase() === normalizedCode &&
        department._id !== selectedDepartment?._id,
    );

    if (duplicateCode) {
      window.alert("A department with this code already exists.");
      return;
    }

    if (selectedDepartment) {
      setDepartments((previous) =>
        previous.map((department) =>
          department._id === selectedDepartment._id
            ? { ...department, ...formData, code: normalizedCode }
            : department,
        ),
      );
    } else {
      const newDepartment = {
        ...formData,
        _id: `DEPT${Date.now()}`,
        code: normalizedCode,
      };

      setDepartments((previous) => [newDepartment, ...previous]);
    }

    setFormOpen(false);
    setSelectedDepartment(null);
  };

  const handleToggleStatus = (department) => {
    const nextStatus = department.status === "Active" ? "Inactive" : "Active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus === "Active" ? "activate" : "deactivate"
      } ${department.name}?`,
    );

    if (!confirmed) return;

    setDepartments((previous) =>
      previous.map((item) =>
        item._id === department._id ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const hasActiveFilters = search || statusFilter;

  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <Building2 size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Department Management
            </h1>

            <p className="mt-1 text-sm leading-6 text-ink-muted">
              Manage departments, HOD assignments, and departmental TPOs.
            </p>
          </div>
        </div>

        <Button
          onClick={handleAddDepartment}
          className="w-full shrink-0 sm:w-auto"
        >
          <Plus size={17} className="mr-2" />
          Add Department
        </Button>
      </section>

      {/* Statistics */}
      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DepartmentStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* Department Table */}
      <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
        {/* Table Header and Filters */}
        <div className="space-y-5 border-b border-border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-ink">
                Registered Departments
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Showing {filteredDepartments.length} of {departments.length}{" "}
                departments
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-cream-soft p-3 text-brand-600">
              <Building2 size={20} />
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <Input
                placeholder="Search department, code, HOD, TPO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<Search size={17} />}
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

        {/* Department Table */}
        <div className="min-w-0 p-3 sm:p-5">
          <DepartmentTable
            departments={filteredDepartments}
            loading={false}
            onView={handleViewDepartment}
            onEdit={handleEditDepartment}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </Card>

      {/* Add / Edit Department */}
      <DepartmentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedDepartment(null);
        }}
        onSubmit={handleSaveDepartment}
        department={selectedDepartment}
      />

      {/* Department Details */}
      <DepartmentDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        department={selectedDepartment}
        onEdit={handleEditDepartment}
      />
    </div>
  );
};

export default AdminDepartmentManagement;
