import { Download, X } from "lucide-react";
import { Button } from "../../../../Components";

const DocumentPreview = ({ document, onClose }) => {
  if (!document) return null;

  const isImage = document.fileType?.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="font-medium text-foreground">{document.name}</h3>

            <p className="text-xs text-muted-foreground">{document.fileName}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex min-h-75 flex-1 items-center justify-center overflow-auto bg-muted/30 p-6">
          {isImage ? (
            <img
              src={document.url}
              alt={document.name}
              className="max-h-[65vh] max-w-full rounded-lg object-contain"
            />
          ) : (
            <iframe
              src={document.url}
              title={document.name}
              className="h-[65vh] w-full rounded-lg border border-border bg-background"
            />
          )}
        </div>

        <div className="flex justify-end border-t border-border px-4 py-3">
          <Button
            type="button"
            onClick={() =>
              window.open(document.url, "_blank", "noopener,noreferrer")
            }
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
