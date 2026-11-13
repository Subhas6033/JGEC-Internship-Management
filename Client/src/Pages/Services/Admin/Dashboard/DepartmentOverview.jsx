import { Card } from "../../../../Components/index";
import { departmentStats } from "./dashboard.data";

const DepartmentOverview = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Department Performance</Card.Title>
        <p className="text-sm text-ink-muted">
          Student participation and selections
        </p>
      </Card.Header>

      <Card.Content className="space-y-5">
        {departmentStats.map((department) => {
          const percentage = Math.round(
            (department.selected / department.students) * 100,
          );

          return (
            <div key={department.name}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">
                  {department.name}
                </p>

                <p className="shrink-0 text-xs text-ink-muted">
                  {department.selected}/{department.students}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-cream-soft">
                <div
                  className="h-full rounded-full bg-brand-700 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-1 text-right text-[11px] text-ink-muted">
                {percentage}% selected
              </p>
            </div>
          );
        })}
      </Card.Content>
    </Card>
  );
};

export default DepartmentOverview;
