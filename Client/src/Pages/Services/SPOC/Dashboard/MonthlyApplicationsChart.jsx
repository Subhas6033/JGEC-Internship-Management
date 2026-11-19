const MonthlyApplicationsChart = ({ data = [] }) => {
  const monthlyApplications = Array.isArray(data) && data.length > 0
    ? data
    : [
        { month: "Jan", applications: 0 },
        { month: "Feb", applications: 0 },
        { month: "Mar", applications: 0 },
        { month: "Apr", applications: 0 },
        { month: "May", applications: 0 },
        { month: "Jun", applications: 0 },
        { month: "Jul", applications: 0 },
        { month: "Aug", applications: 0 },
        { month: "Sep", applications: 0 },
        { month: "Oct", applications: 0 },
        { month: "Nov", applications: 0 },
        { month: "Dec", applications: 0 },
      ];

  const hasData = monthlyApplications.some((item) => item.applications > 0);

  if (!hasData) {
    return (
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-ink">Monthly Applications</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Application activity throughout the year
          </p>
        </div>
        <div className="flex h-56 items-center justify-center">
          <p className="text-sm text-muted-foreground">No application data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...monthlyApplications.map((item) => item.applications || 0),
    1 // Prevent division by zero
  );

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-ink">Monthly Applications</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Application activity throughout the year
        </p>
      </div>

      <div className="flex h-56 items-end gap-2 overflow-x-auto pb-2 sm:gap-3">
        {monthlyApplications.map((item) => {
          const height = maxValue > 0 ? ((item.applications || 0) / maxValue) * 100 : 0;

          return (
            <div
              key={item.month}
              className="flex h-full min-w-7 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {item.applications || 0}
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  title={`${item.month}: ${item.applications || 0} applications`}
                />
              </div>

              <span className="text-[10px] text-muted-foreground sm:text-xs">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyApplicationsChart;