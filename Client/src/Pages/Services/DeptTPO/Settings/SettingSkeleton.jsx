import { Card } from "../../../../Components";

const Bar = ({ className }) => (
  <div className={`animate-pulse rounded bg-cream-dark ${className}`} />
);

// Matches the real layout so the page doesn't jump when data arrives.
const SettingsSkeleton = () => (
  <div className="space-y-8">
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="size-14 animate-pulse rounded-full bg-cream-dark" />
        <div className="space-y-2">
          <Bar className="h-5 w-48" />
          <Bar className="h-4 w-64" />
        </div>
      </div>
    </Card>

    {[1, 2].map((item) => (
      <div
        key={item}
        className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
      >
        <div className="space-y-2">
          <Bar className="h-5 w-36" />
          <Bar className="h-4 w-52" />
        </div>
        <Card className="p-5">
          <div className="space-y-4">
            <Bar className="h-10" />
            <Bar className="h-10" />
          </div>
        </Card>
      </div>
    ))}
  </div>
);

export default SettingsSkeleton;
