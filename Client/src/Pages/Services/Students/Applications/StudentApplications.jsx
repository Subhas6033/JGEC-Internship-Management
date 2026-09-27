import { useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Button, Card } from "../../../../Components/index";
import { cardAnimation, pageFade } from "../../../../Animations/animations";

import ApplicationFilters from "./ApplicationFilters";
import ApplicationList from "./ApplicationList";
import ApplicationTracker from "./ApplicationTracker";
import { applications } from "./applications.data";

const StudentApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");

  const [selectedApplication, setSelectedApplication] = useState(
    applications[0] ?? null,
  );

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.role.toLowerCase().includes(normalizedSearch) ||
        application.id.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === "all" || application.status === status;

      const matchesType = type === "all" || application.type === type;

      return matchesSearch && matchesStatus && matchesType;
    });

    return [...result].sort((a, b) => {
      if (sort === "company") {
        return a.company.localeCompare(b.company);
      }

      const first = new Date(a.submittedAt);
      const second = new Date(b.submittedAt);

      if (sort === "oldest") {
        return first - second;
      }

      return second - first;
    });
  }, [search, status, type, sort]);

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setType("all");
    setSort("newest");
  };

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "under_review")
        .length,
      approved: applications.filter((item) => item.status === "approved")
        .length,
    };
  }, []);

  return (
    <>
      <title>My Internship Applications | JGEC Internship Portal</title>
      <meta
        name="description"
        content="View and track your internship applications, application status, and progress through the JGEC Internship Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        property="og:title"
        content="My Internship Applications | JGEC Internship Portal"
      />
      <meta
        property="og:description"
        content="View and track your internship applications and their progress through the JGEC Internship Portal."
      />
      <meta property="og:type" content="website" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageFade}
        className="
        min-h-[calc(100dvh-4rem)]
        bg-cream
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
      >
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Student workspace</p>

                <h1
                  className="
                  mt-2
                  font-display
                  text-3xl
                  leading-tight
                  tracking-tight
                  text-ink
                  sm:text-4xl
                "
                >
                  My internship applications
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                  View every internship application and track its progress from
                  submission to final decision.
                </p>
              </div>

              <Link to="/students/applications/new">
                <Button
                  type="button"
                  size="md"
                  className="
                  w-full
                  bg-brand-700
                  text-white
                  hover:bg-brand-800
                  focus-visible:ring-brand-700
                  sm:w-auto
                "
                >
                  <Plus size={16} strokeWidth={1.9} />
                  New application
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            className="
            mb-5
            grid
            gap-3
            sm:grid-cols-3
          "
          >
            <Card className="border-border bg-cream-soft p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-brand-50
                  text-brand-700
                "
                >
                  <FileText size={17} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs text-ink-muted">Total applications</p>

                  <p className="mt-0.5 text-lg font-semibold text-ink">
                    {stats.total}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-cream-soft p-4 shadow-card">
              <p className="text-xs text-ink-muted">Currently in review</p>

              <p className="mt-1 text-lg font-semibold text-ink">
                {stats.pending}
              </p>
            </Card>

            <Card className="border-border bg-cream-soft p-4 shadow-card">
              <p className="text-xs text-ink-muted">Approved applications</p>

              <p className="mt-1 text-lg font-semibold text-brand-700">
                {stats.approved}
              </p>
            </Card>
          </motion.div>

          {/* Main workspace */}
          <Card
            className="
            border-border
            bg-cream-soft
            p-4
            shadow-card
            sm:p-5
          "
          >
            <ApplicationFilters
              search={search}
              status={status}
              type={type}
              sort={sort}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onTypeChange={setType}
              onSortChange={setSort}
              onReset={handleReset}
            />

            {/* Applications + Tracker */}
            <div
              className="
              mt-5
              grid
              gap-5
              lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.75fr)]
            "
            >
              {/* List */}
              <div className="min-w-0">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-ink">
                      Applications
                    </h2>

                    <p className="mt-0.5 text-xs text-ink-muted">
                      {filteredApplications.length}{" "}
                      {filteredApplications.length === 1
                        ? "application"
                        : "applications"}{" "}
                      shown
                    </p>
                  </div>
                </div>

                <ApplicationList
                  applications={filteredApplications}
                  selectedApplication={selectedApplication}
                  onSelect={handleSelectApplication}
                />
              </div>

              {/* Tracker */}
              <div className="min-w-0">
                <ApplicationTracker application={selectedApplication} />
              </div>
            </div>
          </Card>
        </div>
      </motion.section>
    </>
  );
};

export default StudentApplications;
