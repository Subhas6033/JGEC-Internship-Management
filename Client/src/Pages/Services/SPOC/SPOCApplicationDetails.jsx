import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
  RotateCcw,
  Loader2,
  AlertCircle,
  BriefcaseBusiness,
  ExternalLink,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../../Components/index";
import {
  useSpocApplication,
  useAcceptSpocApplication,
  useSendBackSpocApplication,
} from "../../../Services/Queries/spocApplication.quires";
// IMPORTANT:
// This function must call your authenticated apiClient and request
// /applications/spoc/:applicationId/noc/pdf with responseType: "blob".
import { downloadSpocNocPdf } from "../../../Services/Application/spocApplication.api";

const SPOCApplicationDetails = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const {
    data: application,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useSpocApplication(applicationId);
  const acceptMutation = useAcceptSpocApplication();
  const sendBackMutation = useSendBackSpocApplication();
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decision, setDecision] = useState("");
  const [remarks, setRemarks] = useState("");
  const [actionError, setActionError] = useState("");
  const [isOpeningNoc, setIsOpeningNoc] = useState(false);
  const actionLoading =
    acceptMutation.isPending || sendBackMutation.isPending || isOpeningNoc;
  const error = actionError || queryError?.message || "";
  // Format Date
  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  // Format Date and Time
  const formatDateTime = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }
    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Duration is calculated strictly as:
   *
   * tentativeEndDate - tentativeStartDate
   *
   * Example:
   * 08 Oct 2026 -> 31 Dec 2026 = 84 days
   */
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return "—";
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "—";
    }
    const startUTC = Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
    );
    const endUTC = Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
    );
    const difference = endUTC - startUTC;
    if (difference < 0) {
      return "Invalid period";
    }
    const days = Math.round(difference / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: "Draft",
      submitted: "Submitted",
      under_tpo_review: "Under TPO Review",
      update_required: "Update Required",
      approved_by_tpo: "Pending SPOC Review",
      under_spoc_review: "Under SPOC Review",
      approved_by_spoc: "Approved by SPOC",
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
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "approved_by_spoc":
      case "noc_generated":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "update_required":
        return "bg-orange-50 text-orange-700 border-orange-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

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
  // Student Helpers
  const student = application?.student || {};
  const organisation = application?.organisation || {};
  const studentName =
    student?.fullName || student?.name || application?.studentName || "Student";
  const studentEmail =
    student?.email || student?.collegeEmail || application?.studentEmail;
  const studentPhone =
    student?.mobileNumber ||
    student?.mobile ||
    student?.phoneNumber ||
    application?.studentPhone;
  const rollNumber =
    student?.rollNumber ||
    student?.roll ||
    application?.rollNumber ||
    application?.roll;
  const department =
    student?.department?.name ||
    student?.department ||
    application?.department?.name ||
    application?.department;
  const semester = student?.semester || application?.semester;
  const organisationName =
    organisation?.organisationName ||
    organisation?.name ||
    application?.organisationName ||
    "Organisation";
  const organisationLocation =
    organisation?.organisationLocation ||
    organisation?.location ||
    organisation?.city ||
    application?.organisationLocation;
  const designation = application?.designation;
  const startDate = application?.tentativeStartDate;
  const endDate = application?.tentativeEndDate;
  const internshipDuration = calculateDuration(startDate, endDate);
  const workLocation = Array.isArray(application?.tentativeWorkLocations)
    ? application.tentativeWorkLocations.join(", ")
    : getValue(application?.tentativeWorkLocations);

  /**
   * NOC Handelling
   * Opens the actual generated NOC PDF.
   *
   * We DO NOT use:
   *
   * <a href={application.noc.fileUrl}>
   *
   * because fileUrl is a protected backend API endpoint.
   *
   * Instead:
   *
   * React -> authenticated apiClient -> PDF Blob -> new browser tab
   */
  const handleOpenNoc = async () => {
    if (!applicationId || !application?.noc) {
      return;
    }
    let nocWindow = null;
    let objectUrl = null;
    try {
      setIsOpeningNoc(true);
      setActionError("");
      /*
       * Open the tab immediately so browsers do not block
       * the new tab after the asynchronous API request.
       */
      nocWindow = window.open("about:blank", "_blank");
      const pdfBlob = await downloadSpocNocPdf(applicationId);
      if (!pdfBlob) {
        throw new Error("NOC PDF was not returned by the server.");
      }
      /*
       * Some API wrappers return Axios response.data,
       * while others may return the complete response.
       */
      const blob =
        pdfBlob instanceof Blob
          ? pdfBlob
          : pdfBlob?.data instanceof Blob
            ? pdfBlob.data
            : new Blob([pdfBlob], {
                type: "application/pdf",
              });
      objectUrl = window.URL.createObjectURL(blob);
      if (nocWindow && !nocWindow.closed) {
        nocWindow.location.href = objectUrl;
      } else {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
      }
      /*
       * Keep the Blob URL alive for the newly opened document.
       * Revoking immediately can cause the PDF viewer to fail.
       */
      window.setTimeout(() => {
        if (objectUrl) {
          window.URL.revokeObjectURL(objectUrl);
        }
      }, 60_000);
    } catch (err) {
      console.error("Failed to open NOC:", err);
      if (nocWindow && !nocWindow.closed) {
        nocWindow.close();
      }
      setActionError(err?.message || "Unable to open the generated NOC PDF.");
    } finally {
      setIsOpeningNoc(false);
    }
  };
  // Decissions Modal
  const openDecisionModal = (selectedDecision) => {
    setDecision(selectedDecision);
    setRemarks("");
    setActionError("");
    setShowDecisionModal(true);
  };

  const closeDecisionModal = () => {
    if (actionLoading) return;
    setShowDecisionModal(false);
    setDecision("");
    setRemarks("");
    setActionError("");
  };

  // SPOC Decissions
  const submitDecision = async () => {
    if (!decision || !applicationId) return;
    const trimmedRemarks = remarks.trim();
    if (
      (decision === "reject" || decision === "send_back") &&
      !trimmedRemarks
    ) {
      setActionError(
        decision === "reject"
          ? "Please provide a reason for rejecting the application."
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
      if (decision === "reject") {
        setActionError(
          "Reject mutation is not available in the current SPOC React Query API.",
        );
        return;
      }
      closeDecisionModal();
      await refetch();
    } catch (err) {
      console.error("SPOC decision failed:", err);
      setActionError(
        err?.message || "Something went wrong while processing the decision.",
      );
    }
  };
  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            <p className="text-sm font-medium text-slate-600">
              Loading application details...
            </p>
          </div>
        </div>
      </div>
    );
  }
  // Error State
  if (isError || !application) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/spoc/applications")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Applications
          </button>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h2 className="text-lg font-semibold text-red-800">
              Unable to load application
            </h2>
            <p className="mt-2 text-sm text-red-600">
              {queryError?.message ||
                "The requested application could not be found."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  // State Helpers
  const isPendingForSpoc =
    application?.status === "approved_by_tpo" ||
    application?.status === "under_spoc_review";
  const hasGeneratedNoc =
    application?.status === "noc_generated" && Boolean(application?.noc);
  // Main page Components
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Headers */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/spoc/applications")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Applications
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Application Details
                </h1>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                    application.status,
                  )}`}
                >
                  {getStatusLabel(application.status)}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                Review the student's internship application.
              </p>
            </div>

            <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-67.5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Application ID
              </p>

              <p className="mt-1 truncate font-mono text-sm text-slate-700">
                {application?._id || application?.id || applicationId}
              </p>
            </div>
          </div>
        </div>
        {/* Error Alerts */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Action failed</p>
              <p className="mt-1 wrap-break-word">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setActionError("")}
              className="shrink-0 text-red-500 hover:text-red-700"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<User size={19} />}
            title="Student"
            value={studentName}
          />
          <SummaryCard
            icon={<Building2 size={19} />}
            title="Organisation"
            value={organisationName}
          />
          <SummaryCard
            icon={<Clock3 size={19} />}
            title="Status"
            value={getStatusLabel(application.status)}
          />
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left Cloumn */}
          <div className="min-w-0 space-y-6">
            {/* Student Details */}
            <DetailsCard
              icon={<GraduationCap size={20} />}
              title="Student Details"
              description="Personal and academic information."
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <DetailItem
                  icon={<User size={17} />}
                  label="Full Name"
                  value={studentName}
                />
                <DetailItem label="Roll Number" value={getValue(rollNumber)} />
                <DetailItem
                  icon={<GraduationCap size={17} />}
                  label="Department"
                  value={getValue(department)}
                />
                <DetailItem label="Semester" value={getValue(semester)} />
                <DetailItem
                  icon={<Mail size={17} />}
                  label="Email"
                  value={getValue(studentEmail)}
                />
                <DetailItem
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={getValue(studentPhone)}
                />
              </div>
            </DetailsCard>

            {/* Organisation Details */}
            <DetailsCard
              icon={<Building2 size={20} />}
              title="Organisation Details"
              description="Information about the internship organisation."
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <DetailItem
                  icon={<Building2 size={17} />}
                  label="Organisation"
                  value={organisationName}
                />
                <DetailItem
                  icon={<MapPin size={17} />}
                  label="Location"
                  value={getValue(organisationLocation)}
                />
                <DetailItem
                  icon={<Mail size={17} />}
                  label="Organisation Email"
                  value={getValue(organisation?.organisationMail)}
                />
                <DetailItem label="Designation" value={getValue(designation)} />
                <DetailItem
                  label="Organisation Employee"
                  value={getValue(application?.organisationsEmployye)}
                />
                <DetailItem
                  label="Work Location"
                  value={getValue(workLocation)}
                />
              </div>
            </DetailsCard>

            {/* Internship Details */}
            <DetailsCard
              icon={<BriefcaseBusiness size={20} />}
              title="Internship Details"
              description="Internship period and placement information."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoBox
                  icon={<BriefcaseBusiness size={18} />}
                  label="Internship Type"
                  value={getValue(application?.internshipType)}
                />
                <InfoBox
                  icon={<BriefcaseBusiness size={18} />}
                  label="Mode"
                  value={getValue(application?.modeOfInternship)}
                />
                <InfoBox
                  icon={<CalendarDays size={18} />}
                  label="Start Date"
                  value={formatDate(startDate)}
                />
                <InfoBox
                  icon={<CalendarDays size={18} />}
                  label="End Date"
                  value={formatDate(endDate)}
                />
                {/* IMPORTANT:
                    Duration is calculated from endDate - startDate.
                */}
                <InfoBox
                  icon={<Clock3 size={18} />}
                  label="Duration"
                  value={internshipDuration}
                  highlighted
                />
                <InfoBox
                  icon={<MapPin size={18} />}
                  label="Work Location"
                  value={getValue(workLocation)}
                />
              </div>
            </DetailsCard>

            {/* Descriptions */}
            {application?.description && (
              <DetailsCard
                icon={<FileText size={20} />}
                title="Application Description"
                description="Additional information provided by the student."
              >
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {application.description}
                  </p>
                </div>
              </DetailsCard>
            )}

            {/* TPO Review */}
            <DetailsCard
              icon={<CheckCircle2 size={20} />}
              title="TPO Review"
              description="Previous TPO review information."
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <DetailItem
                  label="TPO Status"
                  value={getStatusLabel(
                    application?.tpoStatus || "approved_by_tpo",
                  )}
                />
                <DetailItem
                  label="Reviewed At"
                  value={formatDateTime(application?.tpoReviewedAt)}
                />
                <DetailItem
                  label="Reviewer"
                  value={getValue(
                    application?.tpoReviewedBy?.name ||
                      application?.tpoReviewedBy?.email ||
                      application?.tpoReviewedBy,
                  )}
                />
                <DetailItem
                  label="Remarks"
                  value={getValue(application?.tpoRemarks)}
                />
              </div>
            </DetailsCard>

            {/* SPOC Review */}
            {(application?.spocReviewedAt ||
              application?.spocReviewedBy ||
              application?.spocRemarks) && (
              <DetailsCard
                icon={<CheckCircle2 size={20} />}
                title="SPOC Review"
                description="Current SPOC review information."
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                  <DetailItem
                    label="Status"
                    value={getStatusLabel(application?.status)}
                  />
                  <DetailItem
                    label="Reviewed At"
                    value={formatDateTime(application?.spocReviewedAt)}
                  />
                  <DetailItem
                    label="Reviewer"
                    value={getValue(
                      application?.spocReviewedBy?.name ||
                        application?.spocReviewedBy?.email ||
                        application?.spocReviewedBy,
                    )}
                  />
                  <DetailItem
                    label="Remarks"
                    value={getValue(application?.spocRemarks)}
                  />
                </div>
              </DetailsCard>
            )}
          </div>
          {/* Right Cloumn */}
          <div className="min-w-0 space-y-6">
            {/* Applications Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Application Status
                  </h2>

                  <p className="text-xs text-slate-500">
                    Current application state
                  </p>
                </div>
              </div>

              <div
                className={`rounded-xl border px-4 py-4 ${getStatusClass(
                  application.status,
                )}`}
              >
                <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                  Status
                </p>

                <p className="mt-1 text-lg font-bold">
                  {getStatusLabel(application.status)}
                </p>
              </div>
            </div>
            {/* Internship Periods */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Internship Period
                  </h2>

                  <p className="text-xs text-slate-500">
                    Requested internship duration
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <PeriodRow label="Start Date" value={formatDate(startDate)} />
                <PeriodRow label="End Date" value={formatDate(endDate)} />
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                        Duration
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-900">
                        {internshipDuration}
                      </p>
                    </div>

                    <Clock3 className="h-6 w-6 text-emerald-700" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decissions Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={19} />
                  </div>
                  <h2 className="font-semibold text-slate-900">
                    SPOC Decision
                  </h2>
                </div>
                <p className="text-sm leading-6 text-slate-500">
                  Review the submitted information before making your decision.
                </p>
              </div>
              {isPendingForSpoc ? (
                <div className="space-y-3">
                  {/* Approve */}
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => openDecisionModal("approve")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {acceptMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    Approve Application
                    <ChevronRight size={17} />
                  </button>

                  {/* Send Back */}
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => openDecisionModal("send_back")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={18} />
                    Send Back
                  </button>

                  {/* Reject */}
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => openDecisionModal("reject")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={18} />
                    Reject Application
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-slate-400" />

                  <p className="text-sm font-semibold text-slate-700">
                    No action required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This application is no longer pending for SPOC review.
                  </p>
                </div>
              )}
            </div>
            {/* NOC */}
            {application?.noc && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-emerald-900">
                      NOC Generated
                    </h2>

                    <p className="text-xs text-emerald-700">
                      The No Objection Certificate is ready.
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl border border-emerald-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                    Reference Number
                  </p>

                  <p className="mt-1 break-all font-semibold text-emerald-900">
                    {getValue(application.noc?.referenceNumber)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-emerald-700">Generated At</p>

                  <p className="mt-1 text-sm font-medium text-emerald-900">
                    {formatDateTime(
                      application.noc?.generatedAt ||
                        application.noc?.createdAt,
                    )}
                  </p>
                </div>

                {hasGeneratedNoc && (
                  <button
                    type="button"
                    disabled={isOpeningNoc}
                    onClick={handleOpenNoc}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isOpeningNoc ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ExternalLink size={18} />
                    )}

                    {isOpeningNoc ? "Opening NOC..." : "Open Generated NOC"}
                  </button>
                )}
              </div>
            )}
            {/* Timelines */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Clock3 size={19} className="text-emerald-700" />

                <h2 className="font-semibold text-slate-900">
                  Application Timeline
                </h2>
              </div>

              <div className="space-y-5">
                <TimelineItem
                  title="Application Created"
                  date={application?.createdAt}
                  active
                />

                <TimelineItem
                  title="Submitted"
                  date={application?.submittedAt}
                  active={Boolean(application?.submittedAt)}
                />

                <TimelineItem
                  title="Approved by TPO"
                  date={application?.tpoReviewedAt}
                  active={Boolean(
                    application?.tpoReviewedAt ||
                    application?.status === "approved_by_tpo" ||
                    application?.status === "under_spoc_review" ||
                    application?.status === "approved_by_spoc" ||
                    application?.status === "noc_generated",
                  )}
                />

                <TimelineItem
                  title="SPOC Decision"
                  date={application?.spocReviewedAt}
                  active={Boolean(
                    application?.spocReviewedAt ||
                    application?.status === "approved_by_spoc" ||
                    application?.status === "noc_generated",
                  )}
                />

                <TimelineItem
                  title="NOC Generated"
                  date={application?.nocGeneratedAt}
                  active={Boolean(
                    application?.nocGeneratedAt ||
                    application?.status === "noc_generated",
                  )}
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Decissions Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {decision === "approve" && "Approve Application"}

                    {decision === "send_back" && "Send Application Back"}

                    {decision === "reject" && "Reject Application"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {decision === "approve"
                      ? "Confirm that you want to approve this internship application."
                      : decision === "send_back"
                        ? "Provide details about what the student needs to update."
                        : "Provide a reason for rejecting this application."}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={closeDecisionModal}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle size={21} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Student
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {studentName}
                </p>

                <p className="mt-0.5 text-sm text-slate-500">
                  {organisationName}
                </p>
              </div>

              {decision === "approve" && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Approve this application?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        The application will be marked as approved by the SPOC.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {decision !== "approve" && (
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
                      decision === "send_back"
                        ? "Explain what information or documents need to be updated..."
                        : "Explain why this application is being rejected..."
                    }
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              )}

              {actionError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={closeDecisionModal}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  actionLoading ||
                  ((decision === "reject" || decision === "send_back") &&
                    !remarks.trim())
                }
                onClick={submitDecision}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  decision === "approve"
                    ? "bg-emerald-700 hover:bg-emerald-800"
                    : decision === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {actionLoading && (
                  <Loader2 size={17} className="animate-spin" />
                )}

                {actionLoading
                  ? "Processing..."
                  : decision === "approve"
                    ? "Confirm Approval"
                    : decision === "send_back"
                      ? "Send Back Application"
                      : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary Card
const SummaryCard = ({ icon, title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// Details Card
const DetailsCard = ({ icon, title, description, children }) => {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900">{title}</h2>

            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">{children}</div>
    </Card>
  );
};

// Detail Items
const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {icon}
        <span>{label}</span>
      </div>

      <p className="wrap-break-word text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
};

//Info Box
const InfoBox = ({ icon, label, value, highlighted = false }) => {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 ${
          highlighted ? "text-emerald-700" : "text-slate-400"
        }`}
      >
        {icon}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        className={`wrap-break-word text-sm font-semibold ${
          highlighted ? "text-emerald-900" : "text-slate-800"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
};

// Period Rows
const PeriodRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
};

// Timeline Items
const TimelineItem = ({ title, date, active, last }) => {
  return (
    <div className="relative flex gap-3">
      {!last && (
        <div className="absolute left-1.75 top-4 h-full w-px bg-slate-200" />
      )}

      <div
        className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
          active
            ? "border-emerald-600 bg-emerald-600"
            : "border-slate-300 bg-white"
        }`}
      />

      <div className="min-w-0 pb-1">
        <p
          className={`text-sm font-semibold ${
            active ? "text-slate-800" : "text-slate-400"
          }`}
        >
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {date ? new Date(date).toLocaleString("en-IN") : "Not completed"}
        </p>
      </div>
    </div>
  );
};

export default SPOCApplicationDetails;
