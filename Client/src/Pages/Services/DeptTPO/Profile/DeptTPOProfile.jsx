import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components";
import ProfileHeader from "./ProfileHeader";
import {
  useAnimationVariants,
  pageAnimation,
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
  cardAnimation,
  sectionAnimation,
  staggerContainer,
  staggerSlow,
  hoverLiftSmall,
  tapScaleSmall,
  viewport,
} from "../../../../Animations/animations";
import { getCurrentUser } from "../../../../Services/Auth/authApi";

const DeptTPOProfile = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
  const user = data?.user ?? data?.data?.user ?? null;
  // Convert backend user data into the structure required by ProfileHeader and the profile page.
  const profile = user
    ? {
        name: user.fullName,
        initials: getInitials(user.fullName),
        email: user.email,
        mobile: user.mobile || "Not provided",
        department: user.department || "Not assigned",
        tpoId: user.tpoId || "Not assigned",
        role: user.role || "TPO",
        accountStatus: user.isActive ? "Active" : "Inactive",
        emailVerified: user.isEmailVerified ? "Verified" : "Not verified",
        joinedDate: formatDate(user.createdAt),
        lastLoginAt: formatDateTime(user.lastLoginAt),
      }
    : null;

  const pageVariants = useAnimationVariants(pageAnimation);
  const headerVariants = useAnimationVariants(fadeUp);
  const statsVariants = useAnimationVariants(staggerContainer);
  const cardVariants = useAnimationVariants(cardAnimation);
  const leftVariants = useAnimationVariants(fadeLeft);
  const rightVariants = useAnimationVariants(fadeRight);
  const responsibilityVariants = useAnimationVariants(sectionAnimation);

  if (isLoading) {
    return (
      <>
        <title>Coordinator Profile | JGEC Internship Portal</title>

        <main
          className="
            min-h-[calc(100vh-4rem)]
            bg-cream
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-[60vh]
              max-w-7xl
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-brand-50
                  text-brand-700
                "
              >
                <UserRound size={22} />
              </div>

              <p className="text-sm text-ink-muted">Loading your profile...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>Coordinator Profile | JGEC Internship Portal</title>
        <main
          className="
            min-h-[calc(100vh-4rem)]
            bg-cream
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >
          <div className="mx-auto max-w-7xl">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-red-700
                  "
                >
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-ink">
                    Unable to load profile
                  </h2>

                  <p className="mt-1 text-sm text-ink-muted">
                    Your authenticated coordinator information could not be
                    loaded.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Page metadata */}
      <title>Coordinator Profile | JGEC Internship Portal</title>
      <meta
        name="description"
        content="View your Department TPO coordinator profile, account details, department information, and authorization status through the JGEC Internship Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        property="og:title"
        content="Coordinator Profile | JGEC Internship Portal"
      />
      <meta
        property="og:description"
        content="View your Department TPO coordinator information, account details, department, and authorization status."
      />
      <meta property="og:type" content="website" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="
          min-h-[calc(100vh-4rem)]
          bg-cream
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            space-y-6
          "
        >
          {/* Page heading */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <span className="eyebrow">Department TPO</span>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-ink
                  sm:text-3xl
                "
              >
                Coordinator Profile
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-ink-muted
                "
              >
                View and manage your Department TPO coordinator information.
              </p>
            </div>
          </motion.div>

          {!profile ? (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-brand-50
                      text-brand-700
                    "
                  >
                    <UserRound size={18} />
                  </div>

                  <div>
                    <h2
                      className="
                        text-base
                        font-semibold
                        text-ink
                      "
                    >
                      Profile unavailable
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-ink-muted
                      "
                    >
                      Your authenticated user information is not currently
                      available.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* Profile hero */}
              <ProfileHeader profile={profile} />

              {/* Stats */}
              <motion.div
                variants={statsVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >
                <ProfileStat label="TPO ID" value={profile.tpoId} />

                <ProfileStat label="Department" value={profile.department} />

                <ProfileStat
                  label="Account"
                  value={profile.accountStatus}
                  valueClassName="text-emerald-700"
                />

                <ProfileStat
                  label="Email"
                  value={profile.emailVerified}
                  valueClassName={
                    user?.isEmailVerified
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }
                />
              </motion.div>

              {/* Main information */}
              <div
                className="
                  grid
                  gap-6
                  lg:grid-cols-3
                "
              >
                {/* Personal information */}
                <motion.div
                  variants={leftVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  className="lg:col-span-2"
                >
                  <motion.div
                    whileHover={hoverLiftSmall}
                    whileTap={tapScaleSmall}
                  >
                    <Card
                      className="
                        p-5
                        sm:p-6
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-border
                          pb-4
                        "
                      >
                        <div
                          className="
                            flex
                            size-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-brand-50
                            text-brand-700
                          "
                        >
                          <UserRound size={18} />
                        </div>

                        <div>
                          <h2
                            className="
                              text-base
                              font-semibold
                              text-ink
                            "
                          >
                            Personal information
                          </h2>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-ink-muted
                            "
                          >
                            Your Department TPO account details
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          mt-5
                          grid
                          gap-x-6
                          gap-y-5
                          sm:grid-cols-2
                        "
                      >
                        <ProfileField
                          icon={UserRound}
                          label="Full name"
                          value={profile.name}
                        />

                        <ProfileField
                          icon={IdCard}
                          label="TPO ID"
                          value={profile.tpoId}
                        />

                        <ProfileField
                          icon={Mail}
                          label="College email"
                          value={profile.email}
                        />

                        <ProfileField
                          icon={Phone}
                          label="Mobile number"
                          value={profile.mobile}
                        />

                        <ProfileField
                          icon={CalendarDays}
                          label="Joined date"
                          value={profile.joinedDate}
                        />

                        <ProfileField
                          icon={ShieldCheck}
                          label="Account status"
                          value={profile.accountStatus}
                          valueClassName="text-emerald-700"
                        />

                        <ProfileField
                          icon={ShieldCheck}
                          label="Email verification"
                          value={profile.emailVerified}
                          valueClassName={
                            user?.isEmailVerified
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }
                        />

                        <ProfileField
                          icon={CalendarDays}
                          label="Last login"
                          value={profile.lastLoginAt}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Department information */}
                <motion.div
                  variants={rightVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  <motion.div
                    whileHover={hoverLiftSmall}
                    whileTap={tapScaleSmall}
                  >
                    <Card className="p-5 sm:p-6">
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-border
                          pb-4
                        "
                      >
                        <div
                          className="
                            flex
                            size-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-brand-50
                            text-brand-700
                          "
                        >
                          <Building2 size={18} />
                        </div>

                        <div>
                          <h2
                            className="
                              text-base
                              font-semibold
                              text-ink
                            "
                          >
                            Department
                          </h2>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-ink-muted
                            "
                          >
                            Assigned department details
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-5">
                        <ProfileField
                          icon={Building2}
                          label="Department"
                          value={profile.department}
                        />

                        <ProfileField
                          icon={GraduationCap}
                          label="Role"
                          value={profile.role}
                        />

                        <ProfileField
                          icon={IdCard}
                          label="TPO ID"
                          value={profile.tpoId}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>

              {/* Coordinator responsibility */}
              <motion.div
                variants={responsibilityVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <motion.div
                  whileHover={hoverLiftSmall}
                  whileTap={tapScaleSmall}
                >
                  <Card className="p-5 sm:p-6">
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >
                      <div className="flex gap-3">
                        <div
                          className="
                            flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-50
                            text-emerald-700
                          "
                        >
                          <CheckCircle2 size={18} />
                        </div>

                        <div>
                          <h2
                            className="
                              text-base
                              font-semibold
                              text-ink
                            "
                          >
                            Coordinator access
                          </h2>

                          <p
                            className="
                              mt-1
                              text-sm
                              leading-6
                              text-ink-muted
                            "
                          >
                            Your account is authorized to manage internship
                            applications for the{" "}
                            <span className="font-medium text-ink">
                              {profile.department}
                            </span>{" "}
                            department.
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          inline-flex
                          w-fit
                          items-center
                          gap-1.5
                          rounded-full
                          bg-emerald-50
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-emerald-700
                        "
                      >
                        <CheckCircle2 size={14} />

                        {profile.accountStatus}
                      </span>
                    </div>

                    <motion.div
                      variants={staggerSlow}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewport}
                      className="
                        mt-5
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                      "
                    >
                      <AccessItem label="Review applications" />
                      <AccessItem label="Set deadlines" />
                      <AccessItem label="Approve applications" />
                      <AccessItem label="Forward to central TPO" />
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.section>
    </>
  );
};

// Helpers
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "TP";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Profile Stat
const ProfileStat = ({ label, value, valueClassName = "text-ink" }) => {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={hoverLiftSmall}
      whileTap={tapScaleSmall}
    >
      <Card className="p-5">
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-ink-muted
          "
        >
          {label}
        </p>

        <p
          className={`
            mt-2
            text-2xl
            font-semibold
            ${valueClassName}
          `}
        >
          {value}
        </p>
      </Card>
    </motion.div>
  );
};

// Profile Fields
const ProfileField = ({
  icon: Icon,
  label,
  value,
  valueClassName = "text-ink",
}) => {
  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          font-medium
          text-ink-muted
        "
      >
        <Icon size={14} className="shrink-0" />

        <span>{label}</span>
      </div>

      <p
        className={`
          mt-1.5
          wrap-break-word
          text-sm
          font-medium
          ${valueClassName}
        `}
      >
        {value}
      </p>
    </motion.div>
  );
};

// AccessItems
const AccessItem = ({ label }) => {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={hoverLiftSmall}
      whileTap={tapScaleSmall}
      className="
        flex
        items-center
        gap-2.5
        rounded-lg
        border
        border-border
        bg-cream-soft
        px-3.5
        py-3
      "
    >
      <CheckCircle2
        size={16}
        className="
          shrink-0
          text-emerald-600
        "
      />

      <span className="text-sm text-ink">{label}</span>
    </motion.div>
  );
};

export default DeptTPOProfile;
