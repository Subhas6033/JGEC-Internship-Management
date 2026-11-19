import { useEffect, useMemo, useRef, useState } from "react";
import { FileSignature, Upload } from "lucide-react";
import { Button, Card } from "../../../../Components";
import { useUpdateSpocSignature } from "../../../../Services/Queries/spocProfile.quires";
import { SectionHeader } from "../Profile/SectionHeader";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const SignatureSettings = ({ spoc, onNotify }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const updateSignature = useUpdateSpocSignature();

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  // Release the temporary browser URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelect = (event) => {
    const selected = event.target.files?.[0];
    event.target.value = "";

    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      onNotify(
        "error",
        "Unsupported file",
        "Please choose a PNG, JPG or WEBP image.",
      );
      return;
    }

    if (selected.size > MAX_SIZE) {
      onNotify("error", "File too large", "Signature must not exceed 2 MB.");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await updateSignature.mutateAsync(file);
      setFile(null);
      onNotify("success", "Signature updated", "Your signature was saved.");
    } catch (error) {
      onNotify(
        "error",
        "Signature upload failed",
        error?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const displayedSignature = previewUrl || spoc?.signature;

  return (
    <Card className="w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          icon={FileSignature}
          title="Signature"
          description="Use a clear image on a plain, light background"
        />

        <div className="mt-5 flex min-h-36 items-center justify-center rounded-lg border border-border bg-cream-soft p-4">
          {displayedSignature ? (
            <img
              src={displayedSignature}
              alt="SPOC signature"
              className="max-h-32 max-w-full object-contain"
            />
          ) : (
            <p className="text-sm text-ink-muted">No signature uploaded</p>
          )}
        </div>

        {file && (
          <p className="mt-2 truncate text-xs text-ink-muted">
            Selected: <span className="font-medium text-ink">{file.name}</span>
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleSelect}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={updateSignature.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={16} strokeWidth={1.9} />
            {spoc?.signature ? "Choose new" : "Choose file"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!file || updateSignature.isPending}
            onClick={handleUpload}
            className="bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-700"
          >
            {updateSignature.isPending ? "Uploading..." : "Save signature"}
          </Button>
        </div>

        <p className="mt-3 text-xs leading-5 text-ink-muted">
          PNG, JPG or WEBP, up to 2 MB. The background is removed automatically.
        </p>
      </Card.Content>
    </Card>
  );
};

export default SignatureSettings;
