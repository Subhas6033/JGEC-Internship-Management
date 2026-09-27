import React from "react";
import { Check, Circle, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../index";
import {
  fadeUp,
  hoverLift,
  tapScaleSmall,
  viewport,
} from "../../Animations/animations";

const steps = [
  {
    label: "Applied",
    complete: true,
  },
  {
    label: "In Review",
    complete: true,
  },
  {
    label: "Approved",
    complete: true,
  },
  {
    label: "NOC Issued",
    complete: false,
  },
  {
    label: "Completed",
    complete: false,
  },
];

const ApprovalComponents = () => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative mx-auto w-full max-w-107.5"
    >
      {/* Floating status */}
      <motion.div
        whileHover={hoverLift}
        whileTap={tapScaleSmall}
        className="
          absolute
          -left-5
          top-5
          z-20
          rounded-md
          border
          border-border
          bg-cream-soft
          px-3
          py-2
          text-[9px]
          font-medium
          text-brand-700
          shadow-card
          sm:-left-16
        "
      >
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-brand-500" />
        NOC Approved ✓
      </motion.div>

      {/* Main Card */}
      <Card
        className="
    relative
    overflow-hidden
    border-border
    bg-cream-soft
    shadow-card
  "
      >
        {/* Header */}
        <Card.Header className="border-b border-border p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Card.Title className="text-sm tracking-tight text-ink">
                INT-2026-00421
              </Card.Title>

              <Card.Description className="eyebrow mt-1 text-[8px]">
                Application overview
              </Card.Description>
            </div>

            <span
              className="
          rounded-full
          bg-cream-dark
          px-2
          py-1
          text-[8px]
          font-medium
          text-ink-muted
        "
            >
              Active Request
            </span>
          </div>
        </Card.Header>

        {/* Student Details */}
        <Card.Content className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 sm:p-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-ink-muted">
              Student
            </p>

            <p className="mt-1 text-[11px] font-medium text-ink">
              Aayan Sharma
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-ink-muted">
              Company
            </p>

            <p className="mt-1 text-[11px] font-medium text-ink">Microsoft</p>
          </div>

          <div className="col-span-2">
            <p className="text-[8px] uppercase tracking-[0.12em] text-ink-muted">
              Role
            </p>

            <p className="mt-1 text-[11px] font-medium text-ink">
              Software Engineering Intern
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-ink-muted">
              Current stage
            </p>

            <p className="mt-1 text-[11px] font-semibold text-brand-700">
              Admin Approval
            </p>
          </div>

          <div className="flex items-end justify-end">
            <span
              className="
          rounded-md
          border
          border-border
          bg-cream
          px-2
          py-1
          text-[8px]
          text-ink-muted
        "
            >
              NOC Generated
            </span>
          </div>
        </Card.Content>

        {/* Approval Progress */}
        <Card.Content className="px-4 pb-0 pt-0 sm:px-5">
          <div className="rounded-lg bg-cream-dark p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[9px] font-medium text-ink">
                Approval progress
              </p>

              <span className="text-[8px] text-ink-muted">3 of 5 complete</span>
            </div>

            <div className="relative">
              {/* Progress background */}
              <div className="absolute left-1 right-1 top-1.25 h-px bg-border" />

              {/* Completed progress */}
              <div className="absolute left-1 top-1.25 h-px w-[57%] bg-brand-600" />

              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.label}
                    className="flex w-12 flex-col items-center gap-1"
                  >
                    <span
                      className={`flex size-2.5 items-center justify-center rounded-full border ${
                        step.complete
                          ? "border-brand-600 bg-brand-600"
                          : "border-ink-muted/40 bg-cream-dark"
                      }`}
                    >
                      {step.complete && (
                        <Check
                          size={6}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </span>

                    <span className="text-center text-[7px] text-ink-muted">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card.Content>

        {/* Footer */}
        <Card.Footer className="mt-3 justify-between gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[8px] text-ink-muted">
            <FileCheck2 size={11} className="text-brand-600" />
            Official approval record maintained
          </div>

          <Button size="sm" variant="outline" className="h-7 px-2 text-[8px]">
            View
          </Button>
        </Card.Footer>
      </Card>

      {/* Floating bottom status */}
      <motion.div
        whileHover={hoverLift}
        className="
          absolute
          -bottom-5
          -left-4
          z-20
          rounded-md
          border
          border-border
          bg-cream-soft
          px-3
          py-2
          shadow-card
          sm:-left-20
        "
      >
        <div className="flex items-center gap-2">
          <Circle size={8} fill="currentColor" className="text-brand-500" />

          <span className="text-[8px] font-medium text-ink">Email Sent</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApprovalComponents;
