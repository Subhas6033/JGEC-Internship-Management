import {
  CheckCircle2,
  FileText,
  RotateCcw,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import { Button, Card } from "../../../../Components/index";

export default function ApplicationActions({
  canReview,
  hasGeneratedNoc,
  actionLoading,
  onApprove,
  onSendBack,
  onReject,
  onOpenNoc,
}) {
  return (
    <Card className="border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-900">Review Actions</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Choose the appropriate action for this application.
      </p>

      <div className="mt-5 space-y-3">
        {canReview && (
          <>
            <Button
              block
              disabled={actionLoading}
              onClick={onApprove}
              className="bg-emerald-700 text-white hover:bg-emerald-800"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {actionLoading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Approve Application
              </span>
            </Button>

            <Button
              block
              disabled={actionLoading}
              onClick={onSendBack}
              className="border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <RotateCcw size={16} />
                Send Back for Updates
              </span>
            </Button>

            <Button
              block
              disabled={actionLoading}
              onClick={onReject}
              className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <XCircle size={16} />
                Reject Application
              </span>
            </Button>
          </>
        )}

        {hasGeneratedNoc && (
          <Button
            block
            disabled={actionLoading}
            onClick={onOpenNoc}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <FileText size={16} />
              {actionLoading ? "Opening NOC..." : "View NOC PDF"}
            </span>
          </Button>
        )}

        {!canReview && !hasGeneratedNoc && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            Review actions are unavailable for the current application status.
          </p>
        )}
      </div>
    </Card>
  );
}
