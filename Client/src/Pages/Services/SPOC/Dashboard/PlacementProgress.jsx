const PlacementProgress = ({ data = null }) => {
  const {
    totalStudents = 0,
    selectedStudents = 0,
    shortlistedStudents = 0,
    pendingStudents = 0,
    placementRate = 0,
  } = data || {};

  const calculatedPlacementRate = placementRate > 0
    ? placementRate
    : totalStudents > 0
      ? (selectedStudents / totalStudents) * 100
      : 0;

  const metrics = [
    {
      label: "Selected",
      value: selectedStudents,
      color: "bg-green-500",
    },
    {
      label: "Shortlisted",
      value: shortlistedStudents,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: pendingStudents,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-ink">Placement Progress</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Student selection overview
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-ink">
            {calculatedPlacementRate.toFixed(1)}%
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Selection rate</p>
        </div>

        <p className="text-sm font-medium text-ink">
          {selectedStudents}/{totalStudents} students
        </p>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${Math.min(calculatedPlacementRate, 100)}%` }}
        />
      </div>

      <div className="mt-6 space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-semibold text-ink">{metric.value}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${metric.color}`}
                style={{
                  width: `${
                    totalStudents
                      ? Math.min((metric.value / totalStudents) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementProgress;