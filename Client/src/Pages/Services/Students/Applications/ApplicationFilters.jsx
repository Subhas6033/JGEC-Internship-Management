import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button, Select } from "../../../../Components/index";

const ApplicationFilters = ({
  search,
  status,
  type,
  sort,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="border-b border-border pb-5">
      <div className="flex flex-col gap-4">
        {/* Filter heading */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            strokeWidth={1.8}
            className="text-brand-700"
          />

          <p className="text-sm font-semibold text-ink">Filter applications</p>
        </div>

        {/* Filters */}
        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))_auto]
          "
        >
          {/* Search */}
          <div className="relative">
            <label htmlFor="application-search" className="sr-only">
              Search applications
            </label>

            <Search
              size={16}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-ink-muted
              "
            />

            <input
              id="application-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search company, role or ID..."
              className="
                focus-ring
                h-10
                w-full
                rounded-md
                border
                border-border
                bg-cream-soft
                pl-9
                pr-3
                text-sm
                text-ink
                outline-none
                transition-colors
                placeholder:text-ink-muted
                focus:border-brand-600
              "
            />
          </div>

          <Select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Submitted", value: "submitted" },
              { label: "Under review", value: "under_review" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
            placeholder={null}
            className="
              border-border!
              bg-cream-soft!
              text-ink!
              focus:border-brand-600!
              focus:ring-brand-600/20!
            "
          />

          <Select
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            options={[
              { label: "All internship types", value: "all" },
              { label: "Summer", value: "summer" },
              { label: "Winter", value: "winter" },
              { label: "Full-time", value: "full_time" },
            ]}
            placeholder={null}
            className="
              border-border!
              bg-cream-soft!
              text-ink!
              focus:border-brand-600!
              focus:ring-brand-600/20!
            "
          />

          <Select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            options={[
              { label: "Newest first", value: "newest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Company A–Z", value: "company" },
            ]}
            placeholder={null}
            className="
              border-border!
              bg-cream-soft!
              text-ink!
              focus:border-brand-600!
              focus:ring-brand-600/20!
            "
          />

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onReset}
            className="
              h-10
              border
              border-border
              text-ink-muted
              hover:bg-cream-dark
              hover:text-ink
            "
          >
            <RotateCcw size={15} strokeWidth={1.8} />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
