import { useMemo, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronsDownUp, ChevronsUpDown, Undo2 } from "lucide-react";
import { Button, Modal, Toast } from "../../../../Components";
import {
  useAcceptTpoApplication,
  useSendBackTpoApplication,
} from "../../../../Services/Queries/tpoApplication.quires";
import OrganisationApplicationGroup from "./CompanyApplicationGroup";
import { groupByOrganisation, getStudent } from "./applicationUtils";

// Shared by every list route. Groups the applications it receives by
// organisation ID and wires the existing accept / send-back mutations.
// There is no bulk or reject endpoint, so none is offered.
const OrganisationGroupList = ({
  applications = [],
  emptyTitle = "No applications to display",
  emptyDescription = "Applications matching your filters will appear here.",
}) => {
  const navigate = useNavigate();
  const { refetch } = useOutletContext() || {};
  const { mutateAsync: acceptApplication } = useAcceptTpoApplication();
  const { mutateAsync: sendBackApplication, isPending: isSendingBack } =
    useSendBackTpoApplication();

  const groups = useMemo(
    () => groupByOrganisation(applications),
    [applications],
  );

  const [expandedIds, setExpandedIds] = useState(
    () => new Set(groups.slice(0, 1).map((g) => g.id)),
  );
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [sendBackTarget, setSendBackTarget] = useState(null);
  const closeToast = useCallback(() => setActionError(""), []);
  const [reason, setReason] = useState("");

  const toggle = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleView = (application) => {
    if (application?._id) navigate(`/depttpo/applications/${application._id}`);
  };

  const handleAccept = async (application) => {
    setActionError("");
    setBusyId(application?._id);
    try {
      await acceptApplication(application._id);
      await refetch?.();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not accept the application. Try again.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const closeSendBack = () => {
    setSendBackTarget(null);
    setReason("");
  };

  const handleSendBack = async () => {
    const trimmed = reason.trim();
    if (!trimmed || !sendBackTarget?._id) return;
    setActionError("");
    setBusyId(sendBackTarget._id);
    try {
      await sendBackApplication({
        applicationId: sendBackTarget._id,
        reason: trimmed,
      });
      closeSendBack();
      await refetch?.();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not send the application back. Try again.",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-cream-soft px-5 py-12 text-center">
        <p className="text-sm font-semibold text-ink">{emptyTitle}</p>
        <p className="mt-1 text-xs text-ink-muted">{emptyDescription}</p>
      </div>
    );
  }

  const allExpanded = groups.every((g) => expandedIds.has(g.id));
  const targetName = getStudent(sendBackTarget).fullName || "this student";

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          {groups.length}{" "}
          {groups.length === 1 ? "organisation" : "organisations"} on this page
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={allExpanded}
            onClick={() => setExpandedIds(new Set(groups.map((g) => g.id)))}
          >
            <ChevronsUpDown size={14} />
            Expand all
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={expandedIds.size === 0}
            onClick={() => setExpandedIds(new Set())}
          >
            <ChevronsDownUp size={14} />
            Collapse all
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="pointer-events-none fixed right-4 top-20 z-100 w-full max-w-sm px-4 sm:px-0">
          <Toast
            variant="error"
            title="Something went wrong"
            message={actionError}
            onClose={closeToast}
            duration={6000}
          />
        </div>
      )}

      <div className="space-y-4">
        {groups.map((group) => (
          <OrganisationApplicationGroup
            key={group.id}
            group={group}
            expanded={expandedIds.has(group.id)}
            onToggle={toggle}
            busyId={busyId}
            onView={handleView}
            onAccept={handleAccept}
            onSendBack={(application) => {
              setReason("");
              setSendBackTarget(application);
            }}
          />
        ))}
      </div>

      <Modal
        open={Boolean(sendBackTarget)}
        onClose={closeSendBack}
        title="Send application back"
        description={`Tell ${targetName} exactly what needs to be updated.`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="row-send-back-reason"
              className="text-sm font-medium text-ink"
            >
              Reason
            </label>
            <textarea
              id="row-send-back-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              autoFocus
              placeholder="Describe what the student needs to fix"
              className="focus-ring mt-2 w-full resize-y rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              The student will see this message.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={closeSendBack}
              disabled={isSendingBack}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSendBack}
              disabled={!reason.trim() || isSendingBack}
            >
              <Undo2 size={15} />
              Send back
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrganisationGroupList;
