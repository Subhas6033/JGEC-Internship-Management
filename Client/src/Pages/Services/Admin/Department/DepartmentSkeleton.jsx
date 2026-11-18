import { Card } from "../../../../Components/index";

const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-cream-soft ${className}`} />
);

export const DepartmentStatSkeleton = () => (
  <Card className="min-w-0 border border-border bg-white p-5 shadow-card">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-3">
        <Bone className="h-4 w-28" />
        <Bone className="h-7 w-14" />
        <Bone className="h-3 w-36" />
      </div>
      <Bone className="h-12 w-12 rounded-xl" />
    </div>
  </Card>
);

export const DepartmentTableSkeleton = ({ rows = 6 }) => (
  <div
    aria-busy="true"
    aria-label="Loading departments"
    className="min-w-262.5"
  >
    <div className="grid grid-cols-5 gap-4 border-b border-border px-4 py-3">
      {["w-24", "w-28", "w-20", "w-16", "w-14"].map((w, i) => (
        <Bone key={i} className={`h-3 ${w}`} />
      ))}
    </div>

    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Bone className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Bone className="h-4 w-36" />
              <Bone className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <Bone className="h-4 w-28" />
            <Bone className="h-3 w-36" />
          </div>
          <div className="space-y-2">
            <Bone className="h-4 w-28" />
            <Bone className="h-3 w-36" />
          </div>
          <Bone className="h-4 w-10" />
          <div className="flex justify-end">
            <Bone className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
