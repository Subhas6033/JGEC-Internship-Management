import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, FilePlus2, Loader2, Plus } from "lucide-react";
import ApplicationFilters from "./ApplicationFilters";
import ApplicationList from "./ApplicationList";
import ApplicationTracker from "./ApplicationTracker";
import { useStudentApplications } from "../../../../Services/Queries/studentApplication.queries";

const DEFAULT_STATS = {
  total: 0,
  pending: 0,
  approved: 0,
};

const getApplicationId = (application) =>
  application?.id || application?._id || application?.__id || null;

const StudentApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const { data, isLoading, isError, error, isFetching } =
    useStudentApplications({
      search,
      status,
      type,
      sort,
    });

  // Supports both Axios responses and response-body data.
  const responseData = data?.data?.data ?? data?.data ?? data ?? {};

  // Normalize API application IDs and display fields.
  const applications = useMemo(
    () =>
      (responseData?.applications || []).map((application) => ({
        ...application,

        _id: getApplicationId(application),

        company:
          application.company ||
          application.organisation?.name ||
          "Unknown Organisation",

        role: application.role || application.designation || "Internship",

        location:
          application.location ||
          application.workLocations?.[0] ||
          "Not specified",
      })),
    [responseData?.applications],
  );

  const stats = responseData?.stats || DEFAULT_STATS;

  const selectedApplication = useMemo(
    () =>
      applications.find(
        (application) =>
          getApplicationId(application) === selectedApplicationId,
      ) || null,
    [applications, selectedApplicationId],
  );

  // Keep the selected application synchronized with API results.
  useEffect(() => {
    if (!applications.length) {
      setSelectedApplicationId(null);
      return;
    }

    const selectedStillExists = applications.some(
      (application) => getApplicationId(application) === selectedApplicationId,
    );

    if (!selectedStillExists) {
      setSelectedApplicationId(getApplicationId(applications[0]));
    }
  }, [applications, selectedApplicationId]);

  const handleApplicationSelect = (application) => {
    const applicationId = getApplicationId(application);

    if (applicationId) {
      setSelectedApplicationId(applicationId);
    }
  };

  const hasFilters =
    Boolean(search.trim()) || status !== "all" || type !== "all";

  const hasApplications = applications.length > 0;

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-5 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
            <FilePlus2 size={19} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              My Applications
            </h1>

            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
              Track your internship applications and their review progress.
            </p>
          </div>
        </div>

        <Link
          to="/students/applications/new"
          className="
            inline-flex h-10 shrink-0 items-center justify-center
            gap-2 rounded-lg bg-brand-700 px-4 text-sm
            font-medium text-white shadow-sm transition-all
            hover:bg-brand-800 focus:outline-none
            focus:ring-2 focus:ring-brand-700/20 sm:h-11
          "
        >
          <Plus size={17} strokeWidth={2} />
          New Application
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<FilePlus2 size={15} />}
        />

        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<Loader2 size={15} />}
        />

        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<span className="text-sm font-semibold">✓</span>}
          success
        />
      </div>

      {/* Filters */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ApplicationFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          type={type}
          setType={setType}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertCircle size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-900">
              Unable to load applications
            </p>

            <p className="mt-0.5 text-xs leading-5 text-red-700">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while fetching your applications."}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-105 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 size={22} className="animate-spin text-brand-700" />

            <div>
              <p className="text-sm font-medium text-foreground">
                Loading applications
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please wait while we fetch your applications.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
          {/* Application List */}
          <section className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3 px-0.5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Applications
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {applications.length}{" "}
                  {applications.length === 1 ? "application" : "applications"}{" "}
                  found
                </p>
              </div>

              {isFetching && (
                <Loader2
                  size={15}
                  className="shrink-0 animate-spin text-brand-700"
                />
              )}
            </div>

            {hasApplications ? (
              <ApplicationList
                applications={applications}
                selectedApplication={selectedApplication}
                onSelect={handleApplicationSelect}
              />
            ) : (
              <div className="flex min-h-85 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center shadow-sm">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <FilePlus2 size={23} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  No applications found
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  {hasFilters
                    ? "Try changing your search or filters."
                    : "You have not submitted any internship applications yet."}
                </p>

                {!hasFilters && (
                  <Link
                    to="/students/applications/new"
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-brand-700 px-3.5 text-xs font-medium text-white transition hover:bg-brand-800"
                  >
                    <Plus size={15} />
                    Create Application
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Application Tracker */}
          <aside className="min-w-0">
            <ApplicationTracker application={selectedApplication} />
          </aside>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, success = false }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div
        className={`flex size-8 items-center justify-center rounded-lg ${
          success ? "bg-brand-700 text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
    </div>

    <p className="mt-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
      {value ?? 0}
    </p>
  </div>
);

export default StudentApplications;
