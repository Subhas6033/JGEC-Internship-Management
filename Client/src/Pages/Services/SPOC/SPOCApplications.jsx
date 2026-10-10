import { useMemo, useState } from "react";

import { Search, SlidersHorizontal } from "lucide-react";

import { motion } from "framer-motion";

import { Card, Input, Button } from "../../../Components/index";

import SPOCApplicationStatusFilter from "../../../Components/SPOC/SPOCApplicationStatusFilter";

import { useNavigate } from "react-router-dom";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";

import { useSpocApplications } from "../../../Services/Queries/spocApplication.quires";

const SPOCApplications = () => {
  const [activeStatus, setActiveStatus] = useState("pending");

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useSpocApplications({
    search,
    status: "all",
  });

  const applications = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.applications)) {
      return data.applications;
    }

    return [];
  }, [data]);

  /* ---------------------------------------------------------------------- */
  /* Counts                                                                  */
  /* ---------------------------------------------------------------------- */

  const counts = useMemo(() => {
    return {
      pending: applications.filter(
        (application) => application.status === "under_spoc_review",
      ).length,

      accepted: applications.filter(
        (application) =>
          application.status === "approved_by_spoc" ||
          application.status === "noc_generated",
      ).length,

      rejected: applications.filter(
        (application) => application.status === "rejected",
      ).length,
    };
  }, [applications]);

  /* ---------------------------------------------------------------------- */
  /* Client-side search + status filter                                      */
  /* ---------------------------------------------------------------------- */

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      /* Status filter */

      if (
        activeStatus === "pending" &&
        application.status !== "under_spoc_review"
      ) {
        return false;
      }

      if (
        activeStatus === "accepted" &&
        application.status !== "approved_by_spoc" &&
        application.status !== "noc_generated"
      ) {
        return false;
      }

      if (activeStatus === "rejected" && application.status !== "rejected") {
        return false;
      }

      /* Search */

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        application._id,
        application.applicationId,
        application.organisation?.organisationName,
        application.organisation?.organisationLocation,
        application.organisation?.organisationMail,
        application.student?.fullName,
        application.student?.email,
        application.student?.rollNumber,
        application.student?.department,
        application.companyName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [applications, activeStatus, search]);

  const handleViewApplication = (application) => {
    const applicationId = application?._id;

    if (!applicationId) {
      console.error("Cannot view application: application ID is missing.");
      return;
    }

    navigate(`/spoc/applications/${applicationId}`);
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-sm text-ink-muted">Loading applications...</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                   */
  /* ---------------------------------------------------------------------- */

  if (isError) {
    return (
      <div className="px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <Card.Content className="p-6">
            <p className="text-sm font-semibold text-red-700">
              Failed to load SPOC applications
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"}
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

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
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}

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

      {/* ---------------------------------------------------------------- */}
      {/* Status filter                                                     */}
      {/* ---------------------------------------------------------------- */}

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

      {/* ---------------------------------------------------------------- */}
      {/* Search                                                            */}
      {/* ---------------------------------------------------------------- */}

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
                    text-ink-muted
                    p-2
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
              >
                <SlidersHorizontal size={15} />

                <span className="capitalize">{activeStatus} applications</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* Applications                                                       */}
      {/* ---------------------------------------------------------------- */}

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
          <div className="mt-4 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-card)">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-cream-soft">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Application ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Student
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Roll No.
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Department
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Organisation
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Internship
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Dates
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((application) => {
                    const student = application.student || {};

                    const organisation = application.organisation || {};

                    const startDate = application.tentativeStartDate
                      ? new Date(
                          application.tentativeStartDate,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A";

                    const endDate = application.tentativeEndDate
                      ? new Date(
                          application.tentativeEndDate,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A";

                    const statusLabel = String(
                      application.status || "N/A",
                    ).replaceAll("_", " ");

                    const applicationId =
                      application.applicationId || application._id || "N/A";

                    const internshipType = application.internshipType || "N/A";

                    const modeOfInternship =
                      application.modeOfInternship || "N/A";

                    return (
                      <tr
                        key={application._id}
                        className="
                          border-b border-border
                          last:border-b-0
                          transition-colors
                          hover:bg-cream-soft/60
                        "
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="text-sm font-semibold text-ink">
                            {applicationId}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="min-w-[170px]">
                            <p className="text-sm font-semibold text-ink">
                              {student.fullName || "Unknown Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-ink-muted">
                              {student.email || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="text-sm text-ink">
                            {student.rollNumber || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                            {student.department || "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="min-w-[190px]">
                            <p className="text-sm font-medium text-ink">
                              {organisation.organisationName ||
                                application.companyName ||
                                "Unknown Organisation"}
                            </p>

                            <p className="mt-0.5 text-xs text-ink-muted">
                              {organisation.organisationLocation || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="min-w-[120px]">
                            <p className="text-sm font-medium capitalize text-ink">
                              {internshipType}
                            </p>

                            <p className="mt-0.5 text-xs capitalize text-ink-muted">
                              {modeOfInternship}
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="text-xs text-ink">
                            <p>{startDate}</p>

                            <p className="mt-0.5 text-ink-muted">
                              to {endDate}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-xs font-medium capitalize text-ink">
                            {statusLabel}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end">
                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => handleViewApplication(application)}
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
