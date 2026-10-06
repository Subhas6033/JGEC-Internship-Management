import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Modal } from "../../../../Components";
import {
  useTpoApplication,
  useAcceptTpoApplication,
  useSendBackTpoApplication,
} from "../../../../Services/Queries/tpoApplication.quires";

const CompanyApplicationDetails = () => {
  const { applicationId } = useParams();
  const [isSendBackModalOpen, setIsSendBackModalOpen] = useState(false);
  const [sendBackReason, setSendBackReason] = useState("");
  const [signatureOpen, setSignatureOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } =
    useTpoApplication(applicationId);
  const { mutateAsync: acceptApplication, isPending: isAccepting } =
    useAcceptTpoApplication();
  const { mutateAsync: sendBackApplication, isPending: isSendingBack } =
    useSendBackTpoApplication();
  const application = data?._data ?? data?.__data ?? data;

  if (isLoading) {
    return <ApplicationDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-cream-soft p-10 text-center">
        <h2 className="text-base font-semibold text-ink">
          Unable to load application
        </h2>

        <p className="mt-1 text-sm text-ink-muted">
          {error?.message ||
            "Something went wrong while loading the application."}
        </p>

        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
          >
            Retry
          </Button>

          <Link
            to="/depttpo/applications"
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-cream-dark"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-cream-soft p-10 text-center">
        <h2 className="text-base font-semibold text-ink">
          Application not found
        </h2>

        <p className="mt-1 text-sm text-ink-muted">
          The requested application does not exist or is no longer available.
        </p>

        <Link
          to="/depttpo/applications"
          className="mt-4 inline-flex text-sm font-medium text-brand-700"
        >
          Back to Applications
        </Link>
      </div>
    );
  }

  const student = application?.student ?? {};
  const organisation = application?.organisation ?? {};
  const studentName = student?.fullName ?? "Unknown Student";
  const rollNumber = student?.rollNumber ?? "N/A";
  const email = student?.email ?? "N/A";
  const department = student?.department ?? "N/A";
  const organisationName =
    organisation?.organisationName ??
    organisation?.name ??
    "Unknown Organisation";
  const organisationLocation =
    organisation?.organisationLocation ??
    organisation?.location ??
    "Not specified";
  const organisationMail = organisation?.organisationMail ?? "Not specified";
  const designation = application?.designation ?? "Internship";
  const status = application?.status ?? "submitted";
  const statusLabel = status.replaceAll("_", " ");
  const statusConfig = getStatusConfig(status);
  const canTakeTpoAction =
    status === "submitted" || status === "under_tpo_review";

  const handleOpenSendBackModal = () => {
    setSendBackReason("");
    setIsSendBackModalOpen(true);
  };

  const handleCloseSendBackModal = () => {
    setIsSendBackModalOpen(false);
    setSendBackReason("");
  };

  const handleAcceptApplication = async () => {
    try {
      await acceptApplication(applicationId);
      await refetch();
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleSendBack = async () => {
    const reason = sendBackReason.trim();
    if (!reason) {
      return;
    }
    try {
      await sendBackApplication({
        applicationId,
        reason,
      });
      handleCloseSendBackModal();
      await refetch();
    } catch (error) {
      console.error("Failed to send application back:", error);
    }
  };

  return (
    <>
      <div className="space-y-5">
        <Link
          to="/depttpo/applications"
          className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={15} />
          Applications
        </Link>

        <Card className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Student Application</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                {studentName}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{designation}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-muted">
                <span>{rollNumber}</span>
                <span>{department}</span>
                <span className="break-all">{email}</span>
              </div>
            </div>

            <StatusBadge
              status={status}
              label={statusLabel}
              config={statusConfig}
            />
          </div>

          {canTakeTpoAction && (
            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleOpenSendBackModal}
                disabled={isSendingBack || isAccepting}
              >
                <XCircle size={15} />
                Send Back to Student
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAcceptApplication}
                disabled={isAccepting || isSendingBack}
              >
                <CheckCircle2 size={15} />
                Accept Application
              </Button>
            </div>
          )}
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat icon={User} label="Student" value={studentName} />
          <MiniStat
            icon={Building2}
            label="Organisation"
            value={organisationName}
          />
          <MiniStat
            icon={FileText}
            label="Internship Type"
            value={formatValue(application?.internshipType)}
          />
          <MiniStat
            icon={Clock3}
            label="Mode"
            value={formatValue(application?.modeOfInternship)}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <SectionHeader icon={User} title="Student Information" />

            <div className="mt-5 space-y-4">
              <InfoRow label="Full Name" value={studentName} />
              <InfoRow label="Roll Number" value={rollNumber} />
              <InfoRow label="Department" value={department} />
              <InfoRow label="Email" value={email} />

              <div>
                <p className="text-xs text-ink-muted">Student Signature</p>

                <div className="mt-2 flex min-h-36 items-center justify-center rounded-lg border border-border bg-cream-soft p-4">
                  {student?.signature ? (
                    <button
                      type="button"
                      onClick={() => setSignatureOpen(true)}
                      className="cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
                      aria-label="View student signature"
                    >
                      <img
                        src={student.signature}
                        alt={`${studentName} signature`}
                        className="max-h-32 max-w-full object-contain transition-transform hover:scale-[1.02]"
                      />
                    </button>
                  ) : (
                    <p className="text-sm text-ink-muted">
                      No signature uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Modal
              open={signatureOpen}
              onClose={() => setSignatureOpen(false)}
              title="Student Signature"
              size="lg"
            >
              <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-cream-soft p-6">
                {student?.signature ? (
                  <img
                    src={student.signature}
                    alt={`${studentName} signature`}
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-ink-muted">
                    No signature uploaded
                  </p>
                )}
              </div>
            </Modal>
          </Card>

          <Card className="p-5">
            <SectionHeader icon={Building2} title="Organisation Information" />

            <div className="mt-5 space-y-4">
              <InfoRow label="Organisation" value={organisationName} />
              <InfoRow label="Location" value={organisationLocation} />
              <InfoRow label="Organisation Email" value={organisationMail} />
              <InfoRow label="Designation" value={designation} />
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <SectionHeader icon={CalendarDays} title="Internship Details" />

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow label="Semester" value={application?.semester} />
            <InfoRow
              label="Internship Type"
              value={formatValue(application?.internshipType)}
            />
            <InfoRow
              label="Mode"
              value={formatValue(application?.modeOfInternship)}
            />
            <InfoRow label="Designation" value={designation} />
            <InfoRow
              label="Start Date"
              value={formatDate(application?.tentativeStartDate)}
            />
            <InfoRow
              label="End Date"
              value={formatDate(application?.tentativeEndDate)}
            />
            <InfoRow
              label="Work Location"
              value={
                Array.isArray(application?.tentativeWorkLocations)
                  ? application.tentativeWorkLocations.join(", ")
                  : "Not specified"
              }
            />
            <InfoRow
              label="Employee Contact"
              value={application?.organisationsEmployye}
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={FileText} title="Application Description" />

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink-muted">
            {application?.description?.trim() ||
              "No additional description was provided."}
          </p>
        </Card>

        {status === "update_required" && (
          <Card className="border-border bg-cream-soft p-5">
            <div className="flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0 text-ink-muted" />

              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Update Required
                </h2>

                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  {application?.updateRequiredReason?.trim() ||
                    "The application requires an update before it can proceed."}
                </p>

                {application?.updateRequiredBy && (
                  <p className="mt-2 text-xs capitalize text-ink-muted">
                    Requested by: {application.updateRequiredBy}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal
        open={isSendBackModalOpen}
        onClose={handleCloseSendBackModal}
        title="Send Application Back"
        description="Provide the exact reason why this application needs to be updated by the student."
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="send-back-reason"
              className="text-sm font-medium text-ink"
            >
              Reason / Comment
            </label>

            <textarea
              id="send-back-reason"
              value={sendBackReason}
              onChange={(event) => setSendBackReason(event.target.value)}
              placeholder="Enter the exact reason for sending this application back..."
              rows={6}
              className="focus-ring mt-2 w-full resize-y rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              autoFocus
            />

            <p className="mt-1.5 text-xs text-ink-muted">
              This message will be shown to the student as the reason for the
              required update.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCloseSendBackModal}
              disabled={isSendingBack}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!sendBackReason.trim() || isSendingBack || isAccepting}
              onClick={handleSendBack}
            >
              <XCircle size={15} />
              Send Back to Student
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const ApplicationDetailsSkeleton = () => (
  <div className="space-y-5">
    <div className="h-5 w-32 animate-pulse rounded bg-cream-dark" />

    <Card className="p-5">
      <div className="space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-cream-dark" />
        <div className="h-7 w-64 animate-pulse rounded bg-cream-dark" />
        <div className="h-4 w-40 animate-pulse rounded bg-cream-dark" />
        <div className="h-4 w-80 animate-pulse rounded bg-cream-dark" />
      </div>
    </Card>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="p-4">
          <div className="h-12 animate-pulse rounded bg-cream-dark" />
        </Card>
      ))}
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      {[1, 2].map((item) => (
        <Card key={item} className="p-5">
          <div className="space-y-5">
            <div className="h-5 w-40 animate-pulse rounded bg-cream-dark" />

            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-8 animate-pulse rounded bg-cream-dark"
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2">
    <span className="flex size-8 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
      <Icon size={16} />
    </span>

    <h2 className="text-base font-semibold text-ink">{title}</h2>
  </div>
);

const InfoRow = ({ label, value }) => {
  const isEmail = label?.toLowerCase().includes("email");

  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>

      <p
        className={`mt-1 text-sm font-medium text-ink ${
          isEmail ? "" : "capitalize"
        }`}
      >
        {isEmail ? value : formatValue(value)}
      </p>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
        <Icon size={17} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold capitalize text-ink">
          {formatValue(value)}
        </p>
      </div>
    </div>
  </Card>
);

const StatusBadge = ({ label, config }) => {
  const Icon = config?.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-medium ${config?.className}`}
    >
      {Icon && <Icon size={14} />}

      <span className="capitalize">{label}</span>
    </div>
  );
};

const getStatusConfig = (status) => {
  switch (status) {
    case "approved_by_tpo":
    case "approved_by_spoc":
      return {
        icon: CheckCircle2,
        className: "border-border bg-cream-dark text-ink",
      };

    case "rejected":
      return {
        icon: XCircle,
        className: "border-border bg-cream-dark text-ink",
      };

    case "update_required":
      return {
        icon: Clock3,
        className: "border-border bg-cream-dark text-ink",
      };

    case "submitted":
    case "under_tpo_review":
    case "under_spoc_review":
    default:
      return {
        icon: Clock3,
        className: "border-border bg-cream-dark text-ink",
      };
  }
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }
  return String(value).replaceAll("_", " ");
};

const formatDate = (value) => {
  if (!value) {
    return "Not specified";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }
  return date.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  });
};

export default CompanyApplicationDetails;
