import { useEffect, useState } from "react";
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

const StudentApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { data, isLoading, isError, error, isFetching } =
    useStudentApplications({
      search,
      status,
      type,
      sort,
    });

  const responseData = data?.data || {};
  const applications = responseData.applications || [];
  const stats = responseData.stats || DEFAULT_STATS;

  useEffect(() => {
    if (!applications.length) {
      setSelectedApplication(null);
      return;
    }

    if (!selectedApplication) {
      setSelectedApplication(applications[0]);
      return;
    }

    const updatedApplication = applications.find(
      (application) => application.id === selectedApplication.id,
    );

    if (updatedApplication) {
      setSelectedApplication(updatedApplication);
    } else {
      setSelectedApplication(applications[0]);
    }
  }, [applications]);

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
  };

  const hasFilters =
    Boolean(search.trim()) || status !== "all" || type !== "all";

  const hasApplications = applications.length > 0;

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-5 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
        </div>

        <Link
          to="/students/applications/new"
          className="
            inline-flex
            h-10
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-primary
            px-4
            text-sm
            font-medium
            text-primary-foreground
            shadow-sm
            transition-all
            hover:opacity-90
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
            sm:h-11
          "
        >
          <Plus size={17} strokeWidth={2} />
          New Application
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Total Applications
            </p>

            <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FilePlus2 size={15} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
            {stats.total}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">Pending</p>

            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Loader2 size={15} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Approved
            </p>

            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <span className="text-sm font-semibold">✓</span>
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
            {stats.approved}
          </p>
        </div>
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
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Loader2
                size={19}
                className="animate-spin text-muted-foreground"
              />
            </div>

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
                  className="shrink-0 animate-spin text-muted-foreground"
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
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <FilePlus2 size={23} className="text-muted-foreground" />
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
                    className="
                      mt-5
                      inline-flex
                      h-9
                      items-center
                      gap-2
                      rounded-lg
                      bg-primary
                      px-3.5
                      text-xs
                      font-medium
                      text-primary-foreground
                      transition
                      hover:opacity-90
                    "
                  >
                    <Plus size={15} />
                    Create Application
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Tracker */}
          <aside className="min-w-0">
            <ApplicationTracker application={selectedApplication} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
