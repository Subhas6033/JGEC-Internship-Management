import { useMemo, useState } from "react";
import { RefreshCw, FileCheck2, XCircle, FileText } from "lucide-react";
import { Button, Card, Loading } from "../../../../Components";
import { useTpoApplications } from "../../../../Services/Queries/tpoApplication.quires";
import TpoApplicationStats from "./TpoApplicationStats";
import TpoApplicationFilters from "./TpoApplicationFilters";
import TpoApplicationList from "./TpoApplicationList";
import TpoApplicationExportButton from "./TpoApplicationExportButton";

const TpoApplicationOverview = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState("all");
  const [semester, setSemester] = useState("all");

  const { data, isLoading, isError, error, refetch } = useTpoApplications({
    search,
    status,
  });
  // Normalize the api response
  const applications = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  // Generate the available years
  const yearOptions = useMemo(() => {
    const years = new Set();
    applications.forEach((application) => {
      if (!application?.createdAt) {
        return;
      }
      const date = new Date(application.createdAt);
      if (!Number.isNaN(date.getTime())) {
        years.add(String(date.getFullYear()));
      }
    });

    /**
     * Always keep current year available.
     */
    years.add(String(new Date().getFullYear()));

    return Array.from(years)
      .sort((a, b) => Number(b) - Number(a))
      .map((value) => ({
        value,
        label: value,
      }));
  }, [applications]);

  // Semester options
  const semesterOptions = [
    {
      value: "1",
      label: "Semester 1",
    },
    {
      value: "2",
      label: "Semester 2",
    },
    {
      value: "3",
      label: "Semester 3",
    },
    {
      value: "4",
      label: "Semester 4",
    },
    {
      value: "5",
      label: "Semester 5",
    },
    {
      value: "6",
      label: "Semester 6",
    },
    {
      value: "7",
      label: "Semester 7",
    },
    {
      value: "8",
      label: "Semester 8",
    },
  ];

  /**
   * Client-side year and semester filtering.
   *
   * Search and status are already handled by backend.
   */
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      // filter years
      if (year !== "all") {
        if (!application?.createdAt) {
          return false;
        }
        const applicationYear = String(
          new Date(application.createdAt).getFullYear(),
        );
        if (applicationYear !== year) {
          return false;
        }
      }
      // Filter semesters
      if (semester !== "all") {
        if (String(application?.semester) !== String(semester)) {
          return false;
        }
      }
      return true;
    });
  }, [applications, year, semester]);

  // Applications statistics
  const statistics = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter(
      (application) => application?.status === "submitted",
    ).length;
    const underTpoReview = applications.filter(
      (application) => application?.status === "under_tpo_review",
    ).length;
    const updateRequired = applications.filter(
      (application) => application?.status === "update_required",
    ).length;
    const approvedByTpo = applications.filter(
      (application) => application?.status === "approved_by_tpo",
    ).length;
    const underSpocReview = applications.filter(
      (application) => application?.status === "under_spoc_review",
    ).length;
    const approvedBySpoc = applications.filter(
      (application) => application?.status === "approved_by_spoc",
    ).length;
    const rejected = applications.filter(
      (application) => application?.status === "rejected",
    ).length;
    const withdrawn = applications.filter(
      (application) => application?.status === "withdrawn",
    ).length;

    /**
     * NOC support.
     *
     * Supports future backend fields without
     * breaking the current schema.
     */
    const nocGenerated = applications.filter(
      (application) =>
        application?.nocGenerated === true ||
        application?.nocStatus === "generated" ||
        application?.status === "noc_generated",
    ).length;

    return {
      total,
      submitted,
      underTpoReview,
      updateRequired,
      approvedByTpo,
      underSpocReview,
      approvedBySpoc,
      rejected,
      withdrawn,
      nocGenerated,
    };
  }, [applications]);

  // Reset the filters
  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setYear("all");
    setSemester("all");
  };

  return (
    <div className="mt-2 w-full min-w-0 max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="w-full min-w-0 max-w-full space-y-6">
        {/* Page Header */}
        <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <FileCheck2 className="h-5 w-5 shrink-0 text-brand-700" />

              <h1 className="min-w-0 truncate text-xl font-semibold text-ink sm:text-2xl">
                Internship Applications
              </h1>
            </div>

            <p className="mt-1 text-sm text-ink-muted">
              Monitor, review and manage student internship applications.
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
            <TpoApplicationExportButton
              applications={filteredApplications}
              year={year}
              semester={semester}
              status={status}
              search={search}
            />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="w-full min-w-0">
          <TpoApplicationStats statistics={statistics} />
        </div>

        {/* Filters */}
        <Card>
          <div className="w-full min-w-0 p-4 sm:p-6">
            <TpoApplicationFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              year={year}
              setYear={setYear}
              semester={semester}
              setSemester={setSemester}
              yearOptions={yearOptions}
              semesterOptions={semesterOptions}
              onReset={handleResetFilters}
            />
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">Applications</h2>

            <p className="text-sm text-ink-muted">
              Showing{" "}
              <span className="font-medium text-ink">
                {filteredApplications.length}
              </span>{" "}
              application
              {filteredApplications.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="w-full min-w-0">
            <Loading message="Loading the Stats Data..." />
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card>
            <div className="w-full min-w-0 p-8 text-center">
              <XCircle className="mx-auto h-10 w-10 text-red-600" />

              <h3 className="mt-3 text-base font-semibold text-ink">
                Unable to load applications
              </h3>

              <p className="mt-1 text-sm text-ink-muted">
                {error?.message ||
                  "Something went wrong while loading applications."}
              </p>

              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Applications */}
        {!isLoading && !isError && (
          <div className="w-full min-w-0 max-w-full overflow-hidden">
            <TpoApplicationList applications={filteredApplications} />
          </div>
        )}

        {/* NOC Information */}
        <Card className={"mb-5"}>
          <div className="flex w-full min-w-0 flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-soft">
                <FileText className="h-5 w-5 text-ink-muted" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink">
                  NOC Generated
                </h3>

                <p className="mt-1 text-sm leading-5 text-ink-muted">
                  Applications with a generated NOC will appear here once the
                  NOC status is available from the backend.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 lg:pl-4">
              <span className="text-2xl font-semibold text-ink">
                {statistics.nocGenerated}
              </span>

              <span className="text-sm text-ink-muted">generated</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TpoApplicationOverview;
