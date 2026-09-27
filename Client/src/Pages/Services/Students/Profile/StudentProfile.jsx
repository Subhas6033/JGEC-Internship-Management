import {
  BookOpen,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

import ProfileHeader from "./ProfileHeader";
import ProfileSection from "./ProfileSection";
import ProfileField from "./ProfileField";

import { studentProfile } from "./profile.data";

const StudentProfile = () => {
  return (
    <>
      <title>My Profile | JGEC Internship Portal</title>

      <meta
        name="description"
        content="View your registered academic, contact, and guardian information through the JGEC Internship Portal."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#ffffff" />

      <meta property="og:title" content="My Profile | JGEC Internship Portal" />

      <meta
        property="og:description"
        content="View your registered student information and academic details through the JGEC Internship Portal."
      />

      <meta property="og:type" content="website" />
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-sm text-primary">
              <UserRound size={17} />

              <span>Student Profile</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              View your registered student information. These details are
              maintained by the institution and cannot be changed from the
              student portal.
            </p>
          </motion.div>

          {/* Profile header */}
          <ProfileHeader profile={studentProfile} />

          {/* Academic information */}
          <ProfileSection
            title="Academic information"
            description="Your academic details registered with the institution."
          >
            <ProfileField
              label="Full name"
              value={studentProfile.fullName}
              icon={UserRound}
            />

            <ProfileField
              label="Department"
              value={studentProfile.department}
              icon={GraduationCap}
            />

            <ProfileField
              label="Roll number"
              value={studentProfile.rollNo}
              icon={Hash}
            />

            <ProfileField
              label="Current semester"
              value={studentProfile.currentSemester}
              icon={BookOpen}
            />
          </ProfileSection>

          {/* Contact information */}
          <ProfileSection
            title="Contact information"
            description="Your registered contact details."
          >
            <ProfileField
              label="Email address"
              value={studentProfile.email}
              icon={Mail}
            />

            <ProfileField
              label="Mobile number"
              value={studentProfile.mobileNumber}
              icon={Phone}
            />
          </ProfileSection>

          {/* Guardian information */}
          <ProfileSection
            title="Guardian information"
            description="Registered guardian contact information."
          >
            <ProfileField
              label="Guardian name"
              value={studentProfile.guardianName}
              icon={UsersRound}
            />

            <ProfileField
              label="Guardian mobile"
              value={studentProfile.guardianMobile}
              icon={Phone}
            />
          </ProfileSection>

          {/* Read-only notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Profile information is read-only
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                These details are managed by the institution. If any information
                is incorrect, please contact the concerned department or
                administrator.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default StudentProfile;
