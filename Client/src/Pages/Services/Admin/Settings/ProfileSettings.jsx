import { useEffect, useRef, useState } from "react";
import { UserRound, Mail, Phone, PenLine, Upload } from "lucide-react";
import { Card, Input, Button } from "../../../../Components/index";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024; // 2 MB

const ProfileSettings = ({
  profile,
  onSave,
  onSignatureUpload,
  loading = false,
  saving = false,
  uploadingSignature = false,
}) => {
  const [formData, setFormData] = useState(profile);
  const [error, setError] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Release object URLs
  useEffect(() => {
    return () => {
      if (signaturePreview) URL.revokeObjectURL(signaturePreview);
    };
  }, [signaturePreview]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name?.trim() || "";
    const email = formData.email?.trim() || "";
    const phone = formData.phone?.trim() || "";

    if (name.length < 2 || name.length > 100) {
      setError("Full name must be between 2 and 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    onSave({ ...formData, name, email, phone });
  };

  const handleSignatureSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setSignatureError("Signature must be a PNG or JPG image.");
      return;
    }

    if (file.size > MAX_SIGNATURE_SIZE) {
      setSignatureError("Signature must be smaller than 2 MB.");
      return;
    }

    setSignatureError("");
    setSignatureFile(file);
    setSignaturePreview(URL.createObjectURL(file));
  };

  const handleSignatureSubmit = async () => {
    if (!signatureFile) return;
    await onSignatureUpload?.(signatureFile);
    setSignatureFile(null);
    setSignaturePreview("");
  };

  // Check Changes of Profile Fields
  const hasChanges =
    formData.name !== profile.name ||
    formData.email !== profile.email ||
    formData.phone !== profile.phone;

  const shownSignature = signaturePreview || formData.signature;

  return (
    <div className="space-y-5">
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-ink">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your administrator profile details.
          </p>
        </div>

        {/* Profile Avatar */}
        <div className="mb-7 flex flex-wrap items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
            <UserRound size={34} />
          </div>

          <div>
            <p className="font-semibold text-ink">{formData.name}</p>
            <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              Administrator
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              startIcon={<UserRound size={17} />}
              disabled={loading}
              required
            />
            {/* Email */}
            <Input
              label="Email Address"
              inputType="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              startIcon={<Mail size={17} />}
              disabled={loading}
              required
            />
            {/* Mobile Number */}
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              startIcon={<Phone size={17} />}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              {error}
            </p>
          )}

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" disabled={saving || loading || !hasChanges}>
              {saving ? "Saving..." : "Save Profile Changes"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Signature */}
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <PenLine size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">Signature</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Upload a PNG or JPG signature (max 2 MB). It is used on generated
              documents.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-cream-soft sm:w-64">
            {shownSignature ? (
              <img
                src={shownSignature}
                alt="Signature preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <p className="text-xs text-ink-muted">No signature uploaded</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleSignatureSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingSignature}
            >
              <Upload size={16} className="mr-2" />
              Choose File
            </Button>

            <Button
              type="button"
              onClick={handleSignatureSubmit}
              disabled={!signatureFile || uploadingSignature}
            >
              {uploadingSignature ? "Uploading..." : "Upload Signature"}
            </Button>
          </div>
        </div>

        {signatureError && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            {signatureError}
          </p>
        )}
      </Card>
    </div>
  );
};

export default ProfileSettings;
