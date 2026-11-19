import { CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import {
  formatDate,
  getApplicationId,
  getDepartment,
  getRollNumber,
  getStatusClass,
  getStatusLabel,
  getStudentEmail,
  getStudentName,
  getValue,
  isAcceptedCandidate,
  isPendingForSpoc,
} from "./spocDashboard.utils";

const ApplicationRow = ({
  application,
  selected,
  actionLoading,
  bulkLoading,
  onToggleSelection,
  onView,
  onDecision,
}) => {
  const applicationId = getApplicationId(application);
  const studentName = getStudentName(application);
  const accepted = isAcceptedCandidate(application);
  const pending = isPendingForSpoc(application);

  return (
    <tr className="transition hover:bg-cream-soft/60">
      <td className="px-4 py-4 text-center">
        {accepted ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelection(applicationId)}
            disabled={bulkLoading}
            className="h-4 w-4 rounded border-border text-brand-700 focus:ring-brand-500"
            aria-label={`Select ${studentName} for bulk NOC generation`}
          />
        ) : (
          <span className="text-ink-muted">—</span>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {studentName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-ink">{studentName}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {getStudentEmail(application)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="font-mono text-sm text-ink">
          {getRollNumber(application)}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm font-medium text-ink">
          {getDepartment(application)}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-ink">
          {getValue(
            application?.designation,
            application?.type || "Internship",
          )}
        </p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {getValue(application?.modeOfInternship)}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-ink">
          {formatDate(application?.tentativeStartDate)}
        </p>
        <p className="mt-0.5 text-xs text-ink-muted">
          to {formatDate(application?.tentativeEndDate)}
        </p>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
            application?.status,
          )}`}
        >
          {getStatusLabel(application?.status)}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(application)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <Eye size={15} />
            View
          </button>

          {pending && (
            <>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onDecision(application, "approve")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                Accept
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onDecision(application, "reject")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle size={15} />
                Reject
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onDecision(application, "send_back")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={15} />
                Send Back
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;
