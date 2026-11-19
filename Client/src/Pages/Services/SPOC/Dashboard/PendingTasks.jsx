import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-blue-100 text-blue-700",
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[priority] || priorityStyles.Low}`}
    >
      {priority}
    </span>
  );
};

const PendingTasks = ({ data = [], onViewAll }) => {
  const tasks =
    Array.isArray(data) && data.length > 0
      ? data
      : [
          {
            id: "no_data",
            title: "No pending tasks",
            description: "All tasks are up to date",
            priority: "Low",
          },
        ];

  const hasData = tasks.some((task) => task.title !== "No pending tasks");

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">Pending Tasks</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks that need your attention
          </p>
        </div>

        {hasData && <AlertCircle className="h-5 w-5 text-amber-500" />}
      </div>

      <div className="space-y-4">
        {tasks.filter((t) => t.title !== "No pending tasks").length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-ink">{task.title}</p>

                  <PriorityBadge priority={task.priority} />
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {task.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={19} />
            </div>
            <p className="text-sm font-medium text-ink">No pending tasks</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              You've caught up on all your tasks. Great job!
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all tasks
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default PendingTasks;
