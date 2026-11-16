import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Users,
  UserRoundCheck,
  GraduationCap,
  UserCog,
} from "lucide-react";
import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  Toast,
} from "../../../../Components/index";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
  cardAnimation,
  fadeIn,
  useAnimationVariants,
} from "../../../../Animations/animations";
import StaffStatCard from "./StaffStatCard";
import StaffForm from "./StaffForm";
import StaffDetails from "./StaffDetails";
import StaffTable from "./StaffTable";
import StaffPagination from "./StaffPagination";
import { StaffStatSkeleton, StaffTableSkeleton } from "./staffSkeleton";
import {
  emptyStaffForm,
  staffRoleOptions,
  staffStatusOptions,
} from "./adminStaff.data";
import {
  useAdminStaff,
  useAdminStaffStats,
  useUpdateAdminStaff,
  useToggleAdminStaffStatus,
} from "../../../../Services/Queries/adminStaff.quires";
import { getErrorMessage } from "../../../../Services/admin/adminStaff.api";

const PAGE_SIZE = 10;

const AdminStaffManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);

  const [form, setForm] = useState(emptyStaffForm);
  const [toast, setToast] = useState(null);

  // Motion variants (collapse to simple fades when reduced motion is on)
  const pageVariants = useAnimationVariants(pageAnimation);
  const containerVariants = useAnimationVariants(staggerContainer);
  const itemVariants = useAnimationVariants(fadeUp);
  const cardVariants = useAnimationVariants(cardAnimation);
  const fadeVariants = useAnimationVariants(fadeIn);

  // Debounce search so we don't query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Quires and Mutations
  const params = {
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(roleFilter !== "All" && { role: roleFilter }),
    ...(statusFilter !== "All" && { status: statusFilter }),
  };

  const {
    data: staffData,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useAdminStaff(params);

  const { data: stats, isLoading: statsLoading } = useAdminStaffStats();

  const updateMutation = useUpdateAdminStaff();
  const toggleMutation = useToggleAdminStaffStatus();

  const staff = staffData?.staff ?? [];
  const pagination = staffData?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  // Skeleton on first load and while a new page/filter is being fetched
  const showSkeleton = isLoading || isPlaceholderData;

  const showError = (title, err) =>
    setToast({ title, message: getErrorMessage(err), variant: "error" });

  // Select may hand back an event or a DOM <option> instead of a plain value.
  const toValue = (v) => {
    if (v && typeof v === "object") {
      if ("target" in v) return v.target?.value;
      if ("nodeType" in v) return v.value;
    }
    return v;
  };

  // Filters
  const handleRoleChange = (value) => {
    setRoleFilter(toValue(value));
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(toValue(value));
    setPage(1);
  };

  const setFormSafe = (updater) =>
    setForm((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return Object.fromEntries(
        Object.entries(next).map(([key, val]) => [key, toValue(val)]),
      );
    });

  // Modals
  const openEditModal = (member) => {
    setEditingStaff(member);

    setForm({
      name: member.name,
      employeeId: member.employeeId,
      email: member.email,
      phone: member.phone,
      department: member.department,
      role: member.role,
    });

    setModalOpen(true);
  };

  // Update Details
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateMutation.isPending) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      employeeId: form.employeeId.trim(),
      email: form.email.trim(),
    };

    try {
      if (editingStaff) {
        await updateMutation.mutateAsync({
          staffId: editingStaff._id,
          payload,
        });

        setToast({
          title: "Staff Updated",
          message: "Staff details have been updated successfully.",
          variant: "success",
        });
      }

      setModalOpen(false);
      setEditingStaff(null);
      setForm(emptyStaffForm);
    } catch (err) {
      showError(
        editingStaff ? "Could not update staff" : "Could not add staff",
        err,
      );
    }
  };

  // Active/Deactive
  const handleToggleStatus = async (staffId) => {
    try {
      const member = await toggleMutation.mutateAsync(staffId);

      setToast({
        title: `Account ${member.status}`,
        message: `${member.name}'s account is now ${member.status.toLowerCase()}.`,
        variant: "success",
      });
    } catch (err) {
      showError("Could not change status", err);
    }
  };

  // Render
  const from =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  const statCards = [
    {
      title: "Total Staff",
      value: stats?.totalStaff ?? 0,
      description: "All registered TPOs and SPOCs",
      icon: Users,
    },
    {
      title: "Total TPOs",
      value: stats?.totalTpos ?? 0,
      description: "Training and Placement Officers",
      icon: GraduationCap,
    },
    {
      title: "Total SPOCs",
      value: stats?.totalSpocs ?? 0,
      description: "Total SPOCs",
      icon: UserCog,
    },
    {
      title: "Active Accounts",
      value: stats?.activeStaff ?? 0,
      description: "Currently active staff accounts",
      icon: UserRoundCheck,
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-ink-muted">
            <UserCog size={16} />
            <span>Admin</span>
            <span>/</span>
            <span>Staff Management</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            TPO & SPOC Management
          </h1>

          <p className="mt-1 text-sm text-ink-muted">
            Manage departmental Training and Placement Officers and SPOCs.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            {statsLoading ? <StaffStatSkeleton /> : <StaffStatCard {...card} />}
          </motion.div>
        ))}
      </motion.div>

      {/* Staff Table */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="overflow-hidden border-border bg-white shadow-sm">
          <Card.Header className="border-b border-border p-5">
            <div className="flex flex-col justify-between gap-4">
              <div>
                <Card.Title className="text-lg font-semibold text-ink">
                  All TPOs & SPOCs
                </Card.Title>

                <Card.Description className="mt-1 text-sm text-ink-muted">
                  View and manage staff accounts and departmental assignments.
                </Card.Description>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  placeholder="Search name, ID, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<Search size={17} />}
                />

                <Select
                  value={roleFilter}
                  onChange={handleRoleChange}
                  options={staffRoleOptions}
                />

                <Select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  options={staffStatusOptions}
                />
              </div>
            </div>
          </Card.Header>

          <Card.Content className="p-0">
            <AnimatePresence mode="wait" initial={false}>
              {showSkeleton ? (
                <motion.div
                  key="skeleton"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <StaffTableSkeleton rows={8} />
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-3 px-5 py-12 text-center"
                >
                  <p className="text-sm font-medium text-ink">
                    Could not load staff
                  </p>
                  <p className="text-xs text-ink-muted">
                    {getErrorMessage(error)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try again
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={`table-${pagination.page}-${roleFilter}-${statusFilter}-${debouncedSearch}`}
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <StaffTable
                    staff={staff}
                    onView={setViewingStaff}
                    onEdit={openEditModal}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card.Content>

          <Card.Footer className="flex flex-col justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center">
            <p className="text-xs text-ink-muted">
              {showSkeleton
                ? "Loading staff members…"
                : `Showing ${from}–${to} of ${pagination.total} staff members`}
            </p>

            <StaffPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              disabled={showSkeleton}
            />
          </Card.Footer>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? "Edit Staff Member" : "Add TPO / SPOC"}
        description={
          editingStaff
            ? "Update staff information and departmental assignment."
            : "Add a new Training and Placement Officer or SPOC."
        }
        size="lg"
      >
        <StaffForm
          form={form}
          setForm={setFormSafe}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          editing={Boolean(editingStaff)}
        />
      </Modal>

      {/* Staff Details Modal */}
      <Modal
        open={Boolean(viewingStaff)}
        onClose={() => setViewingStaff(null)}
        title="Staff Details"
        description="View staff profile and account information."
        size="lg"
      >
        <StaffDetails
          staff={viewingStaff}
          onClose={() => setViewingStaff(null)}
        />
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminStaffManagement;
