import { RotateCcw, Search } from "lucide-react";
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
    {
      value: "all",
      label: "All Statuses",
    },
    {
      value: "submitted",
      label: "Submitted",
    },
    {
      value: "under_tpo_review",
      label: "Under TPO Review",
    },
    {
      value: "update_required",
      label: "Update Required",
    },
    {
      value: "approved_by_tpo",
      label: "Approved by TPO",
    },
    {
      value: "under_spoc_review",
      label: "Under SPOC Review",
    },
    {
      value: "approved_by_spoc",
      label: "Approved by SPOC",
    },
    {
      value: "rejected",
      label: "Rejected",
    },
    {
      value: "withdrawn",
      label: "Withdrawn",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="w-full">
        <label
          htmlFor="tpo-application-search"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Search Applications
        </label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />

          <input
            id="tpo-application-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, roll number or organisation..."
            className="
              block
              h-12
              w-full
              rounded-lg
              border
              border-border
              bg-cream-soft
              pl-10
              pr-3
              text-sm
              text-ink
              outline-none
              transition-all
              placeholder:text-ink-muted
              focus:border-brand-600
              focus:ring-2
              focus:ring-brand-600/15
            "
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Year"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          options={[
            {
              value: "all",
              label: "All Years",
            },
            ...yearOptions,
          ]}
          placeholder="Select year"
        />

        <Select
          label="Semester"
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          options={[
            {
              value: "all",
              label: "All Semesters",
            },
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

        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TpoApplicationFilters;
