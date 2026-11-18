import { Search, X } from "lucide-react";
import { Input, Select } from "../../../../Components/index";
import { SORT_OPTIONS } from "./organisations.utils";

const CompanyToolbar = ({
  search,
  onSearchChange,
  location,
  onLocationChange,
  locationOptions = [],
  sort,
  onSortChange,
  onClear,
}) => {
  const hasFilters = Boolean(search || location);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full flex-1">
          <Input
            placeholder="Search by name, email, website or location…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            startIcon={<Search size={18} />}
            animate={false}
            containerClassName="w-full"
            aria-label="Search organisations"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-136">
          <Select
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            placeholder="All locations"
            options={locationOptions.map((value) => ({ label: value, value }))}
            aria-label="Filter by location"
          />

          <Select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            options={SORT_OPTIONS}
            aria-label="Sort organisations"
          />
        </div>
      </div>

      {hasFilters && (
        <div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <X size={15} aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyToolbar;
