import { useDeferredValue, useEffect, useState } from "react";
import {
  Search,
  Users,
  Filter,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Input, Select } from "../../../../Components/index";
import StudentStatCard from "./StudentStatCard";
import StudentForm from "./StudentForm";
import StudentDetails from "./StudentDetails";
import StudentTable from "./StudentTable";
import StudentPageSkeleton from "./StudentPageSkeleton";
import { departments, getStudentStats } from "./adminStudents.data";
import {
  useAdminStudents,
  useUpdateAdminStudent,
  useDeleteAdminStudent,
} from "../../../../Services/Queries/adminStudents.queries";

const PAGE_SIZE_OPTIONS = [
  { label: "10 per page", value: "10" },
  { label: "20 per page", value: "20" },
  { label: "50 per page", value: "50" },
];

const AdminStudentManagement = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const deferredSearch = useDeferredValue(search);
  // Reset paginations when filter changes
  useEffect(() => {
    setPage(1);
  }, [deferredSearch, departmentFilter]);
  // Query Params
  const queryParams = {
    page,
    limit,
    ...(deferredSearch.trim() && {
      search: deferredSearch.trim(),
    }),
    ...(departmentFilter && {
      department: departmentFilter,
    }),
  };
  // React Query
  const { data, isPending, isError, error, isFetching, refetch } =
    useAdminStudents(queryParams);

  const updateMutation = useUpdateAdminStudent();
  const deleteMutation = useDeleteAdminStudent();

  const students = data?.students || [];
  const pagination = data?.pagination || {};

  const currentPage = pagination.currentPage || page;
  const totalPages = pagination.totalPages || 0;
  const totalStudents = pagination.totalStudents || 0;

  const stats = getStudentStats(students, totalStudents);

  // Paginations Helpers
  const getPageNumbers = () => {
    const pages = [];

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let current = startPage; current <= endPage; current++) {
      pages.push(current);
    }

    return pages;
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    if (nextPage === page) return;

    setPage(nextPage);
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  // Student Actions
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
    if (!selectedStudent?._id) return;

    updateMutation.mutate(
      {
        studentId: selectedStudent._id,
        payload: formData,
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          setSelectedStudent(null);
        },
      },
    );
  };

  const handleDeleteStudent = (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${student.fullName}?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(student._id, {
      onSuccess: () => {
        // Move to the previous page if the last row was deleted.
        if (students.length === 1 && page > 1) {
          setPage((previous) => previous - 1);
        }

        if (selectedStudent?._id === student._id) {
          setSelectedStudent(null);
          setDetailsOpen(false);
        }
      },
    });
  };

  // Filter Actions
  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || departmentFilter;
  if (isPending) {
    return <StudentPageSkeleton />;
  }
  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <Users size={28} />
        </div>

        <h2 className="text-lg font-semibold text-ink">
          Unable to load students
        </h2>

        <p className="max-w-md text-sm text-ink-muted">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while fetching student details."}
        </p>

        <Button onClick={() => refetch()}>
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }
  // Paginations Range
  const startIndex = totalStudents === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalStudents);
  const visiblePages = getPageNumbers();

  // Main UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
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
              Manage student profiles and registered information.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StudentStatCard key={stat.title} stat={stat} index={index} />
        ))}
      </section>

      {/* Student Management */}
      <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
        {/* Header and Filters */}
        <div className="space-y-5 border-b border-border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-ink">
                Registered Students
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Showing {students.length} of {totalStudents} students
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-cream-soft p-3 text-brand-600">
              <Users size={20} />
            </div>
          </div>

          {/* Search and Department Filter */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
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
                onChange={(event) => {
                  setDepartmentFilter(event.target.value);
                }}
                options={departments.map((department) => ({
                  label: department,
                  value: department,
                }))}
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Filter size={14} className="mr-2" />
                Clear filters
              </Button>
            </div>
          )}

          {/* Fetching Indicator */}
          {isFetching && (
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-cream-soft">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-600" />
            </div>
          )}
        </div>

        {/* Student Table */}
        <div className="min-w-0 p-3 sm:p-5">
          <StudentTable
            students={students}
            loading={false}
            onView={handleViewStudent}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            deletingId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
          />

          {/* Delete Error */}
          {deleteMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              {deleteMutation.error?.response?.data?.message ||
                "Unable to delete student. Please try again."}
            </p>
          )}

          {/* Update Error */}
          {updateMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              {updateMutation.error?.response?.data?.message ||
                "Unable to update student. Please try again."}
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalStudents > 0 && (
          <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:px-5">
            {/* Pagination Information */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-muted">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {startIndex}-{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-ink">{totalStudents}</span>{" "}
                students
              </p>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm text-ink-muted">
                  Rows per page
                </span>

                <Select
                  value={String(limit)}
                  onChange={(event) => {
                    handleLimitChange(event.target.value);
                  }}
                  options={PAGE_SIZE_OPTIONS}
                />
              </div>
            </div>

            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
                {/* Previous */}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isFetching}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* First Page */}
                {visiblePages[0] > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant={page === 1 ? "default" : "outline"}
                      disabled={isFetching}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Button>

                    {visiblePages[0] > 2 && (
                      <span className="px-1 text-ink-muted">...</span>
                    )}
                  </>
                )}

                {/* Numbered Pages */}
                <AnimatePresence mode="popLayout">
                  {visiblePages.map((pageNumber) => (
                    <motion.div
                      key={pageNumber}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        size="sm"
                        variant={page === pageNumber ? "default" : "outline"}
                        disabled={isFetching}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Last Page */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                      <span className="px-1 text-ink-muted">...</span>
                    )}

                    <Button
                      size="sm"
                      variant={page === totalPages ? "default" : "outline"}
                      disabled={isFetching}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}

                {/* Next */}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => handlePageChange(page + 1)}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}

            {/* Current Page Information */}
            <p className="text-center text-xs text-ink-muted sm:text-right">
              Page {page} of {Math.max(totalPages, 1)}
            </p>
          </div>
        )}
      </Card>

      {/* Edit Student */}
      <StudentForm
        open={formOpen}
        onClose={() => {
          if (updateMutation.isPending) return;

          setFormOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleSaveStudent}
        student={selectedStudent}
        loading={updateMutation.isPending}
      />

      {/* Student Details */}
      <AnimatePresence>
        {detailsOpen && (
          <StudentDetails
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            student={selectedStudent}
            onEdit={handleEditStudent}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStudentManagement;
