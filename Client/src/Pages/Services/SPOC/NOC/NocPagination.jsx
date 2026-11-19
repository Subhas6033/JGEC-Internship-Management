import { ChevronLeft, ChevronRight } from "lucide-react";

const NocPagination = ({ page, pageCount, total, pageSize, onPageChange }) => {
  if (total === 0 || pageCount <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="NOC list pagination"
      className="flex flex-col gap-3 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-xs text-ink-muted sm:text-sm">
        Showing <span className="font-semibold text-ink">{start}–{end}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span>
      </p>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`inline-flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${pageNumber === page ? "border-brand-600 bg-brand-600 text-white" : "border-border text-ink-muted hover:bg-brand-50 hover:text-brand-700"}`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default NocPagination;
