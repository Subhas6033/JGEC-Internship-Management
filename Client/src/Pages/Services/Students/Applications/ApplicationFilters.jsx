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
  setSearch,
  setStatus,
  setType,
  setSort,
}) => {
  const handleSearchChange = onSearchChange || setSearch;
  const handleStatusChange = onStatusChange || setStatus;
  const handleTypeChange = onTypeChange || setType;
  const handleSortChange = onSortChange || setSort;

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }
    setSearch?.("");
    setStatus?.("all");
    setType?.("all");
    setSort?.("newest");
  };

  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Heading */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal size={15} strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Filter applications
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Search and organize your applications
              </p>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(145px,1fr))_auto]">
          {/* Search */}
          <div className="relative min-w-0">
            <label htmlFor="application-search" className="sr-only">
              Search applications
            </label>
            <Search
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="application-search"
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search company, role or ID..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-border
                bg-background
                pl-9
                pr-3
                text-sm
                text-foreground
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          <Select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value)}
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
              bg-background!
              text-foreground!
              focus:border-primary!
              focus:ring-primary/10!
            "
          />

          <Select
            value={type}
            onChange={(event) => handleTypeChange(event.target.value)}
            options={[
              { label: "All internship types", value: "all" },
              { label: "Summer", value: "summer" },
              { label: "Winter", value: "winter" },
              { label: "Full-time", value: "full_time" },
            ]}
            placeholder={null}
            className="
              border-border!
              bg-background!
              text-foreground!
              focus:border-primary!
              focus:ring-primary/10!
            "
          />

          <Select
            value={sort}
            onChange={(event) => handleSortChange(event.target.value)}
            options={[
              { label: "Newest first", value: "newest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Company A–Z", value: "company" },
            ]}
            placeholder={null}
            className="
              border-border!
              bg-background!
              text-foreground!
              focus:border-primary!
              focus:ring-primary/10!
            "
          />

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleReset}
            className="
              h-10
              border
              border-border
              bg-background
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
          >
            <RotateCcw size={15} strokeWidth={1.8} />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
