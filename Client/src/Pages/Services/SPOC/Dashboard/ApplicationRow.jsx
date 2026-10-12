import React from "react";
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
    <tr className="transition hover:bg-slate-50/70">
      <td className="px-4 py-4 text-center">
        {accepted ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelection(applicationId)}
            disabled={bulkLoading}
            className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            aria-label={`Select ${studentName} for bulk NOC generation`}
          />
        ) : (
          <span className="text-slate-200">—</span>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
            {studentName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-800">{studentName}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {getStudentEmail(application)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="font-mono text-sm text-slate-700">
          {getRollNumber(application)}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm font-medium text-slate-700">
          {getDepartment(application)}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-slate-800">
          {getValue(
            application?.designation,
            application?.type || "Internship",
          )}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {getValue(application?.modeOfInternship)}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-slate-600">
          {formatDate(application?.tentativeStartDate)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
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
