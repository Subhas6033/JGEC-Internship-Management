import { useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useSpocApplication,
  useAcceptSpocApplication,
  useSendBackSpocApplication,
} from "../../../../Services/Queries/spocApplication.quires";
import { downloadSpocNocPdf } from "../../../../Services/Application/spocApplication.api";
import ApplicationHeader from "./ApplicationHeader";
import ApplicationSummary from "./ApplicationSummary";
import StudentDetails from "./StudentDetails";
import OrganisationDetails from "./OrganisationDetails";
import InternshipDetails from "./InternshipDetails";
import ApplicationDescription from "./ApplicationDescription";
import ReviewDetails from "./ReviewDetails";
import ApplicationStatus from "./ApplicationStatus";
import ApplicationTimeline from "./ApplicationTimeline";
import ApplicationActions from "./ApplicationActions";
import DecisionModal from "./DecisionModal";

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

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "—";
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
  if (difference < 0) return "Invalid period";

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

export default function SPOCApplicationDetails() {
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
  const student = application?.student || {};
  const organisation = application?.organisation || {};
  const studentName =
    student.fullName || student.name || application?.studentName || "Student";
  const studentEmail =
    student.email || student.collegeEmail || application?.studentEmail;
  const studentPhone =
    student.mobileNumber ||
    student.mobile ||
    student.phoneNumber ||
    application?.studentPhone;
  const rollNumber =
    student.rollNumber ||
    student.roll ||
    application?.rollNumber ||
    application?.roll;
  const department =
    student.department?.name ||
    student.department ||
    application?.department?.name ||
    application?.department;
  const semester = student.semester || application?.semester;
  const organisationName =
    organisation.organisationName ||
    organisation.name ||
    application?.organisationName ||
    "Organisation";
  const organisationLocation =
    organisation.organisationLocation ||
    organisation.location ||
    organisation.city ||
    application?.organisationLocation;
  const startDate = application?.tentativeStartDate;
  const endDate = application?.tentativeEndDate;
  const status = application?.status;
  const statusLabel = getStatusLabel(status);
  const canReview =
    status === "approved_by_tpo" || status === "under_spoc_review";
  const hasGeneratedNoc =
    status === "noc_generated" && Boolean(application?.noc);

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
      } else if (decision === "send_back") {
        await sendBackMutation.mutateAsync({
          applicationId,
          reason: trimmedRemarks,
        });
      } else if (decision === "reject") {
        setActionError(
          "Reject mutation is not available in the current SPOC React Query API.",
        );
        return;
      }

      setShowDecisionModal(false);
      setDecision("");
      setRemarks("");

      await refetch();
    } catch (err) {
      console.error("SPOC decision failed:", err);
      setActionError(
        err?.message || "Something went wrong while processing the decision.",
      );
    }
  };

  const handleOpenNoc = async () => {
    if (!applicationId || !application?.noc) return;

    let nocWindow = null;
    let objectUrl = null;

    try {
      setIsOpeningNoc(true);
      setActionError("");

      // Open immediately to avoid the browser blocking the new tab.
      nocWindow = window.open("about:blank", "_blank");
      const response = await downloadSpocNocPdf(applicationId);

      if (!response) {
        throw new Error("NOC PDF was not returned by the server.");
      }

      const blob =
        response instanceof Blob
          ? response
          : response?.data instanceof Blob
            ? response.data
            : new Blob([response], { type: "application/pdf" });

      objectUrl = window.URL.createObjectURL(blob);

      if (nocWindow && !nocWindow.closed) {
        nocWindow.location.href = objectUrl;
      } else {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
      }

      window.setTimeout(() => {
        if (objectUrl) window.URL.revokeObjectURL(objectUrl);
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

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-emerald-700" />
            <p className="text-sm font-medium text-slate-600">
              Loading application details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ApplicationHeader
            application={null}
            applicationId={applicationId}
            navigate={navigate}
            statusLabel=""
            error=""
          />

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

  const internship = {
    designation: getValue(application.designation),
    duration: calculateDuration(startDate, endDate),
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    workLocation: Array.isArray(application.tentativeWorkLocations)
      ? application.tentativeWorkLocations.join(", ")
      : getValue(application.tentativeWorkLocations),
  };

  const review = {
    tpoName:
      application.tpo?.fullName || application.tpo?.name || application.tpoName,
    spocName:
      application.spoc?.fullName ||
      application.spoc?.name ||
      application.spocName,
    updatedAt: formatDateTime(application.updatedAt),
    remarks: application.reviewRemarks || application.remarks,
  };

  return (
    <>
      {/* Page Meta Data */}
      <title>
        Application Details | SPOC Portal | JGEC Internship Management
      </title>
      <meta
        name="description"
        content="Review student internship applications, verify organisation and internship details, track application status, and manage SPOC decisions in the JGEC Internship Management Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#f8f5eb" />
      <meta property="og:title" content="Application Details | SPOC Portal" />
      <meta
        property="og:description"
        content="View and review student internship application details in the JGEC Internship Management Portal."
      />
      <meta property="og:type" content="website" />

      {/* Main Page  */}
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5eb] px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <ApplicationHeader
            application={application}
            applicationId={applicationId}
            navigate={navigate}
            statusLabel={statusLabel}
            error={error}
            onClearError={() => setActionError("")}
          />
          <ApplicationSummary
            studentName={studentName}
            organisationName={organisationName}
            statusLabel={statusLabel}
          />

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              <StudentDetails
                student={{
                  name: studentName,
                  rollNumber: getValue(rollNumber),
                  department: getValue(department),
                  semester: getValue(semester),
                  email: getValue(studentEmail),
                  phone: getValue(studentPhone),
                }}
              />
              <OrganisationDetails
                organisation={{
                  name: organisationName,
                  location: getValue(organisationLocation),
                  email: getValue(
                    organisation.email || application.organisationEmail,
                  ),
                  phone: getValue(
                    organisation.phone || application.organisationPhone,
                  ),
                }}
              />
              <InternshipDetails internship={internship} />
              <ApplicationDescription
                description={
                  application.description ||
                  application.internshipDescription ||
                  application.purpose
                }
              />
              <ReviewDetails review={review} />
              <ApplicationStatus
                status={status}
                statusLabel={statusLabel}
                createdAt={formatDateTime(application.createdAt)}
                updatedAt={formatDateTime(application.updatedAt)}
              />
              <ApplicationTimeline application={application} />
            </div>

            <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
              <ApplicationActions
                canReview={canReview}
                hasGeneratedNoc={hasGeneratedNoc}
                actionLoading={actionLoading}
                onApprove={() => openDecisionModal("approve")}
                onSendBack={() => openDecisionModal("send_back")}
                onReject={() => openDecisionModal("reject")}
                onOpenNoc={handleOpenNoc}
              />
            </aside>
          </div>

          <DecisionModal
            open={showDecisionModal}
            decision={decision}
            remarks={remarks}
            setRemarks={setRemarks}
            actionError={actionError}
            actionLoading={actionLoading}
            onClose={closeDecisionModal}
            onSubmit={submitDecision}
          />
        </div>
      </div>
    </>
  );
}
