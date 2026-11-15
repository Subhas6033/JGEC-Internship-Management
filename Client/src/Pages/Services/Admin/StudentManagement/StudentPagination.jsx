import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../Components";

const StudentPagination = ({
  currentPage,
  totalPages,
  totalStudents,
  limit,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalStudents);

  const getVisiblePages = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{start}</span>
        {" - "}
        <span className="font-semibold text-foreground">{end}</span>
        {" of "}
        <span className="font-semibold text-foreground">
          {totalStudents}
        </span>{" "}
        students
      </p>

      <div className="flex items-center justify-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="gap-1"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {getVisiblePages()[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>

            {getVisiblePages()[0] > 2 && (
              <span className="px-1 text-muted-foreground">...</span>
            )}
          </>
        )}

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
          <>
            {getVisiblePages()[getVisiblePages().length - 1] <
              totalPages - 1 && (
              <span className="px-1 text-muted-foreground">...</span>
            )}

            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default StudentPagination;
