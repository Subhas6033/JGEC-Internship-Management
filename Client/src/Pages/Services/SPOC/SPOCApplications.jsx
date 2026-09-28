import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Input } from "../../../Components/index";
import SPOCApplicationStatusFilter from "../../../Components/SPOC/SPOCApplicationStatusFilter";
import SPOCApplicationListCard from "../../../Components/SPOC/SPOCApplicationListCard";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";
import { applications } from "./application.data";

const SPOCApplications = () => {
  const [activeStatus, setActiveStatus] = useState("pending");

  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    return {
      pending: applications.filter(
        (application) => application.status === "pending",
      ).length,

      accepted: applications.filter(
        (application) => application.status === "accepted",
      ).length,

      rejected: applications.filter(
        (application) => application.status === "rejected",
      ).length,
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus = application.status === activeStatus;

      if (!normalizedSearch) {
        return matchesStatus;
      }

      const matchesSearch =
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.location.toLowerCase().includes(normalizedSearch) ||
        application.id.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, search]);

  const handleViewApplication = (application) => {
    console.log("View SPOC application:", application);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="
        box-border
        w-full min-w-0 max-w-none
        overflow-x-hidden
        px-4 py-5
        sm:px-6 sm:py-6
        lg:px-8 lg:py-8
      "
    >
      {/* Header */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="w-full min-w-0"
      >
        <p className="eyebrow">SPOC Applications</p>

        <div
          className="
            mt-2
            flex min-w-0
            flex-col gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="min-w-0">
            <h1
              className="
                text-2xl font-bold
                leading-tight tracking-tight
                text-ink
                sm:text-3xl
              "
            >
              Applications
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm leading-6
                text-ink-muted
                sm:text-base
              "
            >
              Review company-wise internship applications forwarded by the
              Department TPO.
            </p>
          </div>

          <div
            className="
              shrink-0
              rounded-lg
              bg-brand-50
              px-3 py-2
            "
          >
            <p className="text-xs text-brand-700">Total Applications</p>

            <p className="mt-0.5 text-lg font-bold text-brand-900">
              {applications.length}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Status filters */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-6 w-full min-w-0"
      >
        <SPOCApplicationStatusFilter
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          counts={counts}
        />
      </motion.section>

      {/* Search */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-5 w-full min-w-0"
      >
        <Card
          className="
            w-full min-w-0 max-w-full
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content
            className="
              w-full min-w-0
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex min-w-0
                flex-col gap-3
                sm:flex-row
                sm:items-center
              "
            >
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="application-search"
                  className="
                    mb-1.5 block
                    text-xs font-medium
                    text-ink-muted p-2
                  "
                >
                  Search applications
                </label>

                <Input
                  id="application-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search company, location or application ID..."
                  startIcon={<Search size={17} />}
                  className="w-full"
                />
              </div>

              <div
                className="
                  flex shrink-0
                  items-center gap-2
                  rounded-lg
                  bg-cream
                  px-3 py-2
                  text-xs text-ink-muted
                "
                title="Current application status filter"
              >
                <SlidersHorizontal size={15} />

                <span className="capitalize">{activeStatus} applications</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* Applications */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full min-w-0
          sm:mt-8
        "
      >
        <div
          className="
            flex min-w-0
            flex-col gap-1
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-lg font-bold
                leading-tight text-ink
                sm:text-xl
              "
            >
              {activeStatus === "pending" && "Pending Applications"}

              {activeStatus === "accepted" && "Accepted Applications"}

              {activeStatus === "rejected" && "Rejected Applications"}
            </h2>

            <p
              className="
                mt-1
                text-xs leading-5
                text-ink-muted
                sm:text-sm
              "
            >
              {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredApplications.length > 0 ? (
          <div
            className="
              mt-4
              grid w-full min-w-0
              grid-cols-1
              items-stretch
              gap-4
              xl:grid-cols-2
            "
          >
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="
                    flex min-w-0 w-full
                  "
              >
                <SPOCApplicationListCard
                  application={application}
                  onView={handleViewApplication}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card
            className="
              mt-4
              w-full min-w-0
              border-border
              bg-surface
            "
          >
            <Card.Content
              className="
                flex min-h-40
                flex-col items-center
                justify-center
                p-6 text-center
              "
            >
              <div
                className="
                  flex size-11
                  items-center justify-center
                  rounded-full
                  bg-cream-dark
                  text-ink-muted
                "
              >
                <Search size={19} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-ink">
                No applications found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-ink-muted">
                There are no {activeStatus} applications matching your search.
              </p>
            </Card.Content>
          </Card>
        )}
      </motion.section>
    </motion.div>
  );
};

export default SPOCApplications;
