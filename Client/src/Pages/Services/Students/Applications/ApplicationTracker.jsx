import { AlertCircle, Check, Clock3, FileText, MapPin } from "lucide-react";

// Format application date
const formatApplicationDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Get individual timeline event date
const getTimelineEventDate = (item) => {
  if (!item) return null;

  const date =
    item.date ||
    item.createdAt ||
    item.timestamp ||
    item.reviewedAt ||
    item.approvedAt ||
    item.generatedAt ||
    item.updatedAt ||
    null;

  return formatApplicationDate(date);
};

// Normalize status values coming from backend
const normalizeStatus = (status) => {
  if (!status) return "";

  const normalized = String(status)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const statusAliases = {
    noce_generated: "noc_generated",
    nocgenerated: "noc_generated",
    noc_generated: "noc_generated",
  };

  return statusAliases[normalized] || normalized;
};

// Status labels
const getStatusLabel = (status) => {
  const labels = {
    draft: "Draft",
    submitted: "Submitted",
    under_tpo_review: "Under TPO Review",
    update_required: "Update Required",
    approved_by_tpo: "Approved by TPO",
    under_spoc_review: "Under SPOC Review",
    noc_generated: "NOC Generated",
    approved_by_spoc: "Approved",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return labels[status] || "Status unavailable";
};

// Status styles
const getStatusClasses = (status) => {
  const classes = {
    draft: "border-border bg-muted text-muted-foreground",
    submitted: "border-blue-200 bg-blue-50 text-blue-700",
    under_tpo_review: "border-amber-200 bg-amber-50 text-amber-700",
    update_required: "border-amber-200 bg-amber-50 text-amber-700",
    approved_by_tpo: "border-emerald-200 bg-emerald-50 text-emerald-700",
    under_spoc_review: "border-amber-200 bg-amber-50 text-amber-700",
    noc_generated: "border-emerald-200 bg-emerald-50 text-emerald-700",
    approved_by_spoc: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    withdrawn: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return classes[status] || "border-border bg-muted text-muted-foreground";
};

// Reviewer label
const getReviewerLabel = (reviewer) => {
  if (reviewer === "tpo") return "TPO";
  if (reviewer === "spoc") return "SPOC";

  return "Reviewer";
};

// Timeline progress
const getTimelineProgress = (status) => {
  const progress = {
    draft: 0,
    submitted: 1,
    under_tpo_review: 1,
    update_required: 1,
    approved_by_tpo: 2,
    under_spoc_review: 2,
    noc_generated: 3,
    approved_by_spoc: 3,
    rejected: 3,
    withdrawn: 3,
  };

  return progress[status] ?? null;
};

const ApplicationTracker = ({ application }) => {
  if (!application) {
    return (
      <div className="flex min-h-105 items-center justify-center rounded-2xl border border-border bg-card px-6 text-center shadow-sm">
        <div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
            <FileText size={21} className="text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            Select an application
          </h3>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            Select an application from the list to view its review progress.
          </p>
        </div>
      </div>
    );
  }

  // Always use normalized status throughout this component.
  const status = normalizeStatus(
    application.status ??
      application.applicationStatus ??
      application.application_status,
  );

  const isUpdateRequired = status === "update_required";
  const hasReviewerComment =
    isUpdateRequired && Boolean(application.updateRequiredReason?.trim());
  const submittedDate = formatApplicationDate(application.submittedAt);
  const statusClasses = getStatusClasses(status);
  const reviewerLabel = getReviewerLabel(application.updateRequiredBy);

  // Default timeline with individual event timestamps
  const defaultTimeline = [
    {
      title: "Application submitted",
      description:
        "Your internship application has been submitted successfully.",
      date: application.submittedAt || null,
      completed: true,
    },
    {
      title: "Application under review",
      description:
        "Your application is being reviewed by the concerned department.",
      date:
        application.reviewedAt ||
        application.approvedByTpoAt ||
        application.tpoReviewedAt ||
        null,
    },
    {
      title: "Final decision",
      description:
        "A final decision will appear here once the review is complete.",
      date:
        application.nocGeneratedAt ||
        application.approvedBySpocAt ||
        application.approvedAt ||
        application.rejectedAt ||
        null,
    },
  ];

  const timelineSource =
    application.timeline?.length > 0 ? application.timeline : defaultTimeline;

  const progress = getTimelineProgress(status);

  // Prepare timeline
  const timeline = timelineSource.map((item, index) => {
    const completed =
      progress !== null
        ? index < progress || (progress === 3 && index === 2)
        : Boolean(item.completed);

    const current =
      progress !== null
        ? progress < 3 && index === progress
        : Boolean(item.current);

    if (status === "noc_generated" && index === 2) {
      return {
        ...item,
        title: "NOC Generated",
        description:
          "Your application has been approved and the No Objection Certificate has been generated.",
        date:
          item.date ||
          item.generatedAt ||
          item.createdAt ||
          application.nocGeneratedAt ||
          application.updatedAt ||
          null,
        completed: true,
        current: false,
      };
    }

    return {
      ...item,
      completed,
      current,
    };
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:sticky xl:top-5">
      {/* Header */}
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <FileText size={18} className="text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3">
              <div className="min-w-0">
                <h2 className="wrap-break-word text-base font-semibold leading-5 text-foreground">
                  {application.company || "Unknown organisation"}
                </h2>

                {application.role && (
                  <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
                    {application.role}
                  </p>
                )}
              </div>

              {/* Application Status */}
              <div>
                <span
                  className={`
                    inline-flex
                    max-w-full
                    items-center
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    ${statusClasses}
                  `}
                >
                  {getStatusLabel(status)}
                </span>
              </div>
            </div>

            <p
              className="mt-3 truncate text-[10px] text-muted-foreground"
              title={application._id}
            >
              Application ID:{" "}
              <span className="font-medium text-foreground/70">
                {application._id}
              </span>
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
          {submittedDate && (
            <div className="min-w-0 rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Submitted
              </p>

              <p className="mt-1.5 truncate text-xs font-medium text-foreground">
                {submittedDate}
              </p>
            </div>
          )}

          {application.location && (
            <div className="min-w-0 rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </p>

              <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
                <MapPin size={12} className="shrink-0 text-muted-foreground" />

                <p
                  className="truncate text-xs font-medium text-foreground"
                  title={application.location}
                >
                  {application.location}
                </p>
              </div>
            </div>
          )}

          {application.mode && (
            <div className="min-w-0 rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Mode
              </p>

              <p className="mt-1.5 truncate text-xs font-medium capitalize text-foreground">
                {application.mode}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviewer Comment */}
      {hasReviewerComment && (
        <div className="px-5 pt-5 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3 px-4 py-3.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <AlertCircle size={17} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-950">
                  Application sent back
                </p>

                <p className="mt-0.5 text-xs leading-5 text-amber-800">
                  The {reviewerLabel} has requested changes to your application.
                </p>
              </div>
            </div>

            <div className="border-t border-amber-200 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                {reviewerLabel} comment
              </p>

              <p className="mt-1.5 whitespace-pre-wrap wrap-break-word text-sm leading-5 text-amber-950">
                {application.updateRequiredReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Clock3 size={16} className="text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Application Timeline
            </h3>

            <p className="text-[11px] text-muted-foreground">
              Review progress and status history
            </p>
          </div>
        </div>

        {timeline.length > 0 ? (
          <div>
            {timeline.map((item, index) => {
              const isLast = index === timeline.length - 1;

              const eventDate = getTimelineEventDate(item);

              return (
                <div
                  key={`${item.title}-${index}`}
                  className="relative flex gap-3"
                >
                  {!isLast && (
                    <div
                      className={`
                        absolute
                        left-3.5
                        top-7
                        h-[calc(100%-8px)]
                        w-px
                        ${item.completed ? "bg-emerald-200" : "bg-border"}
                      `}
                    />
                  )}

                  {/* Timeline Icon */}
                  <div
                    className={`
                      relative
                      z-10
                      flex
                      size-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      ${
                        item.completed
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : item.current
                            ? "border-primary/20 bg-primary/5 text-primary"
                            : "border-border bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {item.completed ? (
                      <Check size={14} strokeWidth={2.3} />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div
                    className={`
                      min-w-0
                      flex-1
                      ${isLast ? "pb-0" : "pb-6"}
                    `}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p
                        className={`
                          text-sm
                          font-medium
                          ${
                            item.current
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {item.title}
                      </p>

                      {eventDate && (
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {eventDate}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              No timeline information is available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
