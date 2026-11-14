import { useMemo, useState } from "react";

import {
  FileCheck2,
  FileText,
  MailCheck,
  Clock3,
  Search,
  Send,
} from "lucide-react";

import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  Toast,
} from "../../../../Components/index";

import NOCStatCard from "./NOCStatCard";
import NOCTable from "./NOCTable";
import NOCPreview from "./NOCPreview";

import { initialNocs, nocStatusOptions } from "./adminNoc.data";

const AdminNOCManagement = ({ onSendNoc }) => {
  const [nocs, setNocs] = useState(initialNocs);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewingNoc, setViewingNoc] = useState(null);
  const [confirmNoc, setConfirmNoc] = useState(null);

  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  // -----------------------------------------------
  // Statistics
  // -----------------------------------------------

  const totalNocs = nocs.length;

  const pendingNocs = nocs.filter((noc) => noc.status === "Pending").length;

  const sentNocs = nocs.filter((noc) => noc.status === "Sent").length;

  const failedNocs = nocs.filter((noc) => noc.status === "Failed").length;

  // -----------------------------------------------
  // Search and Filter
  // -----------------------------------------------

  const filteredNocs = useMemo(() => {
    return nocs.filter((noc) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        noc.studentName.toLowerCase().includes(searchValue) ||
        noc.rollNumber.toLowerCase().includes(searchValue) ||
        noc.company.toLowerCase().includes(searchValue) ||
        noc.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || noc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [nocs, search, statusFilter]);

  // -----------------------------------------------
  // Preview NOC
  // -----------------------------------------------

  const handleViewNoc = (noc) => {
    setViewingNoc(noc);
  };

  // -----------------------------------------------
  // Open Send Confirmation
  // -----------------------------------------------

  const handleRequestSend = (noc) => {
    setViewingNoc(null);
    setConfirmNoc(noc);
  };

  // -----------------------------------------------
  // Send NOC
  // -----------------------------------------------

  const handleSendNoc = async () => {
    if (!confirmNoc) return;

    if (typeof onSendNoc !== "function") {
      setToast({
        title: "Email service not connected",
        message:
          "Connect the NOC email API through the onSendNoc prop before dispatching documents.",
        variant: "warning",
      });

      setConfirmNoc(null);
      return;
    }

    try {
      setSending(true);

      // The parent should call your backend API here.
      // Resolve this promise only after the backend confirms dispatch.
      await onSendNoc(confirmNoc);

      setNocs((prev) =>
        prev.map((noc) =>
          noc._id === confirmNoc._id
            ? {
                ...noc,
                status: "Sent",
                sentAt: new Date().toISOString(),
              }
            : noc,
        ),
      );

      setToast({
        title: "NOC Sent Successfully",
        message: `NOC dispatch was confirmed for ${confirmNoc.email}.`,
        variant: "success",
      });

      setConfirmNoc(null);
    } catch (error) {
      setNocs((prev) =>
        prev.map((noc) =>
          noc._id === confirmNoc._id ? { ...noc, status: "Failed" } : noc,
        ),
      );

      setToast({
        title: "NOC Dispatch Failed",
        message: error?.message || "Unable to send the NOC. Please try again.",
        variant: "error",
      });

      setConfirmNoc(null);
    } finally {
      setSending(false);
    }
  };

  // -----------------------------------------------
  // Render
  // -----------------------------------------------

  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-ink-muted">
          <FileCheck2 size={16} />
          <span>Admin</span>
          <span>/</span>
          <span>NOC Management</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          NOC Management
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Review generated No Objection Certificates and dispatch them to
          students.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NOCStatCard
          title="Total NOCs"
          value={totalNocs}
          description="All generated certificates"
          icon={FileText}
        />

        <NOCStatCard
          title="Pending Dispatch"
          value={pendingNocs}
          description="Waiting to be sent"
          icon={Clock3}
        />

        <NOCStatCard
          title="Successfully Sent"
          value={sentNocs}
          description="Dispatched to students"
          icon={MailCheck}
        />

        <NOCStatCard
          title="Failed Dispatch"
          value={failedNocs}
          description="Require another attempt"
          icon={Send}
        />
      </div>

      {/* NOC Table */}
      <Card className="overflow-hidden border-border bg-white shadow-sm">
        <Card.Header className="border-b border-border p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <Card.Title className="text-lg font-semibold text-ink">
                Generated NOCs
              </Card.Title>

              <Card.Description className="mt-1 text-sm text-ink-muted">
                NOCs generated by department SPOCs, ready for dispatch.
              </Card.Description>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search student or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<Search size={17} />}
                />
              </div>

              <div className="w-full sm:w-40">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={nocStatusOptions}
                />
              </div>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="p-0">
          <NOCTable
            nocs={filteredNocs}
            onView={handleViewNoc}
            onSend={handleRequestSend}
          />
        </Card.Content>

        <Card.Footer className="flex flex-col justify-between gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-muted">
            Showing {filteredNocs.length} of {nocs.length} NOCs
          </p>
        </Card.Footer>
      </Card>

      {/* NOC Preview Modal */}
      <Modal
        open={Boolean(viewingNoc)}
        onClose={() => setViewingNoc(null)}
        title="NOC Preview"
        description="Review the generated certificate before sending it."
        size="xl"
      >
        <NOCPreview
          noc={viewingNoc}
          onClose={() => setViewingNoc(null)}
          onSend={handleRequestSend}
        />
      </Modal>

      {/* Send Confirmation Modal */}
      <Modal
        open={Boolean(confirmNoc)}
        onClose={() => !sending && setConfirmNoc(null)}
        title="Confirm NOC Dispatch"
        description="The generated NOC will be sent to the student's registered email address."
        size="md"
      >
        {confirmNoc && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-cream-soft/50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-brand-600">
                  <MailCheck size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {confirmNoc.studentName}
                  </p>

                  <p className="mt-1 break-all text-sm text-ink-muted">
                    {confirmNoc.email}
                  </p>

                  <p className="mt-2 text-xs text-ink-muted">
                    {confirmNoc.company} · {confirmNoc.internshipRole}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-ink-muted">
              Are you sure you want to send this generated NOC to the student?
            </p>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={sending}
                onClick={() => setConfirmNoc(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={sending}
                loading={sending}
                onClick={handleSendNoc}
              >
                <Send size={16} className="mr-2" />
                {sending ? "Sending..." : "Confirm & Send NOC"}
              </Button>
            </div>
          </div>
        )}
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

export default AdminNOCManagement;
