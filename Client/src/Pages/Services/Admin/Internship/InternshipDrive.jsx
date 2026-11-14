import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  BriefcaseBusiness,
  Users,
  Send,
  Clock3,
} from "lucide-react";

import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  Toast,
} from "../../../../Components";

import DriveStatCard from "./DriveStatCard";
import DriveForm from "./DriveForm";
import DriveDetails from "./DriveDetails";
import DriveTable from "./DriveTable";

import {
  initialDrives,
  emptyDriveForm,
  driveStatusOptions,
} from "./adminDrives.data";

const AdminInternshipDrives = () => {
  const [drives, setDrives] = useState(initialDrives);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [viewingDrive, setViewingDrive] = useState(null);

  const [form, setForm] = useState(emptyDriveForm);
  const [toast, setToast] = useState(null);

  // Statistics
  const totalDrives = drives.length;

  const publishedDrives = drives.filter(
    (drive) => drive.status === "Published",
  ).length;

  const draftDrives = drives.filter((drive) => drive.status === "Draft").length;

  const totalApplications = drives.reduce(
    (total, drive) => total + drive.applications,
    0,
  );

  // Search and Filter
  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        drive.title.toLowerCase().includes(searchValue) ||
        drive.company.toLowerCase().includes(searchValue) ||
        drive.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || drive.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drives, search, statusFilter]);

  // Create
  const openCreateModal = () => {
    setEditingDrive(null);
    setForm(emptyDriveForm);
    setModalOpen(true);
  };

  // Edit
  const openEditModal = (drive) => {
    setEditingDrive(drive);

    setForm({
      title: drive.title,
      company: drive.company,
      location: drive.location,
      type: drive.type,
      stipend: drive.stipend,
      deadline: drive.deadline,
      startDate: drive.startDate,
      description: drive.description || "",
    });

    setModalOpen(true);
  };

  // Save
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingDrive) {
      setDrives((prev) =>
        prev.map((drive) =>
          drive._id === editingDrive._id ? { ...drive, ...form } : drive,
        ),
      );

      setToast({
        title: "Drive Updated",
        message: "Internship drive details have been updated.",
        variant: "success",
      });
    } else {
      const newDrive = {
        ...form,
        _id: crypto.randomUUID(),
        status: "Draft",
        applications: 0,
      };

      setDrives((prev) => [newDrive, ...prev]);

      setToast({
        title: "Drive Created",
        message: "New internship drive has been saved as a draft.",
        variant: "success",
      });
    }

    setModalOpen(false);
    setForm(emptyDriveForm);
    setEditingDrive(null);
  };

  // Publish
  const handlePublish = (driveId) => {
    setDrives((prev) =>
      prev.map((drive) =>
        drive._id === driveId ? { ...drive, status: "Published" } : drive,
      ),
    );

    setToast({
      title: "Drive Published",
      message: "The internship drive is now published.",
      variant: "success",
    });
  };

  // Close
  const handleClose = (driveId) => {
    setDrives((prev) =>
      prev.map((drive) =>
        drive._id === driveId ? { ...drive, status: "Closed" } : drive,
      ),
    );

    setToast({
      title: "Drive Closed",
      message: "The internship drive has been closed.",
      variant: "warning",
    });
  };

  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-ink-muted">
            <BriefcaseBusiness size={16} />
            <span>Admin</span>
            <span>/</span>
            <span>Internship Drives</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Internship Drives
          </h1>

          <p className="mt-1 text-sm text-ink-muted">
            Create, manage and monitor internship opportunities.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus size={18} className="mr-2" />
          Create Internship Drive
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DriveStatCard
          title="Total Drives"
          value={totalDrives}
          description="All internship drives"
          icon={BriefcaseBusiness}
        />

        <DriveStatCard
          title="Published Drives"
          value={publishedDrives}
          description="Currently published"
          icon={Send}
        />

        <DriveStatCard
          title="Draft Drives"
          value={draftDrives}
          description="Awaiting publication"
          icon={Clock3}
        />

        <DriveStatCard
          title="Total Applications"
          value={totalApplications}
          description="Across all drives"
          icon={Users}
        />
      </div>

      {/* Internship Drives */}
      <Card className="overflow-hidden border-border bg-white shadow-sm">
        <Card.Header className="border-b border-border p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <Card.Title className="text-lg font-semibold text-ink">
                All Internship Drives
              </Card.Title>

              <Card.Description className="mt-1 text-sm text-ink-muted">
                Manage and track all internship opportunities.
              </Card.Description>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search drives..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<Search size={17} />}
                />
              </div>

              <div className="w-full sm:w-40">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={driveStatusOptions}
                />
              </div>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="p-0">
          <DriveTable
            drives={filteredDrives}
            onView={setViewingDrive}
            onEdit={openEditModal}
            onPublish={handlePublish}
            onClose={handleClose}
          />
        </Card.Content>

        <Card.Footer className="flex flex-col justify-between gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-muted p-2">
            Showing {filteredDrives.length} of {drives.length} drives
          </p>
        </Card.Footer>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingDrive ? "Edit Internship Drive" : "Create Internship Drive"
        }
        description={
          editingDrive
            ? "Update the internship drive information."
            : "Enter the details to create a new internship drive."
        }
        size="lg"
      >
        <DriveForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          editing={Boolean(editingDrive)}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={Boolean(viewingDrive)}
        onClose={() => setViewingDrive(null)}
        title="Internship Drive Details"
        description="Overview of the selected internship opportunity."
        size="lg"
      >
        <DriveDetails
          drive={viewingDrive}
          onClose={() => setViewingDrive(null)}
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

export default AdminInternshipDrives;
