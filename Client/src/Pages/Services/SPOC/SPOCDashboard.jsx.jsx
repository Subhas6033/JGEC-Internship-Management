import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button, Card } from "../../../Components/index";
import SPOCStatCard from "../../../Components/SPOC/SPOCStatCard";
import CompanyApplicationCard from "../../../Components/SPOC/CompanyApplicationCard";

import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";

const applications = [
  {
    id: "APP-001",
    company: "Tata Power",
    location: "Kolkata",
    deadline: "28 Sep 2026",
    status: "pending",
    students: [
      {
        id: "STU-001",
        name: "Rahul Das",
        rollNo: "CSE-21-001",
        department: "CSE",
        cgpa: "8.72",
      },
      {
        id: "STU-002",
        name: "Ananya Roy",
        rollNo: "CSE-21-014",
        department: "CSE",
        cgpa: "8.45",
      },
      {
        id: "STU-003",
        name: "Sayan Ghosh",
        rollNo: "IT-21-009",
        department: "IT",
        cgpa: "8.91",
      },
    ],
  },
  {
    id: "APP-002",
    company: "TakeUForward",
    location: "Bengaluru",
    deadline: "25 Sep 2026",
    status: "noc",
    nocReference: "TNP/JGEC/INT/IT/2023/SEPT/005",
    students: [
      {
        id: "STU-004",
        name: "Priya Sharma",
        rollNo: "ECE-21-005",
        department: "ECE",
        cgpa: "9.02",
      },
      {
        id: "STU-005",
        name: "Arjun Sen",
        rollNo: "CSE-21-019",
        department: "CSE",
        cgpa: "8.66",
      },
    ],
  },
];

const SPOCDashboard = () => {
  const handleViewApplication = (application) => {
    console.log("Review SPOC application:", application);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="
        box-border
        w-full
        min-w-0
        max-w-none
        overflow-x-hidden
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-8
      "
    >
      {/* Page Heading */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="w-full min-w-0"
      >
        <p className="eyebrow">SPOC Dashboard</p>

        <h1
          className="
            mt-2
            text-2xl
            font-bold
            leading-tight
            tracking-tight
            text-ink
            sm:text-3xl
          "
        >
          Internship Applications
        </h1>

        <p
          className="
            mt-2
            w-full
            max-w-2xl
            wrap-break-word
            text-sm
            leading-6
            text-ink-muted
            sm:text-base
          "
        >
          Review company-wise applications forwarded by the Department TPO after
          the application deadline.
        </p>
      </motion.section>

      {/* Statistics */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          grid
          w-full
          min-w-0
          grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]
          items-stretch
          gap-4
        "
      >
        <SPOCStatCard
          title="Pending Review"
          value="4"
          description="Applications awaiting SPOC action"
          icon={ClipboardCheck}
        />

        <SPOCStatCard
          title="Companies"
          value="12"
          description="Company applications received"
          icon={Building2}
        />

        <SPOCStatCard
          title="Selected Students"
          value="37"
          description="Students across applications"
          icon={UsersRound}
        />

        <SPOCStatCard
          title="NOCs Generated"
          value="8"
          description="Applications approved by SPOC"
          icon={FileCheck2}
        />
      </motion.section>

      {/* Workflow Summary */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full
          min-w-0
          sm:mt-8
        "
      >
        <Card
          className="
            w-full
            min-w-0
            max-w-full
            border-brand-200
            bg-brand-50
            shadow-none
          "
        >
          <Card.Content
            className="
              w-full
              min-w-0
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex
                w-full
                min-w-0
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div className="min-w-0 flex-1 p-2">
                <p className="p-2 text-sm font-semibold text-brand-900">
                  SPOC Review Rule
                </p>

                <p
                  className="
                    mt-1
                    w-full
                    max-w-3xl
                    wrap-break-word
                    text-xs
                    leading-5
                    text-brand-700
                    sm:text-sm
                  "
                >
                  Applications become available to the SPOC only after the
                  Department TPO deadline has ended and the Department TPO has
                  forwarded the application.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="
                  w-full
                  shrink-0
                  border-brand-300
                  bg-transparent
                  text-brand-700
                  hover:bg-brand-100
                  focus-visible:ring-brand-600
                  lg:w-auto
                "
              >
                View Workflow
              </Button>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* Company Applications */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full
          min-w-0
          sm:mt-8
        "
      >
        {/* Section Header */}
        <div
          className="
            flex
            w-full
            min-w-0
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-lg
                font-bold
                leading-tight
                text-ink
                sm:text-xl
              "
            >
              Company Applications
            </h2>

            <p
              className="
                mt-1
                wrap-break-word
                text-xs
                leading-5
                text-ink-muted
                sm:text-sm
              "
            >
              Applications are merged by company for SPOC review.
            </p>
          </div>

          <p
            className="
              shrink-0
              text-xs
              font-medium
              text-ink-muted
            "
          >
            {applications.length} applications
          </p>
        </div>

        {/* Applications Grid */}
        <div
          className="
            mt-4
            grid
            w-full
            min-w-0
            grid-cols-1
            items-stretch
            gap-4
            lg:grid-cols-2
          "
        >
          {applications.map((application) => (
            <div
              key={application.id}
              className="
                flex
                h-full
                min-w-0
                w-full
                max-w-full
                items-stretch
              "
            >
              <div
                className="
                  flex
                  h-full
                  min-w-0
                  w-full
                  max-w-full
                  [&>div]:h-full
                "
              >
                <CompanyApplicationCard
                  application={application}
                  onView={handleViewApplication}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SPOCDashboard;
