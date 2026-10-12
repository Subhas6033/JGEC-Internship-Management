import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

import {
  getDepartment,
  getRollNumber,
  getStudentName,
} from "./spocDashboard.utils";

const GenerateNocModal = ({
  organisation,
  acceptedApplications,
  selectedApplicationIds,
  onToggle,
  onSelectAll,
  onClear,
  result,
  error,
  loading,
  onClose,
  onSubmit,
}) => {
  const selectedCount = selectedApplicationIds?.length || 0;
  const totalCount = acceptedApplications?.length || 0;
  const allSelected = totalCount > 0 && selectedCount === totalCount;

  const groups = Array.isArray(result?.groups) ? result.groups : [];
  const skipped = Array.isArray(result?.skipped) ? result.skipped : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <FileCheck size={19} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Generate Bulk NOCs
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select multiple accepted students and generate their NOCs in one
              operation.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close bulk NOC dialog"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Organisation
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {organisation?.name || "Organisation"}
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {!result ? (
            <>
              <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Accepted Students
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCount} of {totalCount} students selected
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onSelectAll}
                    disabled={loading || allSelected}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Select All
                  </button>

                  <button
                    type="button"
                    onClick={onClear}
                    disabled={loading || selectedCount === 0}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {acceptedApplications.map((application) => {
                  const id =
                    application?.applicationId ||
                    application?.id ||
                    application?._id ||
                    application?.application?._id;

                  const isSelected = selectedApplicationIds?.includes(id);

                  return (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50/60"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(isSelected)}
                        onChange={() => onToggle(id)}
                        disabled={loading}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {getStudentName(application)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Roll No: {getRollNumber(application)}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {getDepartment(application)}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      How bulk NOC generation works
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-800">
                      Selected students are sent to the backend in a single
                      request and grouped by organisation and department.
                      Students in the same group receive the same NOC/reference
                      number.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">
                      Bulk NOC Generation Completed
                    </h3>
                    <p className="mt-1 text-sm text-emerald-800">
                      {groups.length} NOC group{groups.length !== 1 ? "s" : ""}{" "}
                      generated successfully.
                    </p>
                  </div>
                </div>
              </div>

              {groups.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Generated NOCs
                  </h3>

                  <div className="space-y-3">
                    {groups.map((group, index) => {
                      const count =
                        group?.applicationIds?.length ||
                        group?.nocs?.length ||
                        0;

                      return (
                        <div
                          key={`${group?.referenceNumber || "group"}-${index}`}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {group?.department || "Department"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Reference Number:{" "}
                                <span className="font-semibold text-slate-800">
                                  {group?.referenceNumber || "N/A"}
                                </span>
                              </p>
                            </div>

                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {count} student{count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {skipped.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-bold text-amber-900">
                        Some applications were skipped
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        {skipped.length} application
                        {skipped.length !== 1 ? "s" : ""} could not be included
                        in the generated NOCs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {groups.length === 0 && skipped.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    No NOCs were generated.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    All selected applications were skipped by the backend.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          {result ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || selectedCount === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Generating NOCs...
                  </>
                ) : (
                  <>
                    <FileCheck size={17} />
                    Generate NOCs ({selectedCount})
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateNocModal;
