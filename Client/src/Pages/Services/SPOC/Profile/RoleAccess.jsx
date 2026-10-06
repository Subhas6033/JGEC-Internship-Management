import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { getDisplayValue } from "./displayValue";
import { fadeUp, viewport } from "../../../../Animations/animations";
import { Card } from "../../../../Components";

export const RoleAccess = ({ spoc }) => {
  const role = spoc?.role?.toLowerCase();

  return (
    <motion.section
      variants={fadeUp}
      viewport={viewport}
      className="mt-6 w-full min-w-0 sm:mt-8"
    >
      <Card className="w-full min-w-0 border-brand-200 bg-brand-50 shadow-none">
        <Card.Content className="p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-4 p-2 sm:flex-row sm:items-start">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <ShieldCheck size={19} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="p-2 text-sm font-semibold text-brand-900">
                SPOC Access
              </p>

              <p className="mt-1 text-xs leading-5 text-brand-700 sm:text-sm">
                Your account is configured as the Training &amp; Placement SPOC.
                You can review forwarded company applications, manage selected
                students, approve applications and access generated NOCs.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-medium text-brand-700 sm:text-xs">
                  Application Review
                </span>

                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-medium text-brand-700 sm:text-xs">
                  NOC Management
                </span>

                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-medium text-brand-700 sm:text-xs">
                  Student Review
                </span>
              </div>

              <p className="mt-3 text-[11px] text-brand-700">
                Current role:{" "}
                <span className="font-semibold">{getDisplayValue(role)}</span>
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.section>
  );
};
