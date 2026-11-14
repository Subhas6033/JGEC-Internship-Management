import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../Components/index";

const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis-start");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis-end");
  pages.push(total);

  return pages;
};

const Pagination = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-ink-muted">
        Showing {from}–{to} of {totalItems}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page numbers on larger screens */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {getPages(page, totalPages).map((item) =>
            typeof item === "string" ? (
              <span key={item} className="px-1 text-sm text-ink-muted">
                …
              </span>
            ) : (
              <Button
                key={item}
                size="sm"
                variant={item === page ? "primary" : "ghost"}
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className="min-w-8 px-2"
              >
                {item}
              </Button>
            ),
          )}
        </div>

        {/* Compact indicator on mobile */}
        <span className="px-2 text-sm text-ink sm:hidden">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
