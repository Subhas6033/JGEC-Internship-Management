import { LockKeyhole, UserRound } from "lucide-react";
import { motion } from "framer-motion";

const ProfileHeader = ({ profile }) => {
  const initials = profile.fullName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            {profile.fullName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {profile.department}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Roll No. {profile.rollNo}
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
