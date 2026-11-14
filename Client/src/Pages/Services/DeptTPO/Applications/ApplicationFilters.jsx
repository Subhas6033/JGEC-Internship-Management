import { Search, X } from "lucide-react";
import { Input } from "../../../../Components";
import { STATUS_CONFIG, STATUS_GROUPS } from "./applicationUtils";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "organisation", label: "Organisation A–Z" },
  { value: "status", label: "Status" },
];

const STATUS_OPTIONS = [
  "submitted",
  "under_tpo_review",
  "update_required",
  "approved_by_tpo",
  "under_spoc_review",
  "approved_by_spoc",
  "noc_generated",
  "rejected",
  "withdrawn",
];

const selectClass =
  "focus-ring h-11 w-full rounded-lg border border-border bg-cream px-3 text-sm text-ink outline-none transition focus:border-brand-700";

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-2.5 py-1 text-xs font-medium text-ink">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="focus-ring rounded-full text-ink-muted hover:text-ink"
    >
      <X size={13} />
    </button>
  </span>
);

const ApplicationFilters = ({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
  organisation = "all",
  onOrganisationChange,
  organisationOptions = [],
  sort = "newest",
  onSortChange,
  statusGroup = null,
  onStatusGroupChange,
  onClearAll,
}) => {
  const orgLabel = organisationOptions.find((o) => o.id === organisation)?.name;

  const chips = [
    search && {
      key: "search",
      label: `Search: ${search}`,
      remove: () => onSearchChange(""),
    },
    status !== "all" && {
      key: "status",
      label: `Status: ${STATUS_CONFIG[status]?.label || status}`,
      remove: () => onStatusChange("all"),
    },
    organisation !== "all" && {
      key: "org",
      label: `Organisation: ${orgLabel || "Selected"}`,
      remove: () => onOrganisationChange("all"),
    },
    statusGroup && {
      key: "group",
      label: `Overview: ${STATUS_GROUPS[statusGroup].label}`,
      remove: () => onStatusGroupChange(null),
    },
  ].filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-cream-soft p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative min-w-0">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event?.target?.value ?? event)}
            placeholder="Student, roll number, organisation, role or location"
            aria-label="Search applications"
            className="h-11 w-full pl-10! pr-10!"
          />

          <Search
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-ink-muted"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="focus-ring absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded text-ink-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {STATUS_CONFIG[value].label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by organisation"
          value={organisation}
          onChange={(e) => onOrganisationChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">All organisations</option>
          {organisationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort applications"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-ink-muted">Active filters</span>
          {chips.map((chip) => (
            <Chip key={chip.key} label={chip.label} onRemove={chip.remove} />
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="focus-ring ml-1 rounded text-xs font-semibold text-brand-700 hover:underline hover:cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
