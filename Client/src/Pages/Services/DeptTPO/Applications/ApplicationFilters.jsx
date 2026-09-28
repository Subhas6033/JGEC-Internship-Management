import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "../../../../Components";

const ApplicationFilters = ({
  search,
  onSearchChange,
  status,
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
            placeholder="Search company, role or location..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-ink-muted" />

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="
              focus-ring
              h-10
              rounded-lg
              border
              border-border
              bg-cream
              px-3
              text-sm
              text-ink
              outline-none
            "
          >
            <option value="all">All Companies</option>
            <option value="open">Applications Open</option>
            <option value="closed">Deadline Passed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
