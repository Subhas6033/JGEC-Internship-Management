import { useMemo, useState } from "react";

import {
  Plus,
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

import StaffStatCard from "./StaffStatCard";
import StaffForm from "./StaffForm";
import StaffDetails from "./StaffDetails";
import StaffTable from "./StaffTable";

import {
  initialStaff,
  emptyStaffForm,
  staffRoleOptions,
  staffStatusOptions,
} from "./adminStaff.data";

const AdminStaffManagement = () => {
  const [staff, setStaff] = useState(initialStaff);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);

  const [form, setForm] = useState(emptyStaffForm);
  const [toast, setToast] = useState(null);

  // -----------------------------------------------
  // Statistics
  // -----------------------------------------------

  const totalStaff = staff.length;

  const totalTpos = staff.filter((member) => member.role === "TPO").length;

  const totalSpocs = staff.filter((member) => member.role === "SPOC").length;

  const activeStaff = staff.filter(
    (member) => member.status === "Active",
  ).length;

  // -----------------------------------------------
  // Search and Filters
  // -----------------------------------------------

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(searchValue) ||
        member.employeeId.toLowerCase().includes(searchValue) ||
        member.email.toLowerCase().includes(searchValue) ||
        member.department.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "All" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  // -----------------------------------------------
  // Open Create Modal
  // -----------------------------------------------

  const openCreateModal = () => {
    setEditingStaff(null);
    setForm(emptyStaffForm);
    setModalOpen(true);
  };

  // -----------------------------------------------
  // Open Edit Modal
  // -----------------------------------------------

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

  // -----------------------------------------------
  // Create / Update Staff
  // -----------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    const duplicate = staff.find(
      (member) =>
        member._id !== editingStaff?._id &&
        (member.employeeId.toLowerCase() ===
          form.employeeId.trim().toLowerCase() ||
          member.email.toLowerCase() === form.email.trim().toLowerCase()),
    );

    if (duplicate) {
      setToast({
        title: "Duplicate Staff Details",
        message: "Employee ID or email is already registered.",
        variant: "error",
      });

      return;
    }

    if (editingStaff) {
      setStaff((prev) =>
        prev.map((member) =>
          member._id === editingStaff._id
            ? {
                ...member,
                ...form,
                name: form.name.trim(),
                employeeId: form.employeeId.trim(),
                email: form.email.trim(),
              }
            : member,
        ),
      );

      setToast({
        title: "Staff Updated",
        message: "Staff details have been updated successfully.",
        variant: "success",
      });
    } else {
      const newStaff = {
        ...form,
        _id: crypto.randomUUID(),
        name: form.name.trim(),
        employeeId: form.employeeId.trim(),
        email: form.email.trim(),
        status: "Active",
        joinedAt: new Date().toISOString().split("T")[0],
      };

      setStaff((prev) => [newStaff, ...prev]);

      setToast({
        title: "Staff Added",
        message: `${form.role} has been added successfully.`,
        variant: "success",
      });
    }

    setModalOpen(false);
    setEditingStaff(null);
    setForm(emptyStaffForm);
  };

  // -----------------------------------------------
  // Activate / Deactivate Staff
  // -----------------------------------------------

  const handleToggleStatus = (staffId) => {
    const selectedStaff = staff.find((member) => member._id === staffId);

    if (!selectedStaff) return;

    const nextStatus =
      selectedStaff.status === "Active" ? "Inactive" : "Active";

    setStaff((prev) =>
      prev.map((member) =>
        member._id === staffId ? { ...member, status: nextStatus } : member,
      ),
    );

    setToast({
      title: `Account ${nextStatus}`,
      message: `${selectedStaff.name}'s account is now ${nextStatus.toLowerCase()}.`,
      variant: "success",
    });
  };

  // -----------------------------------------------
  // Render
  // -----------------------------------------------

  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
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

        <Button onClick={openCreateModal}>
          <Plus size={18} className="mr-2" />
          Add TPO / SPOC
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaffStatCard
          title="Total Staff"
          value={totalStaff}
          description="All registered TPOs and SPOCs"
          icon={Users}
        />

        <StaffStatCard
          title="Total TPOs"
          value={totalTpos}
          description="Training and Placement Officers"
          icon={GraduationCap}
        />

        <StaffStatCard
          title="Total SPOCs"
          value={totalSpocs}
          description="Departmental SPOCs"
          icon={UserCog}
        />

        <StaffStatCard
          title="Active Accounts"
          value={activeStaff}
          description="Currently active staff accounts"
          icon={UserRoundCheck}
        />
      </div>

      {/* Staff Table */}
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

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                placeholder="Search name, ID, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<Search size={17} />}
              />

              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                options={staffRoleOptions}
              />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={staffStatusOptions}
              />
            </div>
          </div>
        </Card.Header>

        <Card.Content className="p-0">
          <StaffTable
            staff={filteredStaff}
            onView={setViewingStaff}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
          />
        </Card.Content>

        <Card.Footer className="flex flex-col justify-between gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-muted">
            Showing {filteredStaff.length} of {staff.length} staff members
          </p>
        </Card.Footer>
      </Card>

      {/* Create / Edit Modal */}
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
          setForm={setForm}
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
    </div>
  );
};

export default AdminStaffManagement;
