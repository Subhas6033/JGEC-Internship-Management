import { RotateCcw, Search, X } from "lucide-react";
import { Button, Select } from "../../../../Components";

const TpoApplicationFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  year,
  setYear,
  semester,
  setSemester,
  yearOptions,
  semesterOptions,
  onReset,
}) => {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "submitted", label: "Submitted" },
    { value: "under_tpo_review", label: "Under TPO Review" },
    { value: "update_required", label: "Update Required" },
    { value: "approved_by_tpo", label: "Approved by TPO" },
    { value: "under_spoc_review", label: "Under SPOC Review" },
    { value: "approved_by_spoc", label: "Approved by SPOC" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="w-full">
        <label
          htmlFor="tpo-application-search"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Search applications
        </label>

        <div className="relative">
          {/* text-base on mobile stops iOS Safari from zooming in on focus */}
          <input
            id="tpo-application-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Student, roll number or organisation"
            className="focus-ring block h-11 w-full rounded-lg border border-border bg-cream pl-10 pr-10 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-brand-700 sm:text-sm"
          />
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="focus-ring absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded text-ink-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
        <Select
          label="Year"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          options={[{ value: "all", label: "All Years" }, ...yearOptions]}
          placeholder="Select year"
        />

        <Select
          label="Semester"
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          options={[
            { value: "all", label: "All Semesters" },
            ...semesterOptions,
          ]}
          placeholder="Select semester"
        />

        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={statusOptions}
          placeholder="Select status"
        />

        <div className="flex items-end @md:col-span-2 @3xl:col-span-1">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TpoApplicationFilters;
