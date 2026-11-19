const StatCard = ({
  title,
  value,
  change,
  description,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {change && (
          <span className="text-xs font-semibold text-green-600">{change}</span>
        )}

        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;
