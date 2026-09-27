import { ArrowRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../../Components/index";

const ProfileCompletion = () => {
  const completion = 90;

  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <UserRound size={18} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-xs font-medium text-ink-muted">
            Profile completion
          </p>

          <p className="mt-1 text-lg font-semibold text-ink">{completion}%</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
          <div
            className="h-full rounded-full bg-brand-700 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-ink-muted">
          7 of 8 profile details completed
        </p>
      </div>

      <Link
        to="/students/profile"
        className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        Complete profile
        <ArrowRight size={15} />
      </Link>
    </Card>
  );
};

export default ProfileCompletion;
