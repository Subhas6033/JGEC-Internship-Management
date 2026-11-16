import { ChevronLeft, ChevronRight } from "lucide-react";

const getPageItems = (page, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("start-ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("end-ellipsis");

  items.push(totalPages);
  return items;
};

const StaffPagination = ({ page, totalPages, onPageChange, disabled }) => {
  if (totalPages <= 1) return null;

  const arrowClass =
    "flex size-8 items-center justify-center rounded-lg border border-border text-ink-muted transition hover:bg-cream-soft hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-muted";

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowClass}
      >
        <ChevronLeft size={16} />
      </button>

      {getPageItems(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="px-1 text-xs text-ink-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            disabled={disabled}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition ${
              item === page
                ? "border-brand-100 bg-brand-50 text-brand-700"
                : "border-transparent text-ink-muted hover:bg-cream-soft hover:text-ink"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={arrowClass}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default StaffPagination;
