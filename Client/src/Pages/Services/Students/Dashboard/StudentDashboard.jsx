import { motion } from "motion/react";
import { ArrowRight, ClipboardCheck, Clock3, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../../Components/index";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const StudentDashboard = () => {
  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <p className="eyebrow">Student workspace</p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1
                className="
                  font-display
                  text-3xl leading-tight
                  tracking-tight
                  text-ink
                  sm:text-4xl
                "
              >
                Welcome back, Aarav.
              </h1>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Manage your internship applications and required documents from
                one place.
              </p>
            </div>

            <Link
              to="/student/applications/new"
              className="
                focus-ring
                inline-flex shrink-0
                items-center justify-center gap-2
                rounded-lg
                bg-brand-700
                px-4 py-2.5
                text-sm font-semibold
                text-white
                shadow-sm
                transition-all duration-150
                hover:bg-brand-800
              "
            >
              New Application
              <ArrowRight size={16} strokeWidth={1.9} />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="
            grid gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          <Card className="border-border bg-cream-soft p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-ink-muted">
                  Applications
                </p>

                <p className="mt-2 text-2xl font-semibold text-ink">2</p>
              </div>

              <div
                className="
                  flex size-10 items-center justify-center
                  rounded-lg bg-brand-50
                  text-brand-700
                "
              >
                <FileText size={18} strokeWidth={1.8} />
              </div>
            </div>
          </Card>

          <Card className="border-border bg-cream-soft p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-ink-muted">
                  Pending review
                </p>

                <p className="mt-2 text-2xl font-semibold text-ink">1</p>
              </div>

              <div
                className="
                  flex size-10 items-center justify-center
                  rounded-lg bg-cream-dark
                  text-ink
                "
              >
                <Clock3 size={18} strokeWidth={1.8} />
              </div>
            </div>
          </Card>

          <Card className="border-border bg-cream-soft p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-ink-muted">Approved</p>

                <p className="mt-2 text-2xl font-semibold text-ink">1</p>
              </div>

              <div
                className="
                  flex size-10 items-center justify-center
                  rounded-lg bg-brand-50
                  text-brand-700
                "
              >
                <ClipboardCheck size={18} strokeWidth={1.8} />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentDashboard;
