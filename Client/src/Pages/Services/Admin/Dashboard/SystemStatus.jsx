import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { fadeUp, viewport } from "../../../../Animations/animations";

const SystemStatus = () => {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="mt-6"
    >
      <Card className="border-brand-700! bg-brand-700! text-white! shadow-card">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <CheckCircle2 size={19} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Internship portal is operational
              </p>

              <p className="mt-1 text-xs leading-5 text-white/70">
                All core administrative services are currently available.
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            System healthy
          </span>
        </div>
      </Card>
    </motion.section>
  );
};

export default SystemStatus;
