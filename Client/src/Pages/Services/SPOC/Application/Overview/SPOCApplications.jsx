import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, Button } from "../../../../../Components/index";
import { useNavigate } from "react-router-dom";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../../Animations/animations";
import { useSpocApplications } from "../../../../../Services/Queries/spocApplication.quires";
import SPOCApplicationStatusFilter from "../../../../../Components/SPOC/SPOCApplicationStatusFilter";
import SPOCApplicationHeader from "./SPOCApplicationHeader";
import SPOCApplicationSearch from "./SPOCApplicationSearch";
import SPOCApplicationTable from "./SPOCApplicationTable";

const getDisplayStatus = (application) => {
  if (application?.displayStatus) {
    return application.displayStatus;
  }

  const status = application?.status;

  if (["under_spoc_review", "approved_by_tpo"].includes(status)) {
    return "pending";
  }

  if (["approved_by_spoc", "noc_generated"].includes(status)) {
    return "accepted";
  }

  if (status === "rejected" || status === "update_required") {
    return status;
  }

  return status || "unknown";
};

const SPOCApplications = () => {
  const [activeStatus, setActiveStatus] = useState("pending");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useSpocApplications({
    search: "",
    status: "all",
  });

  const applications = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.applications)) return data.applications;
    return [];
  }, [data]);

  const normalizedApplications = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        displayStatus: getDisplayStatus(application),
      })),
    [applications],
  );

  const counts = useMemo(
    () =>
      normalizedApplications.reduce(
        (result, application) => {
          const status = application.displayStatus;

          if (status in result) {
            result[status] += 1;
          }

          return result;
        },
        {
          pending: 0,
          accepted: 0,
          rejected: 0,
        },
      ),
    [normalizedApplications],
  );

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return normalizedApplications.filter((application) => {
      if (
        activeStatus !== "all" &&
        application.displayStatus !== activeStatus
      ) {
        return false;
      }

      if (!normalizedSearch) return true;

      const student = application.student || {};
      const organisation = application.organisation || {};

      const searchableText = [
        application._id,
        application.id,
        application.applicationId,
        application.companyName,
        organisation.organisationName,
        organisation.name,
        organisation.organisationLocation,
        organisation.location,
        organisation.organisationMail,
        student.fullName,
        student.name,
        student.email,
        student.rollNumber,
        student.department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedApplications, activeStatus, search]);

  const handleViewApplication = (application) => {
    const applicationId = application?._id || application?.id;

    if (!applicationId) {
      console.error("Application ID is missing:", application);
      return;
    }

    navigate(`/spoc/applications/${applicationId}`);
  };

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

            <Button
              type="button"
              variant="primary"
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
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
      className="box-border w-full min-w-0 max-w-none overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
    >
      <motion.section variants={fadeUp} viewport={viewport}>
        <SPOCApplicationHeader total={applications.length} />
      </motion.section>

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

      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-5 w-full min-w-0"
      >
        <SPOCApplicationSearch
          search={search}
          setSearch={setSearch}
          activeStatus={activeStatus}
        />
      </motion.section>

      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-6 w-full min-w-0 sm:mt-8"
      >
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight text-ink sm:text-xl">
              {activeStatus === "all"
                ? "All Applications"
                : `${activeStatus.replaceAll("_", " ")} Applications`}
            </h2>

            <p className="mt-1 text-xs leading-5 text-ink-muted sm:text-sm">
              {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="mt-4 w-full min-w-0">
          <SPOCApplicationTable
            applications={filteredApplications}
            loading={isLoading}
            onView={handleViewApplication}
            emptyDescription={`There are no ${
              activeStatus === "all"
                ? ""
                : `${activeStatus.replaceAll("_", " ")} `
            }applications matching your search.`}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SPOCApplications;
