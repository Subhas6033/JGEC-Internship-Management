import {
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../Components";
import { apiClient } from "../../../../Services/api/apiClient";

const STUDENT_NOC_PDF_ENDPOINT = "/student/documents/noc/pdf";

const NocCard = ({ noc, applicationAccepted }) => {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Application is not accepted.
  if (!applicationAccepted) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <LockKeyhole size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              No Objection Certificate
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your NOC will be generated after the SPOC accepts your internship
              application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Application accepted, but NOC is not generated.
  if (!noc) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileCheck2 size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              No Objection Certificate
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your application has been accepted by the SPOC. Your NOC is being
              generated.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Always use the authenticated student's endpoint.
  // Do not use noc.downloadUrl because it may contain the SPOC URL.
  const fetchNocPdf = async () => {
    const response = await apiClient.get(STUDENT_NOC_PDF_ENDPOINT, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    const blob = response;

    if (!(blob instanceof Blob)) {
      throw new Error("Invalid NOC PDF response.");
    }

    if (!blob.size) {
      throw new Error("Generated PDF is empty.");
    }

    const contentType = blob.type?.toLowerCase();

    if (
      contentType &&
      !contentType.includes("application/pdf") &&
      !contentType.includes("application/octet-stream")
    ) {
      throw new Error(`Expected PDF but received: ${contentType}`);
    }

    return blob;
  };

  // Preview NOC.
  const handlePreview = async () => {
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      alert("Please allow popups to preview your NOC.");
      return;
    }

    previewWindow.document.title = "Loading NOC...";
    previewWindow.document.body.textContent = "Loading your NOC...";

    setPreviewLoading(true);

    try {
      const blob = await fetchNocPdf();
      const blobUrl = URL.createObjectURL(blob);

      previewWindow.location.replace(blobUrl);

      // Keep URL alive while the PDF viewer loads.
      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 120000);
    } catch (error) {
      console.error("NOC preview failed:", error);

      previewWindow.close();

      alert(error?.message || "Unable to preview NOC.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Download NOC.
  const handleDownload = async () => {
    let blobUrl;

    setDownloadLoading(true);

    try {
      const blob = await fetchNocPdf();

      blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download =
        noc?.fileName ||
        `NOC-${noc?.referenceNumber || noc?.nocId || "certificate"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Allow browser to start downloading.
      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (error) {
      console.error("NOC download failed:", error);

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      alert(error?.message || "Unable to download NOC.");
    } finally {
      setDownloadLoading(false);
    }
  };

  // NOC generated successfully.
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-success/20 bg-success/5 p-5"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
            <FileCheck2 size={21} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-foreground">
                No Objection Certificate
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                <CheckCircle2 size={13} />
                Generated
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Your NOC has been generated after the SPOC accepted your
              internship application.
            </p>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">NOC ID:</span>{" "}
                {noc?.nocId || "N/A"}
              </p>

              <p>
                <span className="font-medium text-foreground">Generated:</span>{" "}
                {noc?.generatedAt
                  ? new Date(noc.generatedAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p>
                <span className="font-medium text-foreground">File:</span>{" "}
                {noc?.fileName || "NOC.pdf"}
              </p>

              <p>
                <span className="font-medium text-foreground">Version:</span>{" "}
                {noc?.version ?? 1}
              </p>
            </div>
          </div>
        </div>

        {/* NOC Actions */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={previewLoading || downloadLoading}
            className="inline-flex w-auto min-w-30 items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
            onClick={handlePreview}
          >
            <Eye size={16} className="shrink-0" />
            <span>{previewLoading ? "Loading..." : "Preview"}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={downloadLoading || previewLoading}
            className="inline-flex w-auto min-w-35 items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
            onClick={handleDownload}
          >
            <Download size={16} className="shrink-0" />
            <span>{downloadLoading ? "Downloading..." : "Download NOC"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NocCard;
