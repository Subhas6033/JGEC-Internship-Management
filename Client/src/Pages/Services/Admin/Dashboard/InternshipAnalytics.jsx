import { Card } from "../../../../Components/index";
import { internshipTrends } from "./dashboard.data";

const InternshipAnalytics = () => {
  const maxValue = Math.max(
    ...internshipTrends.map((item) => item.applications),
  );

  return (
    <Card>
      <Card.Header className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <Card.Title>Internship Overview</Card.Title>
          <p className="mt-1 text-sm text-ink-muted">
            Monthly applications and student selections
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-brand-700" />
            Applications
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-brand-300" />
            Selections
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="mb-6 flex items-end gap-8">
          <div>
            <p className="text-xs text-ink-muted">Total applications</p>
            <p className="mt-1 text-2xl font-semibold text-ink">1,842</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Total selections</p>
            <p className="mt-1 text-2xl font-semibold text-ink">486</p>
          </div>
        </div>

        <div className="flex h-64 items-end gap-2 border-b border-border pb-2 sm:gap-4">
          {internshipTrends.map((item) => (
            <div
              key={item.month}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div className="flex h-full items-end justify-center gap-1">
                <div
                  title={`${item.applications} applications`}
                  className="w-2/5 max-w-6 rounded-t-sm bg-brand-700 transition-all hover:opacity-75"
                  style={{
                    height: `${(item.applications / maxValue) * 100}%`,
                  }}
                />

                <div
                  title={`${item.selections} selections`}
                  className="w-2/5 max-w-6 rounded-t-sm bg-brand-300 transition-all hover:opacity-75"
                  style={{
                    height: `${(item.selections / maxValue) * 100}%`,
                  }}
                />
              </div>

              <span className="mt-3 text-center text-[10px] text-ink-muted sm:text-xs">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default InternshipAnalytics;
