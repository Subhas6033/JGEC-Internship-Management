const Bar = ({ className }) => (
  <div className={`animate-pulse rounded bg-cream-dark ${className}`} />
);

const ApplicationsSkeleton = ({ groups = 3 }) => (
  <div className="space-y-4" role="status" aria-label="Loading applications">
    {Array.from({ length: groups }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-xl border border-border bg-cream-soft"
      >
        <div className="flex items-start gap-4 p-5">
          <Bar className="size-12 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Bar className="h-5 w-1/3" />
            <Bar className="h-3.5 w-1/4" />
            <Bar className="mt-4 h-1.5 w-full" />
          </div>
        </div>
        {index === 0 &&
          [1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 border-t border-border px-5 py-4"
            >
              <Bar className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Bar className="h-4 w-1/4" />
                <Bar className="h-3 w-1/5" />
              </div>
              <Bar className="hidden h-6 w-24 sm:block" />
            </div>
          ))}
      </div>
    ))}
    <span className="sr-only">Loading applications…</span>
  </div>
);

export default ApplicationsSkeleton;
