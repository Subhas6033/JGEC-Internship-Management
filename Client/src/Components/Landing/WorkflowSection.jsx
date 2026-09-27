import React, { useRef } from "react";
import { Check, Circle, FileCheck2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, viewport, transitions } from "../../Animations/animations";

const workflowSteps = [
  {
    id: "submitted",
    label: "Submitted",
    eyebrow: "Application submitted",
    title: "Your application has been received.",
    description:
      "Your application and supporting documents are securely recorded and ready for review.",
    status: "Submitted",
    date: "12 Jan 2026",
    icon: Check,
  },
  {
    id: "deptTPO",
    label: "Dept. TPO Review",
    eyebrow: "TPO review",
    title: "Your application is being reviewed by the TPO Coordinator.",
    description:
      "The TPO Coordinator verifies your application details and supporting documents.",
    status: "In Review",
    date: "13 Jan 2026",
    icon: FileCheck2,
  },
  {
    id: "tpo",
    label: "TPO Review",
    eyebrow: "TPO review",
    title: "Your application is being reviewed by the TPO Coordinator.",
    description:
      "The TPO Coordinator verifies your application details and supporting documents.",
    status: "In Review",
    date: "13 Jan 2026",
    icon: FileCheck2,
  },
  {
    id: "admin",
    label: "Admin Review",
    eyebrow: "Admin approval",
    title: "Your application has moved to administrative approval.",
    description:
      "The administration team reviews the final details before approval is issued.",
    status: "Admin Review",
    date: "14 Jan 2026",
    icon: FileCheck2,
  },
  {
    id: "approved",
    label: "Approved",
    eyebrow: "Approval complete",
    title: "Your application has been approved.",
    description:
      "Approval is complete. Your NOC and final documentation are ready to be issued.",
    status: "Approved",
    date: "15 Jan 2026",
    icon: Check,
  },
];

const WorkflowSection = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative border-y border-border bg-cream-dark/45"
    >
      {/* 
        The section itself creates the scroll distance.
        The inner workflow remains pinned while this area is scrolling.
      */}
      <div className="relative h-[390vh] sm:h-[410vh] lg:h-[430vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <p className="eyebrow">How it works</p>

                <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                  From Application to Approval
                </h2>

                <p className="mt-2 max-w-md text-[11px] leading-5 text-ink-muted sm:text-xs">
                  Every step is visible. Every approval is tracked.
                </p>
              </motion.div>

              <div className="mt-5 sm:mt-7">
                <WorkflowExperience scrollYProgress={scrollYProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WorkflowExperience = ({ scrollYProgress }) => {
  return (
    <>
      {/* Mobile progress */}
      <div className="mb-4 lg:hidden">
        <MobileWorkflowProgress scrollYProgress={scrollYProgress} />
      </div>

      <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        {/* Desktop progress */}
        <WorkflowProgress scrollYProgress={scrollYProgress} />

        {/* Workflow cards */}
        <div className="relative h-[calc(100vh-225px)] min-h-85 max-h-107.5 sm:h-107.5 sm:min-h-0">
          {workflowSteps.map((step, index) => (
            <WorkflowCard
              key={step.id}
              step={step}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// Desktop Progress
const WorkflowProgress = ({ scrollYProgress }) => {
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="hidden lg:block">
      <div className="pt-3">
        <p className="mb-5 text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Progress
        </p>

        <div className="relative">
          {/* Background rail */}
          <div className="absolute bottom-3 left-2.75 top-3 w-px bg-border" />

          {/* Animated rail */}
          <motion.div
            style={{
              height: progressHeight,
            }}
            className="absolute left-2.75 top-3 w-px bg-brand-700"
          />

          <div className="relative space-y-7">
            {workflowSteps.map((step, index) => (
              <ProgressItem
                key={step.id}
                index={index}
                label={step.label}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop Progress Items
const ProgressItem = ({ index, label, scrollYProgress }) => {
  const stepSize = 1 / workflowSteps.length;

  const start = index * stepSize;

  const activePoint = start + stepSize * 0.45;

  const end = (index + 1) * stepSize;

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.03), activePoint, Math.min(1, end + 0.03)],
    [0.45, 1, 0.55],
  );

  const scale = useTransform(
    scrollYProgress,
    [
      Math.max(0, activePoint - 0.04),
      activePoint,
      Math.min(1, activePoint + 0.04),
    ],
    [1, 1.18, 1],
  );

  const dotBackground = useTransform(
    scrollYProgress,
    [Math.max(0, activePoint - 0.025), activePoint],
    ["#f7f5ed", "#08784f"],
  );

  const dotBorder = useTransform(
    scrollYProgress,
    [Math.max(0, activePoint - 0.025), activePoint],
    ["#ddd9ca", "#08784f"],
  );

  const textColor = useTransform(
    scrollYProgress,
    [Math.max(0, activePoint - 0.025), activePoint],
    ["#77736a", "#08784f"],
  );

  return (
    <motion.div
      style={{ opacity }}
      className="relative flex min-h-9.5 items-center gap-4"
    >
      {/* Circle */}
      <motion.div
        style={{
          scale,
          backgroundColor: dotBackground,
          borderColor: dotBorder,
        }}
        className="relative z-10 flex size-5.75 shrink-0 items-center justify-center rounded-full border"
      >
        <Circle size={6} fill="currentColor" className="text-brand-700" />
      </motion.div>

      {/* Label */}
      <motion.span
        style={{ color: textColor }}
        className="max-w-37.5 text-[10px] font-semibold leading-4 tracking-tight"
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

// Mobile Progress
const MobileWorkflowProgress = ({ scrollYProgress }) => {
  return (
    <div className="rounded-lg border border-border bg-cream-soft px-2.5 py-3 sm:px-4">
      <div className="flex items-start">
        {workflowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <MobileProgressItem
              index={index}
              label={step.label}
              scrollYProgress={scrollYProgress}
            />

            {index < workflowSteps.length - 1 && (
              <MobileProgressLine
                index={index}
                scrollYProgress={scrollYProgress}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Mobile Progress Items
const MobileProgressItem = ({ index, label, scrollYProgress }) => {
  const stepSize = 1 / workflowSteps.length;

  const start = index * stepSize;

  const activePoint = start + stepSize * 0.45;

  const scale = useTransform(
    scrollYProgress,
    [
      Math.max(0, activePoint - 0.04),
      activePoint,
      Math.min(1, activePoint + 0.04),
    ],
    [1, 1.18, 1],
  );

  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - 0.03),
      activePoint,
      Math.min(1, start + stepSize + 0.03),
    ],
    [0.45, 1, 0.6],
  );

  const backgroundColor = useTransform(
    scrollYProgress,
    [Math.max(0, activePoint - 0.025), activePoint],
    ["#f7f5ed", "#08784f"],
  );

  const borderColor = useTransform(
    scrollYProgress,
    [Math.max(0, activePoint - 0.025), activePoint],
    ["#ddd9ca", "#08784f"],
  );

  return (
    <motion.div
      style={{ opacity }}
      className="flex min-w-0 flex-[0_0_auto] flex-col items-center"
    >
      <motion.div
        style={{
          scale,
          backgroundColor,
          borderColor,
        }}
        className="flex size-6 shrink-0 items-center justify-center rounded-full border"
      >
        <Circle size={6} fill="currentColor" className="text-brand-700" />
      </motion.div>

      <span className="mt-1.5 w-14.5 text-center text-[6.5px] font-semibold leading-2.25 text-ink-muted sm:w-18 sm:text-[7px] sm:leading-2.5">
        {label}
      </span>
    </motion.div>
  );
};

// Mobile Progress Line
const MobileProgressLine = ({ index, scrollYProgress }) => {
  const stepSize = 1 / workflowSteps.length;

  const start = index * stepSize;

  const end = (index + 1) * stepSize;

  const width = useTransform(scrollYProgress, [start, end], ["0%", "100%"]);

  return (
    <div className="mx-1 mt-3 h-px min-w-2 flex-1 overflow-hidden bg-border sm:mx-1.5">
      <motion.div style={{ width }} className="h-full bg-brand-700" />
    </div>
  );
};

// Workflow Card
const WorkflowCard = ({ step, index, scrollYProgress }) => {
  const stepSize = 1 / workflowSteps.length;

  const start = index * stepSize;

  /*
   * Card enters slightly before
   * its progress point.
   */
  const enterStart = Math.max(0, start - 0.045);

  const enterEnd = start + 0.075;

  /*
   * Keep the card visible for
   * most of its step.
   */
  const exitStart = start + stepSize * 0.68;

  const exitEnd = start + stepSize * 0.94;

  const y = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [110, 0, 0, -75],
  );

  const opacity = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  );

  const scale = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.96, 1, 1, 0.975],
  );

  const blur = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["blur(5px)", "blur(0px)", "blur(0px)", "blur(3px)"],
  );

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        filter: blur,
      }}
      transition={transitions.smoothSpring}
      className="absolute inset-0"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-cream-soft shadow-card">
        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-border p-4 sm:p-5 lg:p-6">
          <div className="min-w-0 pr-3">
            <p className="eyebrow text-[7px] sm:text-[8px]">{step.eyebrow}</p>

            <h3 className="mt-1.5 font-display text-base leading-tight tracking-tight sm:mt-2 sm:text-lg lg:text-2xl">
              {step.title}
            </h3>

            <p className="mt-2 max-w-2xl text-[9px] leading-4 text-ink-muted sm:text-[10px] sm:leading-5 lg:text-xs">
              {step.description}
            </p>
          </div>

          {/* Status */}
          <div className="hidden shrink-0 items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1.5 text-[7px] font-semibold text-brand-700 sm:flex lg:px-3 lg:text-[8px]">
            <span className="size-1.5 rounded-full bg-brand-700" />
            {step.status}
          </div>
        </div>

        {/* Applications Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border p-4 sm:grid-cols-3 sm:gap-5 sm:p-5 lg:p-6">
          <InfoItem label="Student" value="Ayan Sharma" />

          <InfoItem label="Submitted" value="12 Jan 2026" />

          <InfoItem
            label="Documents"
            value="3 attached"
            className="col-span-2 sm:col-span-1"
          />
        </div>
        {/* Current Status */}
        <div className="mx-4 mt-4 rounded-lg bg-cream-dark p-3 sm:mx-5 sm:mt-5 sm:p-4 lg:mx-6">
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-ink-muted sm:text-[8px]">
              Current status
            </p>

            <span className="text-[7px] font-semibold text-brand-700 sm:text-[8px]">
              {step.status}
            </span>
          </div>

          <div className="mt-3 flex items-center sm:mt-4">
            {workflowSteps.map((item, itemIndex) => (
              <React.Fragment key={item.id}>
                <SmallStep
                  index={itemIndex}
                  currentIndex={index}
                  label={item.label}
                />

                {itemIndex < workflowSteps.length - 1 && (
                  <div className="mx-1 h-px flex-1 bg-border sm:mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-3 p-4 sm:p-5 lg:p-6">
          <div className="min-w-0">
            <p className="text-[7px] uppercase tracking-[0.14em] text-ink-muted sm:text-[8px]">
              Last updated
            </p>

            <p className="mt-1 text-[10px] font-semibold sm:text-xs">
              {step.date}
            </p>
          </div>

          <div className="flex shrink-0 gap-1.5 sm:gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-md bg-brand-700 px-2.5 py-2 text-[8px] font-semibold text-white transition-colors duration-150 hover:bg-brand-800 sm:px-3 sm:text-[9px]"
            >
              View Application
            </button>

            <button
              type="button"
              className="hidden cursor-pointer rounded-md border border-border bg-cream-soft px-3 py-2 text-[9px] font-medium text-ink transition-colors duration-150 hover:bg-cream xs:block"
            >
              View Documents
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Small Card Progress
const SmallStep = ({ index, currentIndex, label }) => {
  const complete = index <= currentIndex;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full sm:size-5 ${
          complete
            ? "bg-brand-700 text-white"
            : "border border-border bg-cream-soft text-ink-muted"
        }`}
      >
        {complete ? (
          <Check size={8} strokeWidth={3} className="sm:size-2.5" />
        ) : (
          <Circle size={5} className="sm:size-1.75" />
        )}
      </span>

      <span
        className={`hidden truncate text-[7px] sm:block sm:text-[8px] ${
          complete ? "font-medium text-ink" : "text-ink-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

// Info Items
const InfoItem = ({ label, value, className = "" }) => {
  return (
    <div className={className}>
      <p className="text-[7px] uppercase tracking-[0.14em] text-ink-muted sm:text-[8px]">
        {label}
      </p>

      <p className="mt-1 truncate text-[10px] font-semibold text-ink sm:text-xs">
        {value}
      </p>
    </div>
  );
};

export default WorkflowSection;
