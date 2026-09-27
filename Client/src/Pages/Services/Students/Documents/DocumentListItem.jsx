import {
  Download,
  FileText,
  Image,
  LockKeyhole,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../../../Components";
import DocumentStatusBadge from "./DocumentStatusBadge";

const DocumentListItem = ({ document, onPreview }) => {
  const isImage = document.fileType === "PNG";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {isImage ? (
            <Image size={20} />
          ) : (
            <FileText size={20} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-medium text-foreground">
              {document.name}
            </h3>

            <DocumentStatusBadge status={document.status} />
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {document.fileName}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{document.fileType}</span>
            <span>•</span>
            <span>{document.size}</span>
            <span>•</span>
            <span>Uploaded {document.uploadedAt}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPreview(document)}
        >
          <Eye size={16} />
          <span>View</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.open(document.url, "_blank")}
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download</span>
        </Button>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          title="This document cannot be updated"
        >
          <LockKeyhole size={15} />
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentListItem;