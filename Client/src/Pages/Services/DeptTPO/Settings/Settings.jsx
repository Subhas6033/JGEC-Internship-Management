import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { Toast } from "../../../../Components";
import {
  useUpdateTpoProfile,
  useUpdateTpoSignature,
} from "../../../../Services/Queries/tpoProfile.quires";
import { selectUser, updateUser } from "../../../../Store/Slice/authSlice";
import SettingsSection from "./Settingsection";
import ProfileDetailsForm from "./ProfileDetailForm";
import ProfileSummary from "./Profilesummary";
import SettingsSkeleton from "./SettingSkeleton";
import SignatureUploader from "./SignatureUploader";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const Settings = () => {
  const dispatch = useDispatch();

  // Centralized auth: the signed-in user is the single source of truth.
  const profile = useSelector(selectUser);

  const { mutateAsync: updateProfile, isPending: isSavingProfile } =
    useUpdateTpoProfile();
  const { mutateAsync: updateSignature, isPending: isSavingSignature } =
    useUpdateTpoSignature();

  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const showError = (message) =>
    setToast({ variant: "error", title: "Something went wrong", message });

  const showSuccess = (title, message) =>
    setToast({ variant: "success", title, message });

  const handleSaveProfile = async (values) => {
    setToast(null);
    try {
      const updated = await updateProfile(values);
      // Merges into the auth user, so the navbar name and email update too.
      dispatch(updateUser(updated ?? values));
      showSuccess("Details saved", "Your personal details are up to date.");
    } catch (err) {
      showError(
        getErrorMessage(err, "Could not save your details. Try again."),
      );
    }
  };

  const handleUploadSignature = async (file) => {
    setToast(null);
    try {
      const updated = await updateSignature(file);
      if (updated?.signature) {
        dispatch(updateUser({ signature: updated.signature }));
      }
      showSuccess("Signature saved", "Your new signature is now in use.");
      return true;
    } catch (err) {
      showError(
        getErrorMessage(err, "Could not upload your signature. Try again."),
      );
      return false;
    }
  };

  return (
    <>
      <title>Settings | Department TPO | Internship NOC</title>
      <meta
        name="description"
        content="Update your name, email, mobile number and signature for the Department TPO portal."
      />
      <meta name="robots" content="noindex, nofollow" />

      <div className="w-full min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto w-full max-w-5xl space-y-8"
        >
          {/* Page header */}
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
              <Settings2 className="h-5 w-5" strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Settings
              </h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                Manage your personal details and signature.
              </p>
            </div>
          </div>

          {!profile ? (
            <SettingsSkeleton />
          ) : (
            <>
              <ProfileSummary profile={profile} />

              <SettingsSection
                title="Personal details"
                description="Your name, email address and mobile number."
              >
                <ProfileDetailsForm
                  profile={profile}
                  onSubmit={handleSaveProfile}
                  isSaving={isSavingProfile}
                />
              </SettingsSection>

              <SettingsSection
                title="Signature"
                description="Used on documents you approve."
              >
                <SignatureUploader
                  signature={profile?.signature}
                  onUpload={handleUploadSignature}
                  onInvalidFile={showError}
                  isUploading={isSavingSignature}
                />
              </SettingsSection>
            </>
          )}
        </motion.div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed right-4 top-20 z-100 w-full max-w-sm px-4 sm:px-0">
          <Toast
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={closeToast}
            duration={toast.variant === "error" ? 6000 : 4000}
          />
        </div>
      )}
    </>
  );
};

export default Settings;
