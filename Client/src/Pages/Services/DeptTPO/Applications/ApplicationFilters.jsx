import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../../../../Components";

const ApplicationFilters = ({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
}) => {
  return (
    <div className="rounded-xl border border-border bg-cream-soft p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-ink">Find Applications</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Search by student, organisation, internship role, or location.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event?.target?.value ?? event)}
            placeholder="Search student, organisation, role or location..."
            className="h-11 w-full pl-10 pr-10"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 lg:w-64">
          <SlidersHorizontal size={17} className="shrink-0 text-ink-muted" />

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-cream px-3 text-sm text-ink outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_tpo_review">Under TPO Review</option>
            <option value="update_required">Update Required</option>
            <option value="approved_by_tpo">Approved by TPO</option>
            <option value="under_spoc_review">Under SPOC Review</option>
            <option value="approved_by_spoc">Approved by SPOC</option>
            <option value="noc_generated">NOC Generated</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
