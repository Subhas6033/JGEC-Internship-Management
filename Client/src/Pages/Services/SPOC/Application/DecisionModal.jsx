import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, Input, Modal } from "../../../../Components/index";

export default function DecisionModal({
  open,
  decision,
  remarks,
  setRemarks,
  actionError,
  actionLoading,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const isApprove = decision === "approve";
  const isSendBack = decision === "send_back";
  const title = isApprove
    ? "Approve Application"
    : isSendBack
      ? "Send Back for Updates"
      : "Reject Application";

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-5">
        {isApprove ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-emerald-700"
            />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Confirm approval
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                The application will be marked as approved by the SPOC.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Remarks <span className="text-red-500">*</span>
            </label>
            <Input
              multiline
              rows={5}
              value={remarks}
              onChange={setRemarks}
              placeholder={
                isSendBack
                  ? "Explain what information or documents need to be updated..."
                  : "Explain why this application is being rejected..."
              }
            />
            <p className="mt-2 text-xs text-slate-500">
              {isSendBack
                ? "Provide clear instructions so the applicant knows what to update."
                : "A reason is required to submit this decision."}
            </p>
          </div>
        )}

        {actionError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{actionError}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          <Button
            disabled={actionLoading}
            onClick={onClose}
            className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            disabled={actionLoading || (!isApprove && !remarks.trim())}
            onClick={onSubmit}
            className={
              isApprove
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : isSendBack
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {actionLoading
              ? "Processing..."
              : isApprove
                ? "Confirm Approval"
                : isSendBack
                  ? "Send Back"
                  : "Confirm Rejection"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
