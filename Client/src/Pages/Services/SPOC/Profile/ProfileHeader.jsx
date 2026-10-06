import { UserRound, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "../../../../Animations/animations";
import { Button, Card } from "../../../../Components";
import { getDisplayValue } from "./displayValue";

export const ProfileHeader = ({ spoc, onEdit }) => {
  return (
    <motion.section
      variants={fadeUp}
      viewport={viewport}
      className="w-full min-w-0"
    >
      <Card className="w-full min-w-0 overflow-hidden border-border bg-surface shadow-(--shadow-card)">
        <Card.Content className="p-4 sm:p-6 lg:p-7">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Identity */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 sm:size-20">
                <UserRound size={30} strokeWidth={1.8} className="sm:hidden" />

                <UserRound
                  size={36}
                  strokeWidth={1.8}
                  className="hidden sm:block"
                />
              </div>

              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h2 className="wrap-break-word text-lg font-bold text-ink sm:text-xl">
                    {getDisplayValue(spoc?.fullName)}
                  </h2>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700 sm:text-xs">
                    <CheckCircle2 size={12} />
                    Active
                  </span>
                </div>

                <p className="mt-1 wrap-break-word text-sm text-ink-muted sm:text-base">
                  Training &amp; Placement SPOC
                </p>

                <p className="mt-1 break-all text-xs text-ink-muted">
                  SPOC ID: {getDisplayValue(spoc?.spocId)}
                </p>
              </div>
            </div>

            {/* Action */}
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="w-full shrink-0 border-border bg-transparent text-ink hover:bg-cream sm:w-auto"
            >
              Edit Profile
            </Button> */}
          </div>
        </Card.Content>
      </Card>
    </motion.section>
  );
};
