import { useMemo, useState } from "react";
import { FileCheck2, Files, LockKeyhole, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import DocumentSection from "./DocumentSection";
import DocumentList from "./DocumentList";
import DocumentPreview from "./DocumentPreview";
import NocCard from "./NocCard";
import VerificationSummary from "./VerificationSummary";

import {
  uploadedDocuments,
  verificationSteps,
  nocDocument,
} from "./documents.data";

const StudentDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const verificationComplete = useMemo(
    () => verificationSteps.every((step) => step.status === "completed"),
    [],
  );

  const verifiedDocuments = uploadedDocuments.filter(
    (document) => document.status === "verified",
  );

  return (
    <>
      <title>My Documents | JGEC Internship Portal</title>

      <meta
        name="description"
        content="View your submitted internship documents, verification status, and generated NOC through the JGEC Internship Portal."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#ffffff" />

      <meta
        property="og:title"
        content="My Documents | JGEC Internship Portal"
      />

      <meta
        property="og:description"
        content="View submitted internship documents and track their verification status through the JGEC Internship Portal."
      />

      <meta property="og:type" content="website" />
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
                View your submitted documents and track the verification status.
                Uploaded documents cannot be modified from this page.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <LockKeyhole size={14} />
              Documents are read-only
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
                    Verified documents
                  </p>

                  <p className="text-xl font-semibold text-foreground">
                    {verifiedDocuments.length}
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
                  <p className="text-xs text-muted-foreground">Verification</p>

                  <p className="text-xl font-semibold text-foreground">
                    {verificationComplete ? "Completed" : "In progress"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Documents + verification */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <DocumentSection
                title="Uploaded documents"
                description="These are the documents submitted during your internship application."
                readOnly
              >
                <DocumentList
                  documents={uploadedDocuments}
                  onPreview={setSelectedDocument}
                />
              </DocumentSection>

              <DocumentSection
                title="No Objection Certificate"
                description="Your generated NOC becomes available after all required verifications are completed."
              >
                <NocCard
                  noc={nocDocument}
                  verificationComplete={verificationComplete}
                />
              </DocumentSection>
            </div>

            {/* Verification sidebar */}
            <aside>
              <div className="xl:sticky xl:top-6">
                <VerificationSummary steps={verificationSteps} />
              </div>
            </aside>
          </div>
        </div>

        <DocumentPreview
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      </main>
    </>
  );
};

export default StudentDocuments;
