import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  FileCheck,
  Loader2,
  Mail,
  MapPin,
  RotateCcw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../Components/index";

import {
  useSpocApplications,
  useAcceptSpocApplication,
  useSendBackSpocApplication,
  useGenerateSpocNoc,
} from "../../../Services/Queries/spocApplication.quires";

const SPOCDashboard = () => {
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                              REACT QUERY                                   */
  /* -------------------------------------------------------------------------- */

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useSpocApplications({
    status: "all",
  });

  const acceptMutation = useAcceptSpocApplication();
  const sendBackMutation = useSendBackSpocApplication();
  const generateNocMutation = useGenerateSpocNoc();

  /* -------------------------------------------------------------------------- */
  /*                              LOCAL STATE                                   */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [expandedOrganisations, setExpandedOrganisations] = useState({});
  const [decisionModal, setDecisionModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionError, setActionError] = useState("");

  const [nocModal, setNocModal] = useState(null);
  const [nocError, setNocError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                              HELPERS                                       */
  /* -------------------------------------------------------------------------- */

  const getValue = (value, fallback = "—") => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }

    return value;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getApplicationId = (application) => {
    return application?.applicationId || application?.id || application?._id;
  };

  const getStudentName = (application) => {
    const student = application?.student;

    return (
      student?.fullName ||
      student?.name ||
      application?.studentName ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (application) => {
    const student = application?.student;

    return (
      student?.email ||
      student?.collegeEmail ||
      application?.studentEmail ||
      "—"
    );
  };

  const getRollNumber = (application) => {
    const student = application?.student;

    return (
      student?.rollNumber ||
      student?.roll ||
      application?.rollNumber ||
      application?.roll ||
      "—"
    );
  };

  const getDepartment = (application) => {
    const student = application?.student;

    return (
      student?.department?.name ||
      student?.department ||
      application?.department?.name ||
      application?.department ||
      "—"
    );
  };

  const getOrganisation = (application) => {
    const organisation = application?.organisation;

    return {
      id:
        organisation?._id ||
        organisation?.id ||
        application?.organisationId ||
        "unknown",

      name:
        organisation?.name ||
        organisation?.organisationName ||
        application?.organisationName ||
        application?.companyName ||
        application?.company ||
        "Organisation",

      location:
        organisation?.location ||
        organisation?.city ||
        application?.organisationLocation ||
        "—",

      email: organisation?.email || application?.organisationEmail || "—",

      phone:
        organisation?.phone ||
        organisation?.contactNumber ||
        application?.organisationPhone ||
        "—",
    };
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: "Draft",
      submitted: "Submitted",
      under_tpo_review: "Under TPO Review",
      update_required: "Update Required",
      approved_by_tpo: "Pending SPOC",
      under_spoc_review: "Pending SPOC",
      approved_by_spoc: "Approved",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
      noc_generated: "NOC Generated",
    };

    return labels[status] || status || "Unknown";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved_by_tpo":
      case "under_spoc_review":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "approved_by_spoc":
      case "noc_generated":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      case "update_required":
        return "border-orange-200 bg-orange-50 text-orange-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
    }
  };

  const isPendingForSpoc = (application) => {
    return (
      application?.status === "approved_by_tpo" ||
      application?.status === "under_spoc_review"
    );
  };

  const isAcceptedCandidate = (application) => {
    return application?.status === "approved_by_spoc";
  };

  const getAcceptedApplications = (organisation) => {
    return (organisation?.applications || []).filter(isAcceptedCandidate);
  };

  /* -------------------------------------------------------------------------- */
  /*                         GROUP BY ORGANISATION                               */
  /* -------------------------------------------------------------------------- */

  const organisationGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      if (!query) return true;

      const organisation = getOrganisation(application);
      const studentName = getStudentName(application);
      const rollNumber = getRollNumber(application);
      const department = getDepartment(application);

      return [
        organisation.name,
        organisation.location,
        studentName,
        rollNumber,
        department,
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

      const groupKey = organisation.id || organisation.name;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          ...organisation,
          applications: [],
        });
      }

      groups.get(groupKey).applications.push(application);
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [applications, search]);

  /* -------------------------------------------------------------------------- */
  /*                         EXPAND / COLLAPSE                                  */
  /* -------------------------------------------------------------------------- */

  const toggleOrganisation = (organisationId) => {
    setExpandedOrganisations((previous) => ({
      ...previous,
      [organisationId]: !previous[organisationId],
    }));
  };

  /* -------------------------------------------------------------------------- */
  /*                              NAVIGATION                                    */
  /* -------------------------------------------------------------------------- */

  const handleViewApplication = (application) => {
    const applicationId = getApplicationId(application);

    if (!applicationId) {
      console.error("Missing application ID:", application);
      return;
    }

    navigate(`/spoc/applications/${applicationId}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                              DECISION                                      */
  /* -------------------------------------------------------------------------- */

  const openDecisionModal = (application, decision) => {
    setDecisionModal({
      application,
      decision,
    });

    setRemarks("");
    setActionError("");
  };

  const closeDecisionModal = () => {
    if (acceptMutation.isPending || sendBackMutation.isPending) {
      return;
    }

    setDecisionModal(null);
    setRemarks("");
    setActionError("");
  };

  const submitDecision = async () => {
    if (!decisionModal) return;

    const application = decisionModal.application;
    const decision = decisionModal.decision;
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

    try {
      setActionError("");

      if (decision === "approve") {
        await acceptMutation.mutateAsync(applicationId);
      }

      if (decision === "send_back") {
        await sendBackMutation.mutateAsync({
          applicationId,
          reason: trimmedRemarks,
        });
      }

      /*
       * Reject requires a separate React Query mutation.
       *
       * Do not send reject through the send-back mutation.
       */
      if (decision === "reject") {
        setActionError(
          "Reject mutation is not available in the current SPOC API.",
        );
        return;
      }

      closeDecisionModal();
    } catch (err) {
      console.error("SPOC application action failed:", err);

      setActionError(
        err?.message ||
          "Something went wrong while processing this application.",
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              NOC                                           */
  /* -------------------------------------------------------------------------- */

  const openNocModal = (organisation) => {
    const acceptedApplications = getAcceptedApplications(organisation);

    if (acceptedApplications.length === 0) {
      return;
    }

    setNocError("");

    setNocModal({
      organisation,
      acceptedApplications,
      selectedApplicationId:
        acceptedApplications.length === 1
          ? getApplicationId(acceptedApplications[0])
          : "",
    });
  };

  const closeNocModal = () => {
    if (generateNocMutation.isPending) {
      return;
    }

    setNocModal(null);
    setNocError("");
  };

  const submitGenerateNoc = async () => {
    if (!nocModal?.selectedApplicationId) {
      setNocError("Please select an accepted candidate.");
      return;
    }

    try {
      setNocError("");

      await generateNocMutation.mutateAsync(nocModal.selectedApplicationId);

      closeNocModal();
    } catch (err) {
      console.error("NOC generation failed:", err);

      setNocError(err?.message || "Unable to generate NOC for this candidate.");
    }
  };

  const actionLoading = acceptMutation.isPending || sendBackMutation.isPending;

  /* -------------------------------------------------------------------------- */
  /*                              LOADING                                       */
  /* -------------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-8 md:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />

            <p className="text-sm font-medium text-slate-600">
              Loading applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              ERROR                                         */
  /* -------------------------------------------------------------------------- */

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-3 text-lg font-semibold text-red-800">
              Unable to load applications
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error?.message ||
                "Something went wrong while loading applications."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  PAGE                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              SPOC Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Internship Applications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review students grouped by organisation and take action on each
              application.
            </p>
          </div>
        </div>

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organisation, student, roll number or department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Building2 size={19} />}
            title="Organisations"
            value={organisationGroups.length}
          />

          <SummaryCard
            icon={<User size={19} />}
            title="Students"
            value={applications.length}
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            title="Pending Review"
            value={applications.filter(isPendingForSpoc).length}
          />
        </div>

        {/* EMPTY */}

        {organisationGroups.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              No applications found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              There are no applications matching your search.
            </p>
          </div>
        )}

        {/* ORGANISATIONS */}

        <div className="space-y-5">
          {organisationGroups.map((organisation) => {
            const organisationKey = organisation.id || organisation.name;

            const isExpanded = expandedOrganisations[organisationKey] !== false;

            const pendingCount =
              organisation.applications.filter(isPendingForSpoc).length;

            const acceptedApplications = getAcceptedApplications(organisation);

            const acceptedCount = acceptedApplications.length;

            return (
              <Card
                key={organisationKey}
                className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm"
              >
                {/* ORGANISATION HEADER */}

                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
                  <button
                    type="button"
                    onClick={() => toggleOrganisation(organisationKey)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-bold text-slate-900 md:text-lg">
                          {organisation.name}
                        </h2>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {organisation.applications.length}{" "}
                          {organisation.applications.length === 1
                            ? "student"
                            : "students"}
                        </span>

                        {pendingCount > 0 && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {pendingCount} pending
                          </span>
                        )}

                        {acceptedCount > 0 && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {acceptedCount} accepted
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {organisation.location !== "—" && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} />
                            {organisation.location}
                          </span>
                        )}

                        {organisation.email !== "—" && (
                          <span className="inline-flex items-center gap-1">
                            <Mail size={13} />
                            {organisation.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* ORGANISATION ACTIONS */}

                  <div className="flex shrink-0 items-center gap-2">
                    {acceptedCount > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openNocModal(organisation);
                        }}
                        disabled={generateNocMutation.isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {generateNocMutation.isPending ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <FileCheck size={15} />
                        )}
                        Generate NOC
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleOrganisation(organisationKey);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        isExpanded
                          ? "Collapse organisation"
                          : "Expand organisation"
                      }
                    >
                      {isExpanded ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* STUDENT TABLE */}

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Student
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Roll No.
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Department
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Internship
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Dates
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                          </th>

                          <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {organisation.applications.map((application) => {
                          const applicationId = getApplicationId(application);

                          const studentName = getStudentName(application);

                          const pending = isPendingForSpoc(application);

                          return (
                            <tr
                              key={applicationId}
                              className="transition hover:bg-slate-50/70"
                            >
                              {/* STUDENT */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                                    {studentName.charAt(0).toUpperCase()}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800">
                                      {studentName}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                      {getStudentEmail(application)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* ROLL */}

                              <td className="px-4 py-4">
                                <span className="font-mono text-sm text-slate-700">
                                  {getRollNumber(application)}
                                </span>
                              </td>

                              {/* DEPARTMENT */}

                              <td className="px-4 py-4">
                                <span className="text-sm font-medium text-slate-700">
                                  {getDepartment(application)}
                                </span>
                              </td>

                              {/* INTERNSHIP */}

                              <td className="px-4 py-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {getValue(
                                      application?.designation,
                                      application?.type || "Internship",
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    {getValue(application?.modeOfInternship)}
                                  </p>
                                </div>
                              </td>

                              {/* DATES */}

                              <td className="px-4 py-4">
                                <p className="text-xs text-slate-600">
                                  {formatDate(application?.tentativeStartDate)}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  to {formatDate(application?.tentativeEndDate)}
                                </p>
                              </td>

                              {/* STATUS */}

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                    application?.status,
                                  )}`}
                                >
                                  {getStatusLabel(application?.status)}
                                </span>
                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {/* VIEW */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewApplication(application)
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                  >
                                    <Eye size={15} />
                                    View
                                  </button>

                                  {/* PENDING ACTIONS */}

                                  {pending && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          openDecisionModal(
                                            application,
                                            "approve",
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        <CheckCircle2 size={15} />
                                        Accept
                                      </button>

                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          openDecisionModal(
                                            application,
                                            "reject",
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        <XCircle size={15} />
                                        Reject
                                      </button>

                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          openDecisionModal(
                                            application,
                                            "send_back",
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        <RotateCcw size={15} />
                                        Send Back
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DECISION MODAL                                                       */}
      {/* ==================================================================== */}

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
          getStudentName={getStudentName}
          getOrganisation={getOrganisation}
        />
      )}

      {/* ==================================================================== */}
      {/* GENERATE NOC MODAL                                                   */}
      {/* ==================================================================== */}

      {nocModal && (
        <GenerateNocModal
          organisation={nocModal.organisation}
          acceptedApplications={nocModal.acceptedApplications}
          selectedApplicationId={nocModal.selectedApplicationId}
          setSelectedApplicationId={(applicationId) =>
            setNocModal((previous) => ({
              ...previous,
              selectedApplicationId: applicationId,
            }))
          }
          error={nocError}
          loading={generateNocMutation.isPending}
          onClose={closeNocModal}
          onSubmit={submitGenerateNoc}
          getStudentName={getStudentName}
          getRollNumber={getRollNumber}
        />
      )}
    </div>
  );
};

/* ========================================================================== */
/*                              SUMMARY CARD                                  */
/* ========================================================================== */

const SummaryCard = ({ icon, title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*                            DECISION MODAL                                  */
/* ========================================================================== */

const DecisionModal = ({
  application,
  decision,
  remarks,
  setRemarks,
  actionError,
  actionLoading,
  onClose,
  onSubmit,
  getStudentName,
  getOrganisation,
}) => {
  const studentName = getStudentName(application);
  const organisation = getOrganisation(application);

  const isApprove = decision === "approve";
  const isReject = decision === "reject";
  const isSendBack = decision === "send_back";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isApprove && "Accept Application"}
                {isReject && "Reject Application"}
                {isSendBack && "Send Application Back"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isApprove
                  ? "Confirm that you want to accept this student's application."
                  : isReject
                    ? "Provide a reason for rejecting this student's application."
                    : "Explain what information or documents the student needs to update."}
              </p>
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <XCircle size={21} />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Student
            </p>

            <p className="mt-1 font-semibold text-slate-900">{studentName}</p>

            <p className="mt-0.5 text-sm text-slate-500">{organisation.name}</p>
          </div>

          {isApprove && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />

                <p className="text-sm leading-6 text-emerald-800">
                  This student's application will be marked as approved by the
                  SPOC.
                </p>
              </div>
            </div>
          )}

          {!isApprove && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Remarks
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={5}
                placeholder={
                  isReject
                    ? "Explain why this application is being rejected..."
                    : "Explain what the student needs to update..."
                }
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          {actionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {actionError}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={actionLoading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={actionLoading || (!isApprove && !remarks.trim())}
            onClick={onSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              isApprove
                ? "bg-emerald-700 hover:bg-emerald-800"
                : isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {actionLoading && <Loader2 size={17} className="animate-spin" />}

            {actionLoading
              ? "Processing..."
              : isApprove
                ? "Confirm Accept"
                : isReject
                  ? "Reject Application"
                  : "Send Back Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*                          GENERATE NOC MODAL                                */
/* ========================================================================== */

const GenerateNocModal = ({
  organisation,
  acceptedApplications,
  selectedApplicationId,
  setSelectedApplicationId,
  error,
  loading,
  onClose,
  onSubmit,
  getStudentName,
  getRollNumber,
}) => {
  const selectedApplication = acceptedApplications.find(
    (application) =>
      getApplicationIdFromModal(application) === selectedApplicationId,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FileCheck size={18} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Generate NOC
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Select the accepted candidate for whom the NOC should be
                generated.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <XCircle size={21} />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Organisation
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {organisation?.name || "Organisation"}
            </p>

            {organisation?.location && organisation.location !== "—" && (
              <p className="mt-0.5 text-sm text-slate-500">
                {organisation.location}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Accepted Candidate
            </label>

            <select
              value={selectedApplicationId}
              onChange={(event) => setSelectedApplicationId(event.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            >
              <option value="">Select an accepted candidate</option>

              {acceptedApplications.map((application) => {
                const applicationId = getApplicationIdFromModal(application);

                return (
                  <option key={applicationId} value={applicationId}>
                    {getStudentName(application)} — {getRollNumber(application)}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedApplication && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <p className="font-semibold text-emerald-900">
                    {getStudentName(selectedApplication)}
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Roll No: {getRollNumber(selectedApplication)}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    Only this candidate's application will receive the generated
                    NOC.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || !selectedApplicationId}
            onClick={onSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading ? "Generating..." : "Generate NOC"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*                              HELPERS                                       */
/* ========================================================================== */

const getApplicationIdFromModal = (application) => {
  return application?.applicationId || application?.id || application?._id;
};

export default SPOCDashboard;
