import { useEffect, useRef, useState } from "react";
import { ImageUp, Upload, X } from "lucide-react";
import { Button, Modal } from "../../../../Components";
import SectionFooter from "./SectionFooter";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_KB = 100; // matches the backend multer limit

const SignatureUploader = ({
  signature,
  onUpload,
  onInvalidFile,
  isUploading = false,
}) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // Build and clean up the local preview for the selected file.
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clearSelection = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const acceptFile = (selected) => {
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onInvalidFile?.("Upload a PNG, JPG or WebP image.");
      clearSelection();
      return;
    }

    if (selected.size > MAX_SIZE_KB * 1024) {
      onInvalidFile?.(`The image must be ${MAX_SIZE_KB} KB or smaller.`);
      clearSelection();
      return;
    }

    setFile(selected);
  };

  const openPicker = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!isUploading) acceptFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const succeeded = await onUpload(file);
    if (succeeded) clearSelection();
  };

  const shownImage = previewUrl || signature;

  return (
    <>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        {/* Preview */}
        <div>
          <p className="text-sm font-medium text-ink">
            {file ? "New signature" : "Current signature"}
          </p>

          <div className="mt-1.5 flex h-44 items-center justify-center rounded-lg border border-border bg-white p-4">
            {shownImage ? (
              <button
                type="button"
                onClick={() => setViewOpen(true)}
                aria-label="View signature larger"
                className="cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
              >
                <img
                  src={shownImage}
                  alt="Your signature"
                  className="max-h-36 max-w-full object-contain"
                />
              </button>
            ) : (
              <p className="text-sm text-ink-muted">No signature uploaded</p>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div>
          <p className="text-sm font-medium text-ink">Upload a new image</p>

          <div
            role="button"
            tabIndex={0}
            aria-disabled={isUploading}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`focus-ring mt-1.5 flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 text-center transition-colors ${
              dragging
                ? "border-brand-700 bg-brand-700/5"
                : "border-border bg-cream hover:bg-cream-dark/50"
            } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
              <ImageUp size={18} />
            </span>

            <p className="text-sm text-ink">
              Drag an image here, or{" "}
              <span className="font-medium text-brand-700">browse</span>
            </p>

            <p className="text-xs text-ink-muted">
              PNG, JPG or WebP, up to {MAX_SIZE_KB} KB
            </p>
          </div>

          <input
            ref={inputRef}
            id="tpo-signature-file"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(event) => acceptFile(event.target.files?.[0])}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      </div>

      <SectionFooter
        message={
          file
            ? `${file.name} is ready to save.`
            : "Use a clear signature on a plain background."
        }
      >
        {file && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearSelection}
              disabled={isUploading}
            >
              <X size={15} />
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
            >
              <Upload size={15} />
              {isUploading ? "Uploading..." : "Save signature"}
            </Button>
          </>
        )}
      </SectionFooter>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Your signature"
        size="lg"
      >
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-white p-6">
          <img
            src={shownImage}
            alt="Your signature"
            className="max-h-[60vh] max-w-full object-contain"
          />
        </div>
      </Modal>
    </>
  );
};

export default SignatureUploader;
