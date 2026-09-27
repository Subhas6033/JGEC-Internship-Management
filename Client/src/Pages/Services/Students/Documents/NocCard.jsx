import { CheckCircle2, Download, FileCheck2, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../../../Components";

const NocCard = ({ noc, verificationComplete }) => {
  if (!verificationComplete) {
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
              The NOC will become available after all required verifications are
              completed.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              Your NOC has been generated after completion of the required
              verification process.
            </p>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">NOC ID:</span>{" "}
                {noc.id}
              </p>

              <p>
                <span className="font-medium text-foreground">Generated:</span>{" "}
                {noc.generatedAt}
              </p>

              <p>
                <span className="font-medium text-foreground">File:</span>{" "}
                {noc.fileName}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          className="inline-flex w-auto min-w-35 items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
          onClick={() => window.open(noc.url, "_blank")}
        >
          <Download size={16} className="shrink-0" />
          <span>Download NOC</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default NocCard;
