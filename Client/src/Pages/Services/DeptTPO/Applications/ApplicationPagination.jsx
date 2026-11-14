import { ChevronLeft, ChevronRight } from "lucide-react";

const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  const pages = [];
  for (let page = start; page <= end; page += 1) pages.push(page);
  return pages;
};

const navButton =
  "focus-ring flex size-9 items-center justify-center rounded-lg border border-border bg-cream text-ink transition hover:bg-cream-dark disabled:cursor-not-allowed disabled:opacity-40";

// Counts individual applications, not organisation groups.
const ApplicationsPagination = ({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  onPageChange,
}) => {
  if (totalItems === 0) return null;

  return (
    <nav
      aria-label="Applications pagination"
      className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-cream-soft p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-xs text-ink-muted" aria-live="polite">
        Showing{" "}
        <span className="font-semibold text-ink">
          {startItem}–{endItem}
        </span>{" "}
        of <span className="font-semibold text-ink">{totalItems}</span>{" "}
        applications
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={navButton}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>
        {getPageNumbers(currentPage, totalPages).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`focus-ring flex size-9 items-center justify-center rounded-lg text-sm font-medium transition ${
              currentPage === page
                ? "bg-brand-700 text-white shadow-sm"
                : "border border-border bg-cream text-ink hover:bg-cream-dark"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className={navButton}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
};

export default ApplicationsPagination;
