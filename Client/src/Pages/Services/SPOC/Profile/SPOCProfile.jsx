import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../Store/Slice/authSlice";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../Animations/animations";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalInformation } from "./Personalnformation";
import { OrganizationInformation } from "./OrganizationInformation";
import { RoleAccess } from "./RoleAccess";

// SPOC Profile
const SPOCProfile = () => {
  const spoc = useSelector(selectUser);

  const handleEditProfile = () => {
    console.log("Edit SPOC profile");
  };

  return (
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
        <p className="eyebrow">SPOC Profile</p>

        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 w-full max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
          View your SPOC account information and Training &amp; Placement
          details.
        </p>
      </motion.section>

      {/* Profile Overview */}
      <motion.div
        variants={fadeUp}
        viewport={viewport}
        className="mt-6 w-full min-w-0 sm:mt-8"
      >
        <ProfileHeader spoc={spoc} onEdit={handleEditProfile} />
      </motion.div>

      {/* Profile Information */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-6 w-full min-w-0 sm:mt-8"
      >
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <PersonalInformation spoc={spoc} />

          <OrganizationInformation spoc={spoc} />
        </div>
      </motion.section>

      {/* Role & Access */}
      <RoleAccess spoc={spoc} />
    </motion.div>
  );
};

export default SPOCProfile;
