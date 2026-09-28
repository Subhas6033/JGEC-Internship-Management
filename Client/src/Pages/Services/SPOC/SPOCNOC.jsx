import { CheckCircle2, FileCheck2, Files, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../Components/index";
import NocCard from "../../../Components/SPOC/NOCCard";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";

const generatedNOCs = [
  {
    id: "NOC-001",
    referenceNumber: "TNP/JGEC/INT/IT/2023/SEPT/005",
    company: "TakeUForward",
    location: "Bengaluru",
    department: "Computer Science & Engineering",
    generatedDate: "28 Sep 2026",

    students: [
      {
        id: "STU-004",
        name: "Priya Sharma",
        rollNo: "ECE-21-005",
      },
      {
        id: "STU-005",
        name: "Arjun Sen",
        rollNo: "CSE-21-019",
      },
    ],
  },

  {
    id: "NOC-002",
    referenceNumber: "TNP/JGEC/INT/CSE/2023/SEPT/004",
    company: "Infosys",
    location: "Pune",
    department: "Computer Science & Engineering",
    generatedDate: "27 Sep 2026",

    students: [
      {
        id: "STU-006",
        name: "Riya Das",
        rollNo: "CSE-21-025",
      },
      {
        id: "STU-007",
        name: "Aditya Roy",
        rollNo: "CSE-21-031",
      },
      {
        id: "STU-008",
        name: "Sneha Paul",
        rollNo: "CSE-21-042",
      },
    ],
  },

  {
    id: "NOC-003",
    referenceNumber: "TNP/JGEC/INT/ECE/2023/SEPT/003",
    company: "Tata Consultancy Services",
    location: "Kolkata",
    department: "Electronics & Communication Engineering",
    generatedDate: "25 Sep 2026",

    students: [
      {
        id: "STU-009",
        name: "Rahul Ghosh",
        rollNo: "ECE-21-012",
      },
      {
        id: "STU-010",
        name: "Moumita Sen",
        rollNo: "ECE-21-027",
      },
    ],
  },

  {
    id: "NOC-004",
    referenceNumber: "TNP/JGEC/INT/IT/2023/SEPT/002",
    company: "Wipro",
    location: "Bengaluru",
    department: "Information Technology",
    generatedDate: "23 Sep 2026",

    students: [
      {
        id: "STU-011",
        name: "Sayan Ghosh",
        rollNo: "IT-21-009",
      },
    ],
  },
];

const SPOCNOCs = () => {
  const handleViewNOC = (noc) => {
    console.log("View NOC:", noc);
  };

  const handleDownloadNOC = (noc) => {
    console.log("Download NOC:", noc);
  };

  const totalStudents = generatedNOCs.reduce(
    (total, noc) => total + noc.students.length,
    0,
  );

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
        px-4 py-5
        sm:px-6 sm:py-6
        lg:px-8 lg:py-8
      "
    >
      {/* Page Heading */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="w-full min-w-0"
      >
        <p className="eyebrow">SPOC NOCs</p>

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
          Generated NOCs
        </h1>

        <p
          className="
            mt-2
            w-full
            max-w-2xl
            text-sm
            leading-6
            text-ink-muted
            sm:text-base
          "
        >
          View and manage the No Objection Certificates generated for approved
          company applications.
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
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="p-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-muted sm:text-sm">
                  NOCs Generated
                </p>

                <p className="mt-1 text-2xl font-bold text-ink">
                  {generatedNOCs.length}
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Approved applications
                </p>
              </div>

              <span
                className="
                  flex size-10 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-brand-100
                  text-brand-700
                "
              >
                <FileCheck2 size={19} />
              </span>
            </div>
          </Card.Content>
        </Card>

        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="p-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-muted sm:text-sm">
                  Companies
                </p>

                <p className="mt-1 text-2xl font-bold text-ink">
                  {generatedNOCs.length}
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Companies with generated NOCs
                </p>
              </div>

              <span
                className="
                  flex size-10 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-brand-100
                  text-brand-700
                "
              >
                <Files size={19} />
              </span>
            </div>
          </Card.Content>
        </Card>

        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="p-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-muted sm:text-sm">
                  Students
                </p>

                <p className="mt-1 text-2xl font-bold text-ink">
                  {totalStudents}
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Students covered by NOCs
                </p>
              </div>

              <span
                className="
                  flex size-10 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-brand-100
                  text-brand-700
                "
              >
                <UsersRound size={19} />
              </span>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* NOC Information */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="mt-6 w-full min-w-0 sm:mt-8"
      >
        <Card
          className="
            w-full
            min-w-0
            border-brand-200
            bg-brand-50
            shadow-none
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div
              className="
                p-2
                flex
                min-w-0
                flex-col
                gap-3
                sm:flex-row
                sm:items-start
              "
            >
              <span
                className="
                  flex size-9 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-brand-100
                  text-brand-700
                "
              >
                <CheckCircle2 size={18} />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-900">
                  NOC Generation Completed
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-brand-700
                    sm:text-sm
                  "
                >
                  These NOCs were generated after the corresponding company
                  applications were approved by the SPOC.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* NOC List */}
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
              NOC Records
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-ink-muted
                sm:text-sm
              "
            >
              Company-wise generated NOC records.
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
            {generatedNOCs.length} NOCs
          </p>
        </div>

        <div
          className="
            mt-4
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-4
            xl:grid-cols-2
            xl:items-stretch
          "
        >
          {generatedNOCs.map((noc) => (
            <div
              key={noc.id}
              className="
                flex
                w-full
                min-w-0
              "
            >
              <NocCard
                noc={noc}
                onView={handleViewNOC}
                onDownload={handleDownloadNOC}
              />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default SPOCNOCs;
