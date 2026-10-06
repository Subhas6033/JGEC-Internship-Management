import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../../../Components";

const ApplicationFilters = ({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
}) => {
  return (
    <div className="rounded-xl border border-border bg-cream-soft p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search student, company, role or location..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-ink-muted" />

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="focus-ring h-10 rounded-lg border border-border bg-cream px-3 text-sm text-ink outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_tpo_review">Under TPO Review</option>
            <option value="update_required">Update Required</option>
            <option value="approved_by_tpo">Approved by TPO</option>
            <option value="under_spoc_review">Under SPOC Review</option>
            <option value="approved_by_spoc">Approved by SPOC</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
