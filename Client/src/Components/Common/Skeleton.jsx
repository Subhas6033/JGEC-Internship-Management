import { motion } from "framer-motion";

const shimmer =
  "bg-gradient-to-r from-transparent via-ink-muted/10 to-transparent animate-[shimmer_1.5s_infinite]";

const Skeleton = ({
  className = "",
  variant = "text",
  width,
  height,
  rounded = "md",
}) => {
  const baseStyles = "bg-ink-muted/10";

  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-9 w-20",
    card: "h-24 w-full",
    table: "h-12 w-full",
    tableRow: "h-14 w-full",
  };

  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const style = {
    width: width || (variants[variant] ? undefined : "100%"),
    height: height || variants[variant] || undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant] || ""} ${roundedStyles[rounded]} ${className}`}
      style={style}
    />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="w-full space-y-2" role="status" aria-label="Loading data">
    <div className="flex gap-3 px-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} variant="text" className="flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={`row-${rowIndex}`}
        className="flex items-center gap-3 rounded-lg border border-border/50 bg-surface px-4 py-3"
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={`cell-${rowIndex}-${colIndex}`}
            variant="text"
            className="flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="min-w-0">
    <div className="border-border bg-surface shadow-(--shadow-card)">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Skeleton variant="text" width="60px" />
            <Skeleton variant="title" width="40px" />
            <Skeleton variant="text" width="100px" />
          </div>
          <Skeleton variant="card" width="40px" height="40px" rounded="lg" />
        </div>
      </div>
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="mt-6 w-full min-w-0">
    <div className="border-border bg-surface shadow-none">
      <div className="p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
          <Skeleton variant="card" width="36px" height="36px" rounded="lg" />
          <div className="min-w-0 space-y-2">
            <Skeleton variant="text" width="200px" />
            <Skeleton variant="text" width="280px" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;