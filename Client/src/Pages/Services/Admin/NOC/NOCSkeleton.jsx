// Pages/Services/Admin/NOC/NOCSkeleton.jsx
import { Card } from "../../../../Components/index";

const Block = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-border/70 ${className}`} />
);

// Matches the layout of NOCStatCard
export const NOCStatSkeleton = () => (
  <Card className="border-border bg-white p-5 shadow-sm" aria-hidden="true">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <Block className="h-4 w-28" />
        <Block className="h-7 w-16" />
        <Block className="h-3 w-36" />
      </div>

      <Block className="h-11 w-11 rounded-xl" />
    </div>
  </Card>
);

export const NOCStatsSkeleton = () => (
  <>
    {[...Array(4)].map((_, index) => (
      <NOCStatSkeleton key={index} />
    ))}
  </>
);

// Matches the columns of NOCTable
export const NOCTableSkeleton = ({ rows = 6 }) => (
  <div
    className="w-full overflow-x-auto"
    role="status"
    aria-busy="true"
    aria-label="Loading generated NOCs"
  >
    <div className="min-w-205">
      {/* Header */}
      <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_0.7fr] gap-4 border-b border-border bg-cream-soft/50 px-5 py-3">
        {["w-16", "w-20", "w-20", "w-24", "w-24", "w-14"].map(
          (width, index) => (
            <Block key={index} className={`h-3 ${width}`} />
          ),
        )}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {[...Array(rows)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_0.7fr] items-center gap-4 px-5 py-4"
          >
            <div className="space-y-2">
              <Block className="h-4 w-36" />
              <Block className="h-3 w-20" />
            </div>

            <div className="space-y-2">
              <Block className="h-4 w-32" />
              <Block className="h-3 w-24" />
            </div>

            <Block className="h-4 w-24" />

            <Block className="h-4 w-24" />

            <Block className="h-6 w-20 rounded-full" />

            <div className="flex justify-end gap-2">
              <Block className="h-8 w-8 rounded-lg" />
              <Block className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
