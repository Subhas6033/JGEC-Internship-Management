import { ArrowLeft, AlertCircle, X } from "lucide-react";
import { StatusBadge } from "./DetailComponents";
import { Button } from "../../../../Components/index";

export default function ApplicationHeader({
  application,
  applicationId,
  navigate,
  statusLabel,
  error,
  onClearError,
  onRetry,
}) {
  return (
    <>
      <div className="mb-6">
        <Button
          type="button"
          onClick={() => navigate("/spoc/applications")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Applications
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Application Details
              </h1>
              <StatusBadge status={application?.status} label={statusLabel} />
            </div>
            <p className="text-sm text-slate-500">
              Review the student's internship application.
            </p>
          </div>

          <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-64">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Application ID
            </p>
            <p className="mt-1 truncate font-mono text-sm text-slate-700">
              {application?._id || application?.id || applicationId}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={19} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Action failed</p>
            <p className="mt-1 wrap-break-word">{error}</p>
            {onRetry && (
              <Button
                type="button"
                onClick={onRetry}
                className="mt-2 font-semibold underline"
              >
                Try again
              </Button>
            )}
          </div>
          {onClearError && (
            <Button
              type="button"
              onClick={onClearError}
              aria-label="Dismiss error"
              className="shrink-0 text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
