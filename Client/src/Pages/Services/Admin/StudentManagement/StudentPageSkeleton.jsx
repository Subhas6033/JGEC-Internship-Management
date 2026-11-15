const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-cream-soft ${className}`} />
);

const StudentPageSkeleton = () => {
  return (
    <div className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-10 w-32" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-white p-5 shadow-card"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="space-y-4 border-b border-border p-5">
          <Skeleton className="h-6 w-44" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>

        <div className="space-y-5 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-52 max-w-full" />
              </div>

              <Skeleton className="hidden h-5 w-24 sm:block" />
              <Skeleton className="hidden h-5 w-20 md:block" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPageSkeleton;
