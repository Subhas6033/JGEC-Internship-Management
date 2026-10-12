import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSpocApplications,
  useAcceptSpocApplication,
  useSendBackSpocApplication,
  useGenerateBulkSpocNoc,
} from "../../../../Services/Queries/spocApplication.quires";
import DashboardHeader from "./DashboardHeader";
import ApplicationSearch from "./ApplicationSearch";
import DashboardSummary from "./DashboardSummary";
import BulkNocActionBar from "./BulkNocActionBar";
import BulkNocResult from "./BulkNocResult";
import EmptyApplications from "./EmptyApplications";
import OrganisationCard from "./OrganisationCard";
import DecisionModal from "./DecisionModal";
import GenerateNocModal from "./GenerateNocModal";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";
import {
  getAcceptedApplications,
  getApplicationId,
  getDepartment,
  getOrganisation,
  getRollNumber,
  getStudentName,
  isAcceptedCandidate,
  isPendingForSpoc,
} from "./spocDashboard.utils";

const SPOCDashboard = () => {
  const navigate = useNavigate();

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useSpocApplications({ status: "all" });

  const acceptMutation = useAcceptSpocApplication();
  const sendBackMutation = useSendBackSpocApplication();
  const generateBulkNocMutation = useGenerateBulkSpocNoc();
  const [search, setSearch] = useState("");
  const [expandedOrganisations, setExpandedOrganisations] = useState({});
  const [decisionModal, setDecisionModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionError, setActionError] = useState("");
  const [nocModal, setNocModal] = useState(null);
  const [selectedBulkApplicationIds, setSelectedBulkApplicationIds] = useState(
    [],
  );
  const [bulkNocError, setBulkNocError] = useState("");
  const [bulkNocResult, setBulkNocResult] = useState(null);
  const actionLoading = acceptMutation.isPending || sendBackMutation.isPending;
  const bulkLoading = generateBulkNocMutation.isPending;
  // Organisations Filtering & Grouping
  const organisationGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = applications.filter((application) => {
      if (!query) return true;
      const organisation = getOrganisation(application);

      return [
        organisation.name,
        organisation.location,
        getStudentName(application),
        getRollNumber(application),
        getDepartment(application),
        application?.status,
        application?.designation,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );
    });

    const groups = new Map();
    filtered.forEach((application) => {
      const organisation = getOrganisation(application);
      const key = organisation.id || organisation.name;
      if (!groups.has(key)) {
        groups.set(key, {
          ...organisation,
          applications: [],
        });
      }
      groups.get(key).applications.push(application);
    });
    return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [applications, search]);

  // Expand the Organisations
  const toggleOrganisation = (organisationId) => {
    setExpandedOrganisations((previous) => ({
      ...previous,
      [organisationId]: !(previous[organisationId] !== false),
    }));
  };

  // BULK Sections
  const toggleBulkApplication = (applicationId) => {
    if (!applicationId || bulkLoading) return;
    setSelectedBulkApplicationIds((previous) =>
      previous.includes(applicationId)
        ? previous.filter((id) => id !== applicationId)
        : [...previous, applicationId],
    );
    setBulkNocError("");
  };

  const clearBulkSelection = () => {
    if (bulkLoading) return;
    setSelectedBulkApplicationIds([]);
    setBulkNocError("");
  };

  const toggleAcceptedApplications = (acceptedApplications) => {
    if (bulkLoading) return;
    const acceptedIds = acceptedApplications
      .map(getApplicationId)
      .filter(Boolean);
    if (acceptedIds.length === 0) return;
    const allSelected = acceptedIds.every((id) =>
      selectedBulkApplicationIds.includes(id),
    );
    setSelectedBulkApplicationIds((previous) =>
      allSelected
        ? previous.filter((id) => !acceptedIds.includes(id))
        : [...new Set([...previous, ...acceptedIds])],
    );
    setBulkNocError("");
  };

  const getSelectedAcceptedApplications = () =>
    applications.filter((application) => {
      const id = getApplicationId(application);
      return (
        id &&
        selectedBulkApplicationIds.includes(id) &&
        isAcceptedCandidate(application)
      );
    });

  // BULK NOC Modal
  const openNocModal = (organisation) => {
    const acceptedApplications = getAcceptedApplications(organisation);
    if (acceptedApplications.length === 0) return;
    setBulkNocError("");
    setBulkNocResult(null);
    setNocModal({
      organisation,
      acceptedApplications,
      selectedApplicationIds: acceptedApplications
        .map(getApplicationId)
        .filter(Boolean),
    });
  };

  const closeNocModal = () => {
    if (bulkLoading) return;
    setNocModal(null);
    setBulkNocError("");
    setBulkNocResult(null);
  };

  const toggleNocModalApplication = (applicationId) => {
    if (!applicationId || bulkLoading) return;
    setNocModal((previous) => {
      if (!previous) return previous;
      const selected = previous.selectedApplicationIds || [];
      return {
        ...previous,
        selectedApplicationIds: selected.includes(applicationId)
          ? selected.filter((id) => id !== applicationId)
          : [...selected, applicationId],
      };
    });
    setBulkNocError("");
  };

  const selectAllNocModalApplications = () => {
    if (bulkLoading) return;
    setNocModal((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        selectedApplicationIds: previous.acceptedApplications
          .map(getApplicationId)
          .filter(Boolean),
      };
    });
    setBulkNocError("");
  };

  const clearNocModalApplications = () => {
    if (bulkLoading) return;
    setNocModal((previous) =>
      previous ? { ...previous, selectedApplicationIds: [] } : previous,
    );
    setBulkNocError("");
  };

  // Generate BULK NOCs
  const submitBulkGenerateNoc = async (applicationIds) => {
    const validIds = [...new Set(applicationIds.filter(Boolean))];
    if (validIds.length === 0) {
      setBulkNocError("Select at least one accepted application.");
      return;
    }
    try {
      setBulkNocError("");
      const result = await generateBulkNocMutation.mutateAsync(validIds);
      setBulkNocResult(result);
      setSelectedBulkApplicationIds([]);
    } catch (err) {
      console.error("Bulk NOC generation failed:", err);
      setBulkNocError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to generate bulk NOCs.",
      );
    }
  };

  const submitModalBulkNoc = async () => {
    if (!nocModal) return;
    const selectedIds = nocModal.selectedApplicationIds || [];
    const validAcceptedIds = new Set(
      nocModal.acceptedApplications.map(getApplicationId).filter(Boolean),
    );
    const applicationIds = selectedIds.filter((id) => validAcceptedIds.has(id));
    if (applicationIds.length === 0) {
      setBulkNocError("Select at least one accepted student.");
      return;
    }
    await submitBulkGenerateNoc(applicationIds);
  };

  const submitDashboardBulkNoc = async () => {
    const selectedApplications = getSelectedAcceptedApplications();
    await submitBulkGenerateNoc(selectedApplications.map(getApplicationId));
  };

  // Applications Navigations
  const handleViewApplication = (application) => {
    const applicationId = getApplicationId(application);
    if (!applicationId) {
      console.error("Missing application ID:", application);
      return;
    }
    navigate(`/spoc/applications/${applicationId}`);
  };

  // Application Decission Modal
  const openDecisionModal = (application, decision) => {
    setDecisionModal({ application, decision });
    setRemarks("");
    setActionError("");
  };

  const closeDecisionModal = () => {
    if (actionLoading) return;
    setDecisionModal(null);
    setRemarks("");
    setActionError("");
  };

  const submitDecision = async () => {
    if (!decisionModal) return;
    const { application, decision } = decisionModal;
    const applicationId = getApplicationId(application);
    if (!applicationId) {
      setActionError("Application ID is missing.");
      return;
    }
    const trimmedRemarks = remarks.trim();
    if (
      (decision === "reject" || decision === "send_back") &&
      !trimmedRemarks
    ) {
      setActionError(
        decision === "reject"
          ? "Please provide a rejection reason."
          : "Please provide remarks explaining what needs to be updated.",
      );
      return;
    }

    /*
     * Keep rejection separate from send-back.
     * No reject mutation is defined in the current SPOC React Query API.
     */
    if (decision === "reject") {
      setActionError(
        "Reject mutation is not available in the current SPOC API.",
      );
      return;
    }

    try {
      setActionError("");

      if (decision === "approve") {
        await acceptMutation.mutateAsync(applicationId);
      } else if (decision === "send_back") {
        await sendBackMutation.mutateAsync({
          applicationId,
          reason: trimmedRemarks,
        });
      }

      closeDecisionModal();
    } catch (err) {
      console.error("SPOC application action failed:", err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while processing this application.",
      );
    }
  };

  // Page Loading & Error
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-8 md:px-8">
        <DashboardLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-8 md:px-8">
        <DashboardError message={error?.message} />
      </div>
    );
  }

  // Main Page Components
  return (
    <>
      {/* Page MetaData */}
      <title>Internship Applications | SPOC Portal | JGEC</title>
      <meta
        name="description"
        content="Review internship applications by organisation, manage SPOC decisions, and generate bulk NOCs in the JGEC Internship Management Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#f8f5eb" />

      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        {/* Main Page Starts from Here */}
        <div className="mx-auto max-w-7xl">
          <DashboardHeader />
          <ApplicationSearch value={search} onChange={setSearch} />
          <BulkNocActionBar
            selectedCount={selectedBulkApplicationIds.length}
            loading={bulkLoading}
            onClear={clearBulkSelection}
            onGenerate={submitDashboardBulkNoc}
          />
          {bulkNocError && !nocModal && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {bulkNocError}
            </div>
          )}
          {!nocModal && (
            <BulkNocResult
              result={bulkNocResult}
              onDismiss={() => setBulkNocResult(null)}
            />
          )}
          <DashboardSummary
            organisationCount={organisationGroups.length}
            studentCount={applications.length}
            pendingCount={applications.filter(isPendingForSpoc).length}
          />
          {organisationGroups.length === 0 ? (
            <EmptyApplications />
          ) : (
            <div className="space-y-5">
              {organisationGroups.map((organisation) => {
                const key = organisation.id || organisation.name;
                return (
                  <OrganisationCard
                    key={key}
                    organisation={organisation}
                    isExpanded={expandedOrganisations[key] !== false}
                    selectedIds={selectedBulkApplicationIds}
                    actionLoading={actionLoading}
                    bulkLoading={bulkLoading}
                    onToggleOrganisation={toggleOrganisation}
                    onToggleSelection={toggleBulkApplication}
                    onToggleAcceptedSelection={toggleAcceptedApplications}
                    onGenerateNoc={openNocModal}
                    onView={handleViewApplication}
                    onDecision={openDecisionModal}
                  />
                );
              })}
            </div>
          )}
        </div>
        {decisionModal && (
          <DecisionModal
            application={decisionModal.application}
            decision={decisionModal.decision}
            remarks={remarks}
            setRemarks={setRemarks}
            actionError={actionError}
            actionLoading={actionLoading}
            onClose={closeDecisionModal}
            onSubmit={submitDecision}
          />
        )}
        {nocModal && (
          <GenerateNocModal
            organisation={nocModal.organisation}
            acceptedApplications={nocModal.acceptedApplications}
            selectedApplicationIds={nocModal.selectedApplicationIds}
            onToggle={toggleNocModalApplication}
            onSelectAll={selectAllNocModalApplications}
            onClear={clearNocModalApplications}
            result={bulkNocResult}
            error={bulkNocError}
            loading={bulkLoading}
            onClose={closeNocModal}
            onSubmit={submitModalBulkNoc}
          />
        )}
      </div>
    </>
  );
};

export default SPOCDashboard;
