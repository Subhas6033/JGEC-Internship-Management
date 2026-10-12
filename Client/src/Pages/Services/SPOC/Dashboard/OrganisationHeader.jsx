import React from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Loader2,
  Mail,
  MapPin,
} from "lucide-react";

const OrganisationHeader = ({
  organisation,
  isExpanded,
  pendingCount,
  acceptedCount,
  allAcceptedSelected,
  loading,
  onToggle,
  onToggleBulkSelection,
  onGenerateNoc,
}) => {
  const studentCount = organisation.applications.length;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Building2 size={21} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-bold text-slate-900 md:text-lg">
              {organisation.name}
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {studentCount} {studentCount === 1 ? "student" : "students"}
            </span>

            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {pendingCount} pending
              </span>
            )}

            {acceptedCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {acceptedCount} accepted
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {organisation.location !== "—" && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} />
                {organisation.location}
              </span>
            )}

            {organisation.email !== "—" && (
              <span className="inline-flex items-center gap-1">
                <Mail size={13} />
                {organisation.email}
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        {acceptedCount > 1 && (
          <button
            type="button"
            onClick={onToggleBulkSelection}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileCheck size={15} />
            {allAcceptedSelected ? "Clear Bulk" : "Select All"}
          </button>
        )}

        {acceptedCount > 0 && (
          <button
            type="button"
            onClick={onGenerateNoc}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileCheck size={15} />
            )}
            Generate NOCs
          </button>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            isExpanded ? "Collapse organisation" : "Expand organisation"
          }
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default OrganisationHeader;
