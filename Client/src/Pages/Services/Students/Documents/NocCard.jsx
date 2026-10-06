import {
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../Components";

const NocCard = ({ noc, applicationAccepted }) => {
  /*
   * Application has not yet been accepted
   * by the SPOC.
   */
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

  /*
   * SPOC accepted the application but
   * NOC is not available yet.
   */
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

  /*
   * Preview NOC
   *
   * Fetch the PDF as a Blob and create a temporary
   * browser URL. This prevents Cloudinary's download
   * disposition from forcing a download.
   */
  const handlePreview = async () => {
    try {
      const response = await fetch(noc.url);
      if (!response.ok) {
        throw new Error("Unable to load NOC preview.");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(
        new Blob([blob], {
          type: "application/pdf",
        }),
      );
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      // Give the browser time to load the Blob URL
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (error) {
      console.error("NOC preview failed:", error);
      window.open(noc.url, "_blank", "noopener,noreferrer");
    }
  };

  /*
   * Download NOC
   */
  const handleDownload = async () => {
    try {
      const response = await fetch(noc.url);
      if (!response.ok) {
        throw new Error("Unable to download NOC.");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = noc.fileName || "NOC.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("NOC download failed:", error);
      window.open(noc.url, "_blank", "noopener,noreferrer");
    }
  };

  /*
   * SPOC accepted + NOC generated.
   */
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
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
                {noc.nocId}
              </p>

              <p>
                <span className="font-medium text-foreground">Generated:</span>{" "}
                {noc.generatedAt
                  ? new Date(noc.generatedAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p>
                <span className="font-medium text-foreground">File:</span>{" "}
                {noc.fileName}
              </p>

              <p>
                <span className="font-medium text-foreground">Version:</span>{" "}
                {noc.version ?? 1}
              </p>
            </div>
          </div>
        </div>

        {/* NOC Actions */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {/* Preview */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="inline-flex w-auto min-w-30 items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
            onClick={handlePreview}
          >
            <Eye size={16} className="shrink-0" />
            <span>Preview</span>
          </Button>

          {/* Download */}
          <Button
            type="button"
            size="sm"
            className="inline-flex w-auto min-w-35 items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
            onClick={handleDownload}
          >
            <Download size={16} className="shrink-0" />
            <span>Download NOC</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NocCard;
