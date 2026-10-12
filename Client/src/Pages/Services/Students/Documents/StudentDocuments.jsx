import { useState, useCallback } from "react";
import { FileCheck2, Files, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Toast } from "../../../../Components/index";
import DocumentSection from "./DocumentSection";
import DocumentList from "./DocumentList";
import DocumentPreview from "./DocumentPreview";
import NocCard from "./NocCard";
import VerificationSummary from "./VerificationSummary";
import UploadDocumentActions from "./UploadDocumentActions";
import {
  useStudentDocuments,
  useUpdateStudentSignature,
  useUpdateStudentResume,
} from "../../../../Services/Queries/studentDocuments.queries";

const getServerMessage = (source, fallback) =>
  source?.response?.data?.message ||
  source?.data?.message ||
  source?.message ||
  fallback;

const StudentDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [toast, setToast] = useState(null);
  const { data, isLoading, isError, error } = useStudentDocuments();
  const updateSignature = useUpdateStudentSignature();
  const updateResume = useUpdateStudentResume();
  const documentsData = data?.data ?? data ?? {};
  const uploadedDocuments = documentsData?.documents ?? [];
  const acceptedApplication = documentsData?.acceptedApplication ?? null;
  const nocDocument = documentsData?.noc ?? null;

  const showToast = useCallback((variant, title, message) => {
    setToast({ id: Date.now(), variant, title, message });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  // NOC is available only after SPOC accepts the application
  const applicationAccepted =
    acceptedApplication?.status === "approved_by_spoc" ||
    acceptedApplication?.status === "accepted";

  const signatureUploaded = uploadedDocuments.some(
    (document) =>
      document?.type === "signature" ||
      document?.documentType === "signature" ||
      document?.name?.toLowerCase().includes("signature") ||
      document?.fileName?.toLowerCase().includes("signature"),
  );

  const resumeUploaded = uploadedDocuments.some(
    (document) =>
      document?.type === "resume" ||
      document?.documentType === "resume" ||
      document?.name?.toLowerCase().includes("resume") ||
      document?.fileName?.toLowerCase().includes("resume"),
  );

  const handleDocumentUpload = async ({ event, label, mutation }) => {
    const file = event.target.files?.[0];
    // Allows selecting the same file again
    event.target.value = "";
    if (!file) return;

    try {
      const result = await mutation.mutateAsync(file);
      showToast(
        "success",
        `${label} saved`,
        getServerMessage(result, `${label} saved successfully.`),
      );
    } catch (err) {
      console.error(`${label} upload failed:`, err);
      showToast(
        "error",
        `${label} upload failed`,
        getServerMessage(err, "Something went wrong. Please try again."),
      );
    }
  };

  const handleSignatureChange = (event) =>
    handleDocumentUpload({
      event,
      label: "Signature",
      mutation: updateSignature,
    });

  const handleResumeChange = (event) =>
    handleDocumentUpload({
      event,
      label: "Resume",
      mutation: updateResume,
    });

  if (isLoading) {
    return (
      <>
        <title>My Documents | JGEC Internship Portal</title>

        <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-75 max-w-7xl items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading your documents...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>My Documents | JGEC Internship Portal</title>

        <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Card className="border-destructive/20 p-6">
              <h2 className="font-semibold text-foreground">
                Unable to load documents
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {getServerMessage(
                  error,
                  "Something went wrong while loading your documents.",
                )}
              </p>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Page MetaData */}
      <title>My Documents | JGEC Internship Portal</title>
      <meta
        name="description"
        content="View your submitted internship documents and generated NOC through the JGEC Internship Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        property="og:title"
        content="My Documents | JGEC Internship Portal"
      />
      <meta
        property="og:description"
        content="View submitted internship documents and generated NOC through the JGEC Internship Portal."
      />
      <meta property="og:type" content="website" />

      {/* Main Page Components */}
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Files size={17} />

                <span>Student Documents</span>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                My documents
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                View your submitted documents and your generated No Objection
                Certificate.
              </p>
            </div>
          </motion.div>

          {/* Quick stats */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Files size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded documents
                  </p>

                  <p className="text-xl font-semibold text-foreground">
                    {uploadedDocuments.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <FileCheck2 size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Application status
                  </p>

                  <p className="text-xl font-semibold text-foreground">
                    {applicationAccepted ? "Accepted" : "Pending"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">NOC status</p>

                  <p className="text-xl font-semibold text-foreground">
                    {nocDocument ? "Generated" : "Not available"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Documents + NOC */}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <DocumentSection
                title="Uploaded documents"
                description="These are the documents submitted during your internship application."
                actions={
                  <UploadDocumentActions
                    signatureUploaded={signatureUploaded}
                    resumeUploaded={resumeUploaded}
                    onSignatureChange={handleSignatureChange}
                    onResumeChange={handleResumeChange}
                    signatureLoading={updateSignature.isPending}
                    resumeLoading={updateResume.isPending}
                  />
                }
              >
                <DocumentList
                  documents={uploadedDocuments}
                  onPreview={setSelectedDocument}
                />
              </DocumentSection>

              <DocumentSection
                title="No Objection Certificate"
                description="Your NOC is generated automatically when the SPOC accepts your internship application."
              >
                <NocCard
                  noc={nocDocument}
                  applicationAccepted={applicationAccepted}
                />
              </DocumentSection>
            </div>

            <aside>
              <div className="xl:sticky xl:top-6">
                <VerificationSummary
                  applicationAccepted={applicationAccepted}
                  nocGenerated={Boolean(nocDocument)}
                />
              </div>
            </aside>
          </div>
        </div>

        <DocumentPreview
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />

        {toast && (
          <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-end">
            <Toast
              key={toast.id}
              variant={toast.variant}
              title={toast.title}
              message={toast.message}
              onClose={closeToast}
            />
          </div>
        )}
      </main>
    </>
  );
};

export default StudentDocuments;
