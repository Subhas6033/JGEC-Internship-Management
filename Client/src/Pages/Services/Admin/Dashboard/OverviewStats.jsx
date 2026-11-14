import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../../../../Components/index";
import { overviewStats } from "./dashboard.data";

const colorStyles = {
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
};

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  const isPositive = stat.change.startsWith("+");

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <Card.Content className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {stat.value}
            </h3>
          </div>

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}
          >
            <Icon size={21} strokeWidth={1.8} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {isPositive ? (
            <ArrowUpRight size={15} className="text-green-600" />
          ) : (
            <span className="size-1.5 rounded-full bg-amber-500" />
          )}

          <span
            className={`text-xs font-semibold ${
              isPositive ? "text-green-600" : "text-amber-600"
            }`}
          >
            {stat.change}
          </span>

          <span className="text-xs text-ink-muted">{stat.description}</span>
        </div>
      </Card.Content>
    </Card>
  );
};

const OverviewStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewStats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
};

export default OverviewStats;
