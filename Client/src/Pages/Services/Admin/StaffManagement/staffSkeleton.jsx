import { Card } from "../../../../Components/index";

const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-cream-soft ${className}`} />
);

export const StaffStatSkeleton = () => (
  <Card className="border-border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <Bone className="h-4 w-24" />
        <Bone className="h-7 w-16" />
        <Bone className="h-3 w-36" />
      </div>
      <Bone className="h-12 w-12 rounded-xl" />
    </div>
  </Card>
);

export const StaffTableSkeleton = ({ rows = 8 }) => (
  <div aria-busy="true" aria-label="Loading staff">
    <div className="grid grid-cols-6 gap-4 border-b border-border px-5 py-3">
      {["w-24", "w-12", "w-20", "w-24", "w-20", "w-14"].map((w, i) => (
        <Bone key={i} className={`h-3 ${w}`} />
      ))}
    </div>

    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 items-center gap-4 px-5 py-4">
          <div className="space-y-2">
            <Bone className="h-4 w-32" />
            <Bone className="h-3 w-20" />
          </div>
          <Bone className="h-6 w-14" />
          <Bone className="h-4 w-16" />
          <Bone className="h-4 w-36" />
          <Bone className="h-6 w-20 rounded-full" />
          <div className="flex justify-end gap-2">
            <Bone className="h-8 w-8" />
            <Bone className="h-8 w-8" />
            <Bone className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
