import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Outlet } from "react-router-dom";

import { useTpoApplications } from "../../../../Services/Queries/tpoApplication.quires";
import ApplicationStats from "./ApplicationStats";
import ApplicationFilters from "./ApplicationFilters";

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

const DeptTPOApplications = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset pagination when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTpoApplications({
    search: debouncedSearch,
    status: status === "all" ? "" : status,
  });

  const applications = useMemo(() => extractApplications(response), [response]);

  const totalApplications = applications.length;

  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  // Keep current page within the valid range.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return applications.slice(startIndex, startIndex + PAGE_SIZE);
  }, [applications, currentPage]);

  const startItem =
    totalApplications === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(currentPage * PAGE_SIZE, totalApplications);

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl border border-border bg-cream-soft p-10 text-center">
            <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
            <p className="text-sm font-medium text-ink">
              Loading internship applications...
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Please wait while we fetch the applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              Unable to load applications
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Page heading */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
                <Building2 size={19} strokeWidth={1.8} />
              </span>
              <p className="eyebrow">Department TPO</p>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Internship Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Manage student internship applications, review submissions, track
              application progress, and forward eligible applications to the
              company SPOC.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-cream-soft px-5 py-3">
            <p className="text-xs text-ink-muted">Total applications</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
              {totalApplications}
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-7">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-ink">
              Application Overview
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Summary of applications matching your current filters.
            </p>
          </div>

          <ApplicationStats applications={applications} />
        </section>

        {/* Filters */}
        <section className="mt-7">
          <ApplicationFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
        </section>

        {/* Application list */}
        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Application Records
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                Each record represents an individual student application.
              </p>
            </div>

            {isFetching && (
              <span className="text-xs font-medium text-brand-700">
                Updating applications...
              </span>
            )}
          </div>

          {/* IMPORTANT: Provide both names for compatibility with child routes. */}
          <Outlet
            context={{
              search,
              status,

              // AllCompanyApplications reads filteredApplications.
              filteredApplications: paginatedApplications,

              // Other child routes can use these names too.
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
            }}
          />

          {/* Pagination */}
          {totalApplications > 0 && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-cream-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-muted">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {startItem}-{endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-ink">
                  {totalApplications}
                </span>{" "}
                applications
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  aria-label="Previous page"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-cream text-ink transition hover:bg-cream-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`flex size-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-brand-700 text-white shadow-sm"
                        : "border border-border bg-cream text-ink hover:bg-cream-dark"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  aria-label="Next page"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-cream text-ink transition hover:bg-cream-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}

          {totalApplications === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-cream-soft px-5 py-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream">
                <Building2 size={21} className="text-ink-muted" />
              </div>

              <p className="mt-3 font-semibold text-ink">
                No applications found
              </p>

              <p className="mt-1 text-sm text-ink-muted">
                Try changing your search term or selecting another status.
              </p>

              {(search || status !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                  className="mt-4 text-sm font-semibold text-brand-700 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DeptTPOApplications;
