import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "../../../../Components/index";
import { PAGE_SIZES } from "./organisations.utils";

const getPageItems = (page, totalPages) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("start-gap");
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push("end-gap");
  items.push(totalPages);

  return items;
};

const base =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  disabled = false,
}) => {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 md:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="text-sm text-ink-muted" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-ink">
            {from}–{to}
          </span>{" "}
          of <span className="font-semibold text-ink">{total}</span>
        </p>

        <div className="w-32">
          <Select
            value={String(limit)}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            options={PAGE_SIZES.map((size) => ({
              label: `${size} / page`,
              value: String(size),
            }))}
            aria-label="Rows per page"
          />
        </div>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled || page <= 1}
            aria-label="Previous page"
            className={`${base} text-ink-muted hover:bg-cream-soft hover:text-ink`}
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>

          {getPageItems(page, totalPages).map((item) =>
            typeof item === "string" ? (
              <span
                key={item}
                aria-hidden="true"
                className="px-1 text-ink-muted"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                disabled={disabled}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${base} ${
                  item === page
                    ? "bg-brand-700 text-white"
                    : "text-ink-muted hover:bg-cream-soft hover:text-ink"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={disabled || page >= totalPages}
            aria-label="Next page"
            className={`${base} text-ink-muted hover:bg-cream-soft hover:text-ink`}
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
