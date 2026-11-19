import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, Mail, ShieldCheck } from "lucide-react";
import { Card, Toast } from "../../../../Components";
import SPOCProfileCard from "../../../../Components/SPOC/SPOCProfileCard";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../Animations/animations";
import { useSpocProfile } from "../../../../Services/Queries/spocProfile.quires";
import { SectionHeader } from "../Profile/SectionHeader";
import { getDisplayValue } from "../Profile/displayValue";
import ProfileSettings from "./ProfileSettings";
import SignatureSettings from "./SignatureSettings";
import PasswordSettings from "./PasswordSettings";

const SPOCSettings = () => {
  const { spoc } = useSpocProfile();
  const [toast, setToast] = useState(null);

  const notify = useCallback((variant, title, message) => {
    setToast({ id: Date.now(), variant, title, message });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <>
      <title>Settings | SPOC Portal | JGEC Internship Management</title>
      <meta
        name="description"
        content="Manage your SPOC profile details, signature and password in the JGEC Internship Management Portal."
      />
      <meta name="robots" content="noindex, nofollow" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="
          box-border
          w-full
          min-w-0
          max-w-none
          overflow-x-hidden
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
          lg:py-8
        "
      >
        {/* Page Header */}
        <motion.section
          variants={fadeUp}
          viewport={viewport}
          className="w-full min-w-0"
        >
          <p className="eyebrow">SPOC Settings</p>

          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 w-full max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            Update your contact details, manage your signature and keep your
            account secure.
          </p>
        </motion.section>

        {/* Editable settings */}
        <motion.section
          variants={fadeUp}
          viewport={viewport}
          className="mt-6 grid w-full min-w-0 grid-cols-1 gap-4 sm:mt-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]"
        >
          <div className="min-w-0 space-y-4">
            <ProfileSettings spoc={spoc} onNotify={notify} />
            <PasswordSettings onNotify={notify} />
          </div>

          <div className="min-w-0 space-y-4">
            <SignatureSettings spoc={spoc} onNotify={notify} />

            {/* Read-only account information */}
            <Card className="w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
              <Card.Content className="p-4 sm:p-5 lg:p-6">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Account"
                  description="Managed by the administrator"
                />

                <div className="mt-5 space-y-3">
                  <SPOCProfileCard
                    label="SPOC ID"
                    value={getDisplayValue(spoc?.spocId)}
                    icon={BadgeCheck}
                  />

                  <SPOCProfileCard
                    label="Official Email"
                    value={getDisplayValue(spoc?.email)}
                    icon={Mail}
                  />

                  <SPOCProfileCard
                    label="Department"
                    value={getDisplayValue(spoc?.department)}
                    icon={Building2}
                  />
                </div>

                <p className="mt-4 text-xs leading-5 text-ink-muted">
                  Your SPOC ID, official email and department cannot be changed
                  here. Contact the portal administrator if any of these are
                  incorrect.
                </p>
              </Card.Content>
            </Card>
          </div>
        </motion.section>
      </motion.div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-end">
          <Toast
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={closeToast}
          />
        </div>
      )}
    </>
  );
};

export default SPOCSettings;
