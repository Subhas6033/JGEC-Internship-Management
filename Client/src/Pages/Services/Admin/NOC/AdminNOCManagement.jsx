import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
import { NOCStatsSkeleton, NOCTableSkeleton } from "./NOCSkeleton";

import { nocStatusOptions } from "./adminNoc.utils";

import {
  extractNocList,
  extractTotal,
  mergeNoc,
  normalizeNoc,
  normalizeStats,
} from "./adminNoc.utils";

import {
  useAdminNocDetails,
  useAdminNocStats,
  useAdminNocs,
  useApproveAndSendNoc,
} from "../../../../Services/Queries/adminNOC.quires";

import {
  fadeIn,
  fadeUp,
  pageAnimation,
  staggerContainer,
  useAnimationVariants,
} from "../../../../Animations/animations";

// Waits until the person stops typing before the search hits the API.
const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const AdminNOCManagement = ({ onSendNoc }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewingNoc, setViewingNoc] = useState(null);
  const [confirmNoc, setConfirmNoc] = useState(null);

  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  // Applications whose dispatch failed in this session.
  const [failedIds, setFailedIds] = useState(() => new Set());

  // -----------------------------------------------
  // Animations
  // -----------------------------------------------

  const pageVariants = useAnimationVariants(pageAnimation);
  const staggerVariants = useAnimationVariants(staggerContainer);
  const itemVariants = useAnimationVariants(fadeUp);
  const fadeVariants = useAnimationVariants(fadeIn);

  // -----------------------------------------------
  // Data
  // -----------------------------------------------

  const debouncedSearch = useDebouncedValue(search);

  // FIX: status is now sent to the API as well, so the server can return
  // the right records (e.g. "sent" NOCs) instead of only one kind.
  const listParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: debouncedSearch.trim() || undefined,
      status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
    }),
    [debouncedSearch, statusFilter],
  );

  const {
    data: nocsPayload,
    isLoading: nocsLoading,
    isError: nocsError,
    refetch: refetchNocs,
  } = useAdminNocs(listParams);

  const {
    data: statsPayload,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useAdminNocStats();

  const sendNoc = useApproveAndSendNoc();

  const nocs = useMemo(() => {
    return extractNocList(nocsPayload)
      .map(normalizeNoc)
      .filter((noc) => noc && noc._id)
      .map((noc) =>
        failedIds.has(noc._id) ? { ...noc, status: "Failed" } : noc,
      );
  }, [nocsPayload, failedIds]);

  // -----------------------------------------------
  // Statistics
  // -----------------------------------------------

  const stats = useMemo(
    () => normalizeStats(statsPayload, nocs),
    [statsPayload, nocs],
  );

  const totalNocs = Math.max(stats.total, nocs.length);

  const pendingNocs = stats.pending;

  const sentNocs = stats.sent;

  const failedNocs = Math.max(
    stats.failed,
    nocs.filter((noc) => noc.status === "Failed").length,
  );

  const totalCount = Math.max(
    extractTotal(nocsPayload, nocs.length),
    nocs.length,
  );

  const showStatsSkeleton = nocsLoading && statsLoading;

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

  // Loads the full NOC (document URL, dates) while the preview is open.
  const { data: detailsPayload } = useAdminNocDetails(viewingNoc?._id, {
    enabled: Boolean(viewingNoc?._id),
  });

  const previewNoc = useMemo(() => {
    if (!viewingNoc) return null;

    return mergeNoc(viewingNoc, normalizeNoc(detailsPayload));
  }, [viewingNoc, detailsPayload]);

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

    const usesCustomSender = typeof onSendNoc === "function";

    try {
      setSending(true);

      // Uses the onSendNoc prop when the parent provides one, otherwise calls
      // POST /admin/noc/:applicationId/approve. Resolves only after the
      // backend confirms dispatch.
      if (usesCustomSender) {
        await onSendNoc(confirmNoc);
      } else {
        await sendNoc.mutateAsync(confirmNoc._id);
      }

      setFailedIds((prev) => {
        const next = new Set(prev);
        next.delete(confirmNoc._id);
        return next;
      });

      // The mutation already refreshes the data; a custom sender does not.
      if (usesCustomSender) {
        refetchNocs();
        refetchStats();
      }

      setToast({
        title: "NOC Sent Successfully",
        message: `NOC dispatch was confirmed for ${confirmNoc.email}.`,
        variant: "success",
      });

      setConfirmNoc(null);
    } catch (error) {
      setFailedIds((prev) => new Set(prev).add(confirmNoc._id));

      setToast({
        title: "NOC Dispatch Failed",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to send the NOC. Please try again.",
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
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
      </motion.div>

      {/* Statistics */}
      <motion.div
        key={showStatsSkeleton ? "stats-loading" : "stats-ready"}
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {showStatsSkeleton ? (
          <NOCStatsSkeleton />
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <NOCStatCard
                title="Total NOCs"
                value={totalNocs}
                description="All generated certificates"
                icon={FileText}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <NOCStatCard
                title="Pending Dispatch"
                value={pendingNocs}
                description="Waiting to be sent"
                icon={Clock3}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <NOCStatCard
                title="Successfully Sent"
                value={sentNocs}
                description="Dispatched to students"
                icon={MailCheck}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <NOCStatCard
                title="Failed Dispatch"
                value={failedNocs}
                description="Require another attempt"
                icon={Send}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* NOC Table */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
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
                  {/* FIX: accepts either a plain value or a change event */}
                  <Select
                    value={statusFilter}
                    onChange={(next) =>
                      setStatusFilter(next?.target ? next.target.value : next)
                    }
                    options={nocStatusOptions}
                  />
                </div>
              </div>
            </div>
          </Card.Header>

          <Card.Content className="p-0">
            <AnimatePresence mode="wait" initial={false}>
              {nocsLoading ? (
                <motion.div
                  key="table-loading"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NOCTableSkeleton />
                </motion.div>
              ) : nocsError ? (
                <motion.div
                  key="table-error"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-5"
                >
                  <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">
                      Failed to load generated NOCs. Please try again.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => refetchNocs()}
                    >
                      Retry
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="table-ready"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* FIX: margin around the table */}
                  <div className="p-4 sm:p-5">
                    <NOCTable
                      nocs={filteredNocs}
                      onView={handleViewNoc}
                      onSend={handleRequestSend}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card.Content>

          <Card.Footer className="flex flex-col justify-between gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center">
            <p className="text-xs text-ink-muted">
              {nocsLoading
                ? "Loading NOCs..."
                : `Showing ${filteredNocs.length} of ${totalCount} NOCs`}
            </p>
          </Card.Footer>
        </Card>
      </motion.div>

      {/* NOC Preview Modal */}
      <Modal
        open={Boolean(viewingNoc)}
        onClose={() => setViewingNoc(null)}
        title="NOC Preview"
        description="Review the generated certificate before sending it."
        size="xl"
      >
        <NOCPreview
          noc={previewNoc}
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
    </motion.div>
  );
};

export default AdminNOCManagement;
