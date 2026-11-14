import {
  ArrowRight,
  CalendarDays,
  FileCheck2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components";
import TpoApplicationStatusBadge from "./TpoApplicationStatusBadge";
import {
  sectionAnimation,
  scaleIn,
  viewportEarly,
  useAnimationVariants,
} from "../../../../Animations/animations";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) =>
  String(name || "ST")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const TpoApplicationList = ({ applications = [] }) => {
  const itemVariants = useAnimationVariants(sectionAnimation);
  const emptyVariants = useAnimationVariants(scaleIn);

  if (!applications.length) {
    return (
      <motion.div variants={emptyVariants} initial="hidden" animate="visible">
        <Card className="rounded-xl border border-dashed border-border bg-cream-soft p-0 shadow-sm">
          <div className="p-6 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream">
              <GraduationCap className="h-6 w-6 text-ink-muted" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Change the filters or reset them to see more applications.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => {
        const student = application?.student ?? {};
        const organisation = application?.organisation ?? {};
        const studentName = student?.fullName ?? "Unknown Student";
        const rollNumber = student?.rollNumber ?? "N/A";
        const department = student?.department ?? "N/A";
        const organisationName =
          organisation?.organisationName ??
          organisation?.name ??
          "Unknown Organisation";
        const organisationLocation =
          organisation?.organisationLocation ?? organisation?.location ?? "N/A";
        const isNocGenerated =
          application?.nocGenerated === true ||
          application?.nocStatus === "generated" ||
          application?.status === "noc_generated";

        return (
          <motion.div
            key={application?._id}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportEarly}
          >
            <Card className="overflow-hidden rounded-xl border border-border bg-cream-soft p-0 shadow-sm">
              <div className="@container p-4 sm:p-5">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {getInitials(studentName)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-ink">
                        {studentName}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-2 text-sm text-ink-muted">
                        <span className="tabular-nums">{rollNumber}</span>
                        <span
                          className="h-3.5 w-px bg-border"
                          aria-hidden="true"
                        />
                        <span className="truncate">{department}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <TpoApplicationStatusBadge status={application?.status} />
                    {isNocGenerated &&
                      application?.status !== "noc_generated" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                          <FileCheck2
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          NOC generated
                        </span>
                      )}
                  </div>
                </div>

                {/* Key details */}
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-4 @md:grid-cols-2 @4xl:grid-cols-4">
                  <ApplicationDetail
                    icon={Building2}
                    label="Organisation"
                    value={organisationName}
                  />
                  <ApplicationDetail
                    icon={GraduationCap}
                    label="Semester"
                    value={
                      application?.semester
                        ? `Semester ${application.semester}`
                        : "N/A"
                    }
                  />
                  <ApplicationDetail
                    icon={CalendarDays}
                    label="Applied on"
                    value={formatDate(application?.createdAt)}
                  />
                  <ApplicationDetail
                    icon={CalendarDays}
                    label="Internship period"
                    value={`${formatDate(application?.tentativeStartDate)} – ${formatDate(application?.tentativeEndDate)}`}
                  />
                </div>

                {/* Internship facts */}
                <dl className="mt-4 grid grid-cols-1 divide-border overflow-hidden rounded-lg border border-border bg-cream @lg:grid-cols-3 @lg:divide-x">
                  <Fact
                    label="Internship type"
                    value={application?.internshipType ?? "Not specified"}
                    capitalize
                  />
                  <Fact
                    label="Mode"
                    value={application?.modeOfInternship ?? "Not specified"}
                    capitalize
                  />
                  <Fact
                    label="Location"
                    value={
                      application?.tentativeWorkLocations?.length
                        ? application.tentativeWorkLocations.join(", ")
                        : organisationLocation
                    }
                  />
                </dl>

                {/* Update required reason */}
                {application?.status === "update_required" &&
                  application?.updateRequiredReason && (
                    <div
                      role="note"
                      className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4"
                    >
                      <p className="text-xs font-semibold text-orange-800">
                        Update required
                      </p>
                      <p className="mt-1 wrap-break-word text-sm text-orange-900">
                        {application.updateRequiredReason}
                      </p>
                      {application?.updateRequiredBy && (
                        <p className="mt-2 text-xs text-orange-800">
                          Requested by{" "}
                          <span className="font-medium capitalize">
                            {application.updateRequiredBy}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-3 border-t border-border bg-cream px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="min-w-0 break-all text-xs text-ink-muted">
                  Application ID{" "}
                  <span className="font-medium tabular-nums text-ink">
                    {application?._id ?? "N/A"}
                  </span>
                </p>

                <a
                  href={`/depttpo/applications/${application?._id}`}
                  className="focus-ring inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3.5 text-xs font-medium text-white transition-colors hover:bg-brand-700/90 sm:h-8 sm:w-fit"
                >
                  View details
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

const ApplicationDetail = ({ icon: Icon, label, value }) => (
  <div className="min-w-0">
    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label}
    </p>
    <p
      title={String(value)}
      className="mt-1 line-clamp-2 wrap-break-word text-sm font-medium text-ink"
    >
      {value}
    </p>
  </div>
);

const Fact = ({ label, value, capitalize = false }) => (
  <div className="min-w-0 border-b border-border px-4 py-3 last:border-b-0 @lg:border-b-0">
    <dt className="text-xs text-ink-muted">{label}</dt>
    <dd
      title={String(value)}
      className={`mt-1 wrap-break-word text-sm font-medium text-ink @lg:truncate ${capitalize ? "capitalize" : ""}`}
    >
      {value}
    </dd>
  </div>
);

export default TpoApplicationList;
