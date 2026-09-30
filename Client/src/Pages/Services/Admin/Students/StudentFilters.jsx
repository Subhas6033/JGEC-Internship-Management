import { Search, SlidersHorizontal } from "lucide-react";
import { Card, Select } from "../../../../Components/index";

const StudentFilters = () => {
  return (
    <Card className="border-border bg-white shadow-card">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />

          <input
            type="search"
            placeholder="Search by name, roll number, email..."
            className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Select
            aria-label="Department"
            className="min-w-44"
            options={[
              { label: "All departments", value: "all" },
              { label: "CSE", value: "cse" },
              { label: "IT", value: "it" },
              { label: "Electrical", value: "electrical" },
              { label: "Mechanical", value: "mechanical" },
            ]}
          />

          <Select
            aria-label="Status"
            className="min-w-40"
            options={[
              { label: "All status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Graduated", value: "graduated" },
            ]}
          />

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-ink-muted transition hover:bg-cream hover:text-ink"
          >
            <SlidersHorizontal size={16} strokeWidth={1.8} />
            Filters
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StudentFilters;
