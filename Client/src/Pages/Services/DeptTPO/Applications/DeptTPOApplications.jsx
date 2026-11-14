import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { Building2, RefreshCw, SearchX, Users } from "lucide-react";
import { useTpoApplications } from "../../../../Services/Queries/tpoApplication.quires";
import { Button } from "../../../../Components";
import ApplicationStats from "./ApplicationStats";
import ApplicationFilters from "./ApplicationFilters";
import ApplicationsPagination from "./ApplicationPagination";
import ApplicationsSkeleton from "./ApplicationSckeleton";
import {
  STATUS_CONFIG,
  STATUS_GROUPS,
  getOrganisation,
  getOrganisationId,
  getOrganisationName,
  getSubmittedAt,
} from "./applicationUtils";

const PAGE_SIZE = 10;

const extractApplications = (response) => {
  const candidates = [
    response?.data?.data?.applications,
    response?.data?.applications,
    response?.data?.data,
    response?.data,
    response?.applications,
    response,
  ];
  return candidates.find(Array.isArray) || [];
};

const timeOf = (application) => {
  const t = new Date(getSubmittedAt(application)).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const sortApplications = (list, sort) => {
  const sorted = [...list];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => timeOf(a) - timeOf(b));
    case "organisation":
      return sorted.sort((a, b) =>
        getOrganisationName(getOrganisation(a)).localeCompare(
          getOrganisationName(getOrganisation(b)),
        ),
      );
    case "status":
      return sorted.sort((a, b) =>
        (STATUS_CONFIG[a?.status]?.label || a?.status || "").localeCompare(
          STATUS_CONFIG[b?.status]?.label || b?.status || "",
        ),
      );
    default:
      return sorted.sort((a, b) => timeOf(b) - timeOf(a));
  }
};

const DeptTPOApplications = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [organisation, setOrganisation] = useState("all");
  const [sort, setSort] = useState("newest");
  const [statusGroup, setStatusGroup] = useState(null); // client-side overview filter
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, organisation, sort, statusGroup]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useTpoApplications({
    search: debouncedSearch,
    status: status === "all" ? "" : status,
  });

  const serverApplications = useMemo(
    () => extractApplications(response),
    [response],
  );

  const organisationOptions = useMemo(() => {
    const map = new Map();
    serverApplications.forEach((application) => {
      const id = getOrganisationId(application);
      if (!map.has(id))
        map.set(id, getOrganisationName(getOrganisation(application)));
    });
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [serverApplications]);

  // Organisation scope: drives the overview cards so they stay stable while a card filter is active.
  const scopedApplications = useMemo(
    () =>
      organisation === "all"
        ? serverApplications
        : serverApplications.filter(
            (a) => getOrganisationId(a) === organisation,
          ),
    [serverApplications, organisation],
  );

  const applications = useMemo(() => {
    const list = statusGroup
      ? scopedApplications.filter((a) =>
          STATUS_GROUPS[statusGroup].statuses.includes(a?.status),
        )
      : scopedApplications;
    return sortApplications(list, sort);
  }, [scopedApplications, statusGroup, sort]);

  const totalApplications = applications.length;
  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return applications.slice(start, start + PAGE_SIZE);
  }, [applications, currentPage]);

  const startItem =
    totalApplications === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalApplications);

  const hasFilters = Boolean(
    search || status !== "all" || organisation !== "all" || statusGroup,
  );
  const clearAll = () => {
    setSearch("");
    setStatus("all");
    setOrganisation("all");
    setStatusGroup(null);
  };

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const renderBody = () => {
    if (isLoading) return <ApplicationsSkeleton />;

    if (isError) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
        >
          <p className="font-semibold text-red-700">
            Applications could not be loaded
          </p>
          <p className="mt-2 text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Check your connection and try again."}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-5"
            onClick={() => refetch()}
          >
            <RefreshCw size={14} />
            Retry
          </Button>
        </div>
      );
    }

    if (totalApplications === 0) {
      return hasFilters ? (
        <div className="rounded-xl border border-dashed border-border bg-cream-soft px-5 py-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream">
            <SearchX size={21} className="text-ink-muted" />
          </span>
          <p className="mt-3 font-semibold text-ink">
            No applications match these filters
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Adjust your search or remove a filter to see more results.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={clearAll}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-cream-soft px-5 py-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream">
            <Building2 size={21} className="text-ink-muted" />
          </span>
          <p className="mt-3 font-semibold text-ink">No applications yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Student applications will appear here as soon as they are submitted.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Outlet context keeps every key the child routes already read. */}
        <Outlet
          context={{
            search,
            status,
            filteredApplications: paginatedApplications,
            applications: paginatedApplications,
            allApplications: applications,
            pagination: {
              currentPage,
              pageSize: PAGE_SIZE,
              totalPages,
              totalApplications,
              startItem,
              endItem,
            },
            setCurrentPage,
            refetch,
          }}
        />
        <ApplicationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalApplications}
          startItem={startItem}
          endItem={endItem}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-white">
                <Building2 size={16} strokeWidth={1.8} />
              </span>
              Department TPO
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Internship Applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Review student applications organisation by organisation, accept
              or send back each one, and follow its progress through to the
              SPOC.
            </p>
          </div>

          <div className="flex w-full items-stretch overflow-hidden rounded-2xl border border-border bg-cream-soft shadow-sm sm:w-auto">
            {/* Count */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-700/10 text-brand-700">
                <Users size={18} strokeWidth={1.8} />
              </span>

              <div>
                <p className="text-xs font-medium text-ink-muted">
                  Matching applications
                </p>
                <p
                  className="text-2xl font-semibold leading-tight tabular-nums tracking-tight text-ink"
                  aria-live="polite"
                >
                  {isLoading ? (
                    <span className="inline-block h-6 w-10 animate-pulse rounded bg-cream-dark align-middle" />
                  ) : (
                    totalApplications
                  )}
                </p>
              </div>
            </div>

            {/* Refresh */}
            <div className="ml-auto flex flex-col items-start justify-center gap-1 border-l border-border bg-cream/60 px-4 py-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                aria-label="Refresh applications"
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />
                {isFetching ? "Refreshing" : "Refresh"}
              </Button>

              <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <span
                  className={`size-1.5 rounded-full ${
                    isFetching ? "animate-pulse bg-amber-500" : "bg-emerald-600"
                  }`}
                  aria-hidden="true"
                />
                {isFetching
                  ? "Fetching latest data"
                  : lastUpdated
                    ? `Updated ${lastUpdated}`
                    : "Not refreshed yet"}
              </span>
            </div>
          </div>
        </header>

        <section className="mt-7" aria-label="Application overview">
          <ApplicationStats
            applications={scopedApplications}
            activeGroup={statusGroup}
            onSelectGroup={setStatusGroup}
          />
        </section>

        <section className="mt-6" aria-label="Filters">
          <ApplicationFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            organisation={organisation}
            onOrganisationChange={setOrganisation}
            organisationOptions={organisationOptions}
            sort={sort}
            onSortChange={setSort}
            statusGroup={statusGroup}
            onStatusGroupChange={setStatusGroup}
            onClearAll={clearAll}
          />
        </section>

        <section
          className="mt-6"
          aria-label="Applications by organisation"
          aria-busy={isLoading || isFetching}
        >
          {renderBody()}
        </section>
      </div>
    </div>
  );
};

export default DeptTPOApplications;
