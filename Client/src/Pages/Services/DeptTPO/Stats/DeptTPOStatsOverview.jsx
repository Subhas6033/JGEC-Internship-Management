import { useMemo, useState } from "react";
import { RefreshCw, BarChart3, XCircle, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components";
import { useTpoApplications } from "../../../../Services/Queries/tpoApplication.quires";
import TpoApplicationStats from "./TpoApplicationStats";
import TpoApplicationFilters from "./TpoApplicationFilters";
import TpoApplicationExportButton from "./TpoApplicationExportButton";
import {
  ChartCard,
  DonutChart,
  BarColumns,
  HBarList,
  Legend,
  Gauge,
  ChartEmpty,
  ChartsSkeleton,
} from "./TpoStatsCharts";
import {
  CATEGORY,
  computeStatistics,
  statusDistribution,
  monthlySeries,
  semesterSeries,
  countBy,
  organisationBreakdown,
} from "./chartutils";
import {
  staggerContainer,
  staggerFast,
  sectionAnimation,
  fadeIn,
  scaleIn,
  useAnimationVariants,
} from "../../../../Animations/animations";

const TpoApplicationOverview = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState("all");
  const [semester, setSemester] = useState("all");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useTpoApplications({
      search,
      status,
    });

  // Normalize the api response
  const applications = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  // Generate the available years
  const yearOptions = useMemo(() => {
    const years = new Set();
    applications.forEach((application) => {
      if (!application?.createdAt) return;
      const date = new Date(application.createdAt);
      if (!Number.isNaN(date.getTime())) years.add(String(date.getFullYear()));
    });
    // Always keep current year available.
    years.add(String(new Date().getFullYear()));
    return Array.from(years)
      .sort((a, b) => Number(b) - Number(a))
      .map((value) => ({ value, label: value }));
  }, [applications]);

  const semesterOptions = [
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  // Client-side year and semester filtering. Search and status are handled by the backend.
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      if (year !== "all") {
        if (!application?.createdAt) return false;
        const applicationYear = String(
          new Date(application.createdAt).getFullYear(),
        );
        if (applicationYear !== year) return false;
      }
      if (semester !== "all") {
        if (String(application?.semester) !== String(semester)) return false;
      }
      return true;
    });
  }, [applications, year, semester]);

  // Every KPI and chart reads from the filtered applications, so filters drive the whole page.
  const statistics = useMemo(
    () => computeStatistics(filteredApplications),
    [filteredApplications],
  );

  const charts = useMemo(
    () => ({
      status: statusDistribution(filteredApplications),
      monthly: monthlySeries(filteredApplications),
      semesters: semesterSeries(filteredApplications),
      organisations: organisationBreakdown(filteredApplications),
      mode: countBy(filteredApplications, (a) => a?.modeOfInternship, {
        top: 4,
        color: "#166534",
      }),
      type: countBy(filteredApplications, (a) => a?.internshipType, {
        top: 4,
        color: "#0369a1",
      }),
    }),
    [filteredApplications],
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setYear("all");
    setSemester("all");
  };

  const containerVariants = useAnimationVariants(staggerContainer);
  const sectionVariants = useAnimationVariants(sectionAnimation);
  const gridVariants = useAnimationVariants(staggerFast);
  const bodyVariants = useAnimationVariants(fadeIn);
  const emptyVariants = useAnimationVariants(scaleIn);

  const hasData = filteredApplications.length > 0;
  const bodyKey = isLoading
    ? "loading"
    : isError
      ? "error"
      : hasData
        ? "charts"
        : "empty";

  return (
    <>
      {/* Page MetaData */}
      <title>Internship Statistics | Department TPO | Internship NOC</title>
      <meta
        name="description"
        content="Charts and trends across all student internship applications: status distribution, monthly submissions, top organisations, NOC coverage, semesters, and internship mode and type."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta
        property="og:title"
        content="Internship Statistics | Department TPO"
      />
      <meta
        property="og:description"
        content="Charts and trends across all student internship applications."
      />

      {/* Main Component Starts from Here */}
      <div className="mt-2 w-full min-w-0 max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full min-w-0 max-w-full space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div
            variants={sectionVariants}
            className="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
                <BarChart3 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Internship Statistics
                </h1>
                <p className="mt-0.5 text-sm text-ink-muted">
                  Charts and trends across all student internship applications.
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto *:flex-1 sm:*:flex-none">
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
                  className={`h-4 w-4 ${isLoading || isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* KPIs */}
          <motion.div
            variants={sectionVariants}
            className="@container w-full min-w-0"
          >
            <TpoApplicationStats statistics={statistics} loading={isLoading} />
          </motion.div>

          {/* Filters */}
          <motion.div variants={sectionVariants}>
            <Card className="rounded-xl border border-border bg-cream-soft p-0 shadow-sm">
              <div className="@container w-full min-w-0 p-4 sm:p-5">
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
          </motion.div>

          {/* Charts / loading / error / empty */}
          <motion.div
            key={bodyKey}
            variants={bodyVariants}
            initial="hidden"
            animate="visible"
            className="@container mb-5 w-full min-w-0"
          >
            {isLoading && <ChartsSkeleton />}

            {isError && (
              <Card className="rounded-xl border border-red-200 bg-red-50 p-0 shadow-sm">
                <div
                  role="alert"
                  className="w-full min-w-0 p-6 text-center sm:p-8"
                >
                  <XCircle className="mx-auto h-10 w-10 text-red-600" />
                  <h3 className="mt-3 text-base font-semibold text-red-800">
                    Unable to load statistics
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
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
                      Try again
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {!isLoading && !isError && !hasData && (
              <motion.div
                variants={emptyVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="rounded-xl border border-dashed border-border bg-cream-soft p-0 shadow-sm">
                  <div className="p-6 text-center sm:p-10">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream">
                      <SearchX className="h-6 w-6 text-ink-muted" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-ink">
                      Nothing to chart yet
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      No applications match these filters. Reset them to see the
                      full picture.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      Reset filters
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {!isLoading && !isError && hasData && (
              /* 1 column on small, 2 on medium, 6-column grid on wide (2+4, 4+2, 3+3). */
              <motion.div
                className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl:grid-cols-6"
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                <ChartCard
                  className="@2xl:col-span-2"
                  title="Status distribution"
                  subtitle="Share of applications by current status"
                >
                  <DonutChart data={charts.status} />
                </ChartCard>

                <ChartCard
                  className="@2xl:col-span-2 @4xl:col-span-4"
                  title="Applications over time"
                  subtitle="Submitted per month, latest 12 months"
                >
                  {charts.monthly.length ? (
                    <BarColumns
                      data={charts.monthly}
                      color="#166534"
                      ariaLabel={`Applications per month: ${charts.monthly.map((m) => `${m.title} ${m.value}`).join(", ")}`}
                    />
                  ) : (
                    <ChartEmpty message="No dated applications." />
                  )}
                </ChartCard>

                <ChartCard
                  className="@2xl:col-span-2 @4xl:col-span-4"
                  title="Top organisations"
                  subtitle="Applications received, split by progress"
                >
                  <HBarList rows={charts.organisations} />
                  <Legend items={Object.values(CATEGORY)} />
                </ChartCard>

                <ChartCard
                  className="@2xl:col-span-2"
                  title="NOC coverage"
                  subtitle="Applications with a generated NOC"
                >
                  <Gauge
                    value={statistics.nocGenerated}
                    total={statistics.total}
                    label="NOCs generated"
                  />
                </ChartCard>

                <ChartCard
                  className="@4xl:col-span-3"
                  title="By semester"
                  subtitle="Applications per semester"
                >
                  <BarColumns
                    data={charts.semesters}
                    color="#0369a1"
                    height={200}
                    ariaLabel={`Applications by semester: ${charts.semesters.map((s) => `${s.title} ${s.value}`).join(", ")}`}
                  />
                </ChartCard>

                <ChartCard
                  className="@4xl:col-span-3"
                  title="Internship mode and type"
                  subtitle="How students plan to intern"
                >
                  <div className="grid gap-6 @md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs font-medium text-ink-muted">
                        Mode
                      </p>
                      <HBarList rows={charts.mode} />
                    </div>
                    <div>
                      <p className="mb-3 text-xs font-medium text-ink-muted">
                        Type
                      </p>
                      <HBarList rows={charts.type} />
                    </div>
                  </div>
                </ChartCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default TpoApplicationOverview;
