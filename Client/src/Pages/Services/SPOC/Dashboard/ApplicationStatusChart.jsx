const ApplicationStatusChart = ({ data = [] }) => {
  const applicationStatus =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ label: "No Data", value: 0, color: "#6b7280" }];

  const total = applicationStatus.reduce(
    (sum, item) => sum + (item.value || 0),
    0,
  );

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="font-semibold text-ink">Application Status</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribution of student applications
          </p>
        </div>
        <div className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No applications data available
          </p>
        </div>
      </div>
    );
  }

  let currentPercentage = 0;

  const gradient = applicationStatus
    .map((item) => {
      const start = currentPercentage;
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      currentPercentage += percentage;

      return `${item.color} ${start}% ${currentPercentage}%`;
    })
    .join(", ");

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-ink">Application Status</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribution of student applications
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        <div
          className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label={`Application status distribution, ${total} total applications`}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-bold text-ink">{total}</span>
            <span className="text-xs text-muted-foreground">Applications</span>
          </div>
        </div>

        <div className="w-full space-y-4 sm:max-w-48">
          {applicationStatus.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-semibold text-ink">
                  {item.value}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
