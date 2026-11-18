import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, UserRound, ShieldCheck, Activity } from "lucide-react";

import { Card } from "../../../../Components/index";

import SettingsSidebar from "./SettingsSidebar";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import PreferenceSettings from "./PreferenceSettings";
import LoginActivity from "./LoginActivity";
import WorkActivity from "./WorkActivity";

import {
  initialPreferences,
  initialLoginActivity,
  initialWorkActivity,
  settingsTabs,
} from "./adminSettings.data";

import {
  pageAnimation,
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

import {
  useAdminProfile,
  useUpdateAdminProfile,
  useUpdateAdminSignature,
} from "../../../../Services/Queries/adminProfile.quires";

// Stable reference so ProfileSettings' useEffect doesn't re-run every render
const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  employeeId: "",
  signature: "",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile now comes from the API
  const { data: profile = EMPTY_PROFILE, isLoading: profileLoading } =
    useAdminProfile();
  const updateProfile = useUpdateAdminProfile();
  const updateSignature = useUpdateAdminSignature();

  const [preferences, setPreferences] = useState(initialPreferences);

  const [loginActivity, setLoginActivity] = useState(initialLoginActivity);

  const [workActivity] = useState(initialWorkActivity);

  const pageVariants = useAnimationVariants(pageAnimation);
  const sectionVariants = useAnimationVariants(sectionAnimation);

  const handleProfileSave = async (updatedProfile) => {
    try {
      await updateProfile.mutateAsync({
        fullName: updatedProfile.name,
        email: updatedProfile.email,
        mobileNumber: updatedProfile.phone,
      });
      window.alert("Profile updated successfully.");
    } catch (error) {
      window.alert(getErrorMessage(error, "Failed to update profile."));
    }
  };

  const handleSignatureUpload = async (file) => {
    try {
      await updateSignature.mutateAsync(file);
      window.alert("Signature updated successfully.");
    } catch (error) {
      window.alert(getErrorMessage(error, "Failed to update signature."));
    }
  };

  const handlePreferencesSave = (updatedPreferences) => {
    setPreferences(updatedPreferences);
    window.alert("Preferences saved successfully.");
  };

  const handleRevokeSession = (session) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke the session for ${session.device}?`,
    );

    if (!confirmed) return;

    setLoginActivity((previous) =>
      previous.map((item) =>
        item._id === session._id ? { ...item, status: "Revoked" } : item,
      ),
    );
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSettings
            profile={profile}
            loading={profileLoading}
            saving={updateProfile.isPending}
            uploadingSignature={updateSignature.isPending}
            onSave={handleProfileSave}
            onSignatureUpload={handleSignatureUpload}
          />
        );

      case "security":
        return (
          <SecuritySettings
            loginActivity={loginActivity}
            onRevokeSession={handleRevokeSession}
          />
        );

      case "preferences":
        return (
          <PreferenceSettings
            preferences={preferences}
            onSave={handlePreferencesSave}
          />
        );

      case "login":
        return <LoginActivity activities={loginActivity} />;

      case "activity":
        return <WorkActivity activities={workActivity} />;

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
          <Settings size={25} />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Admin Settings
          </h1>

          <p className="mt-1 text-sm leading-6 text-ink-muted">
            Manage your administrator account, security, preferences, and
            account activity.
          </p>
        </div>
      </div>

      {/* Account Summary */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Card className="flex flex-col gap-4 border border-border bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
              <UserRound size={27} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold text-ink">
                {profile.name}
              </h2>

              <p className="mt-1 truncate text-sm text-ink-muted">
                {profile.email}
              </p>

              <p className="mt-1 text-xs text-ink-muted">
                {(profile.designation || profile.employeeId) && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {[profile.designation, profile.employeeId]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-green-50 px-3 py-1.5 sm:self-center">
            <ShieldCheck size={16} className="text-green-700" />
            <span className="text-xs font-semibold text-green-700">
              Administrator Account
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Settings Content */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Settings Navigation */}
        <Card className="h-fit min-w-0 border border-border bg-white p-3 shadow-card lg:sticky lg:top-24">
          <div className="mb-3 hidden px-3 pt-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Account Settings
            </p>
          </div>

          <SettingsSidebar
            tabs={settingsTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Card>

        {/* Active Settings Section */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-w-0"
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Security Reminder */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
        <div className="rounded-lg bg-cream-soft p-2 text-brand-600">
          <Activity size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">
            Account Security Reminder
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Keep your contact details up to date, use a strong password, and
            regularly review your login and administrative activity.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
