import React from "react";
import {
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

import { getOrganisation, getStudentName } from "./spocDashboard.utils";

const DecisionModal = ({
  application,
  decision,
  remarks,
  setRemarks,
  actionError,
  actionLoading,
  onClose,
  onSubmit,
}) => {
  const studentName = getStudentName(application);
  const organisation = getOrganisation(application);

  const isApprove = decision === "approve";
  const isReject = decision === "reject";
  const isSendBack = decision === "send_back";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isApprove && "Accept Application"}
                {isReject && "Reject Application"}
                {isSendBack && "Send Application Back"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isApprove
                  ? "Confirm that you want to accept this student's application."
                  : isReject
                    ? "Provide a reason for rejecting this student's application."
                    : "Explain what information or documents the student needs to update."}
              </p>
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={onClose}
              aria-label="Close decision dialog"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <XCircle size={21} />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Student
            </p>
            <p className="mt-1 font-semibold text-slate-900">{studentName}</p>
            <p className="mt-0.5 text-sm text-slate-500">
              {organisation.name}
            </p>
          </div>

          {isApprove ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm leading-6 text-emerald-800">
                  This student's application will be marked as approved by the
                  SPOC.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Remarks <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={5}
                placeholder={
                  isReject
                    ? "Explain why this application is being rejected..."
                    : "Explain what the student needs to update..."
                }
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          {actionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {actionError}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={actionLoading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={actionLoading || (!isApprove && !remarks.trim())}
            onClick={onSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              isApprove
                ? "bg-emerald-700 hover:bg-emerald-800"
                : isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {actionLoading && (
              <Loader2 size={17} className="animate-spin" />
            )}

            {actionLoading
              ? "Processing..."
              : isApprove
                ? "Confirm Accept"
                : isReject
                  ? "Reject Application"
                  : "Send Back Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;