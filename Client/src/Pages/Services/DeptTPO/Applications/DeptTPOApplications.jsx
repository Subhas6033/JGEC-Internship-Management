import { useMemo, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { Outlet } from "react-router-dom";

import { Button } from "../../../../Components";

import ApplicationStats from "./ApplicationStats";
import ApplicationFilters from "./ApplicationFilters";
import { applicationGroups } from "./application.data.js";

const DeptTPOApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applicationGroups.filter((group) => {
      const matchesStatus = status === "all" || group.status === status;

      if (!query) {
        return matchesStatus;
      }

      const searchableContent = [
        group.company.name,
        group.company.role,
        group.company.location,
        group.company.mode,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableContent.includes(query);
    });
  }, [search, status]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}
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
              Review applications grouped by company, manage deadlines, and
              forward accepted students to the central TPO.
            </p>
          </div>

          <Button type="button" variant="primary" size="md">
            <Plus size={16} strokeWidth={1.8} />
            Set Deadline
          </Button>
        </section>

        {/* Statistics */}
        <section className="mt-6">
          <ApplicationStats applicationGroups={applicationGroups} />
        </section>

        {/* Filters */}
        <section className="mt-6">
          <ApplicationFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
        </section>

        {/* Child route */}
        <section className="mt-6">
          <Outlet
            context={{
              search,
              status,
              applicationGroups,
              filteredGroups,
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default DeptTPOApplications;
