import { LockKeyhole, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { departmentMap } from "./profile.data";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const ProfileHeader = ({ profile }) => {
  const initials = getInitials(profile?.fullName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
          {initials || <UserRound size={25} />}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
            {profile?.fullName || "Student"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {departmentMap[profile?.department] ||
              profile?.department ||
              "Department not available"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Roll No. {profile?.rollNumber || "Not available"}
          </p>
        </div>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <LockKeyhole size={13} />
        Profile is read-only
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
