import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useTpoApplications } from "../../../../Services/Queries/tpoApplication.quires";
import ApplicationStats from "./ApplicationStats";
import ApplicationFilters from "./ApplicationFilters";

const DeptTPOApplications = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
  } = useTpoApplications({
    search: debouncedSearch,
    status,
  });

  const applications = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="rounded-xl border border-border bg-cream-soft p-8 text-center">
            <p className="text-sm text-ink-muted">
              Loading internship applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="rounded-xl border border-border bg-cream-soft p-8 text-center">
            <p className="text-sm text-ink">
              Failed to load internship applications.
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-700 text-white">
                <Building2 size={18} strokeWidth={1.8} />
              </span>
              <p className="eyebrow">Department TPO</p>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Internship Applications
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink-muted">
              Review student internship applications, manage application status,
              and process eligible applications for the next stage.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <ApplicationStats applications={applications} />
        </section>

        <section className="mt-6">
          <ApplicationFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
        </section>

        <section className="mt-6">
          {isFetching && !isLoading && (
            <div className="mb-3 text-xs text-ink-muted">
              Updating applications...
            </div>
          )}

          <Outlet
            context={{
              search,
              status,
              applications,
              filteredApplications: applications,
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default DeptTPOApplications;
