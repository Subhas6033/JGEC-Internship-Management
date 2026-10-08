import {
  CheckCircle2,
  FileCheck2,
  Files,
  UsersRound,
  Eye,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "../../../Components/index";

import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";

import {
  useDownloadSpocNoc,
  useViewSpocNoc,
  useSpocApplications,
} from "../../../Services/Queries/spocApplication.quires";

const SPOCNOCs = () => {
  const { data, isLoading, isError, error } = useSpocApplications({
    status: "noc_generated",
  });

  const { mutateAsync: downloadNoc, isPending: isDownloadingNoc } =
    useDownloadSpocNoc();

  const { mutateAsync: viewNoc, isPending: isViewingNoc } = useViewSpocNoc();

  const applications = Array.isArray(data) ? data : data?.applications || [];

  /* ---------------------------------------------------------------------- */
  /* Convert applications into NOC records                                  */
  /* ---------------------------------------------------------------------- */

  const generatedNOCs = applications
    .filter((application) => application.status === "noc_generated")
    .map((application) => {
      const organisation = application.organisation || {};

      const student = application.student || {};

      const noc = application.noc || {};

      return {
        id: noc._id || `NOC-${application._id}`,

        applicationId: application._id,

        referenceNumber:
          noc.referenceNumber || application.nocReference || "N/A",

        company:
          organisation.organisationName ||
          organisation.name ||
          organisation.companyName ||
          "Unknown Company",

        location:
          organisation.organisationLocation ||
          organisation.location ||
          organisation.city ||
          "Location not available",

        department: student.department || student.departmentCode || "N/A",

        generatedDate:
          noc.generatedAt ||
          noc.createdAt ||
          application.nocGeneratedAt ||
          application.updatedAt ||
          null,

        generatedAt:
          noc.generatedAt ||
          noc.createdAt ||
          application.nocGeneratedAt ||
          application.updatedAt ||
          null,

        students: [
          {
            id: student._id || student.id,

            name: student.fullName || student.name || "Unknown Student",

            rollNo: student.rollNumber || student.rollNo || "N/A",

            rollNumber: student.rollNumber || student.rollNo || "N/A",

            department: student.department || student.departmentCode || "N/A",
          },
        ],

        application,
      };
    });

  /* ---------------------------------------------------------------------- */
  /* Statistics                                                              */
  /* ---------------------------------------------------------------------- */

  const totalStudents = generatedNOCs.reduce(
    (total, noc) => total + (noc.students?.length || 0),
    0,
  );

  const companies = new Set(
    generatedNOCs.map((noc) => noc.company).filter(Boolean),
  ).size;

  /* ---------------------------------------------------------------------- */
  /* Actions                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleViewNOC = async (noc) => {
    const applicationId = noc?.applicationId;

    if (!applicationId) {
      console.error("Cannot open NOC: application ID is missing.");
      return;
    }

    try {
      const blob = await viewNoc(applicationId);

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid NOC PDF response");
      }

      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], {
              type: "application/pdf",
            });

      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = pdfUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);

      link.click();

      link.remove();

      // Give the browser enough time to load the PDF
      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 60_000);
    } catch (err) {
      console.error("Failed to open NOC:", err);

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to open the generated NOC.",
      );
    }
  };

  const handleDownloadNOC = async (noc) => {
    const applicationId = noc?.applicationId;

    if (!applicationId) {
      console.error("Cannot download NOC: application ID is missing.");
      return;
    }

    try {
      await downloadNoc({
        applicationId,

        filename:
          noc?.fileName || `NOC-${noc?.referenceNumber || applicationId}.pdf`,
      });
    } catch (err) {
      console.error("Failed to download NOC:", err);

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to download the generated NOC.",
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-sm text-ink-muted">Loading generated NOCs...</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                   */
  /* ---------------------------------------------------------------------- */

  if (isError) {
    return (
      <div className="px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <Card.Content className="p-6">
            <p className="text-sm font-semibold text-red-700">
              Failed to load NOCs
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"}
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

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
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}

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
          internship applications.
        </p>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* Statistics                                                        */}
      {/* ---------------------------------------------------------------- */}

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
        {/* NOCs */}

        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
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

        {/* Companies */}

        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-muted sm:text-sm">
                  Companies
                </p>

                <p className="mt-1 text-2xl font-bold text-ink">{companies}</p>

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

        {/* Students */}

        <Card
          className="
            min-w-0
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
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

      {/* ---------------------------------------------------------------- */}
      {/* Information                                                       */}
      {/* ---------------------------------------------------------------- */}

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
                  These NOCs were generated after the corresponding internship
                  applications were approved by the SPOC.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* NOC records                                                       */}
      {/* ---------------------------------------------------------------- */}

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
            {generatedNOCs.length} {generatedNOCs.length === 1 ? "NOC" : "NOCs"}
          </p>
        </div>

        {generatedNOCs.length > 0 ? (
          <div className="mt-4 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-card)">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-cream-soft">
                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Reference No.
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Student
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Roll No.
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Department
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Organisation
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Location
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Generated Date
                    </th>

                    <th
                      className="
                        px-4 py-3
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-ink-muted
                      "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {generatedNOCs.map((noc) => {
                    const student = noc.students?.[0] || {};

                    const generatedDate = noc.generatedDate
                      ? new Date(noc.generatedDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "N/A";

                    return (
                      <tr
                        key={noc.id}
                        className="
                          border-b
                          border-border
                          last:border-b-0
                          transition-colors
                          hover:bg-cream-soft/60
                        "
                      >
                        {/* Reference */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="text-sm font-semibold text-ink">
                            {noc.referenceNumber}
                          </span>
                        </td>

                        {/* Student */}

                        <td className="px-4 py-4">
                          <div className="min-w-[160px]">
                            <p className="text-sm font-semibold text-ink">
                              {student.name || "Unknown Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-ink-muted">
                              {student.rollNumber || "N/A"}
                            </p>
                          </div>
                        </td>

                        {/* Roll number */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="text-sm text-ink">
                            {student.rollNumber || student.rollNo || "N/A"}
                          </span>
                        </td>

                        {/* Department */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-brand-50
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              text-brand-700
                            "
                          >
                            {student.department || noc.department || "N/A"}
                          </span>
                        </td>

                        {/* Organisation */}

                        <td className="px-4 py-4">
                          <p className="min-w-[180px] text-sm font-medium text-ink">
                            {noc.company}
                          </p>
                        </td>

                        {/* Location */}

                        <td className="px-4 py-4">
                          <span className="block min-w-[150px] text-sm text-ink-muted">
                            {noc.location}
                          </span>
                        </td>

                        {/* Generated date */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="text-sm text-ink">
                            {generatedDate}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewNOC(noc)}
                              disabled={isViewingNoc}
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-border
                                bg-surface
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-ink
                                transition
                                hover:bg-cream-soft
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="View NOC"
                            >
                              <Eye size={15} />

                              {isViewingNoc ? "Opening..." : "View"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadNOC(noc)}
                              disabled={isDownloadingNoc}
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-brand-600
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-brand-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Download NOC"
                            >
                              <Download size={15} />

                              {isDownloadingNoc ? "Downloading..." : "Download"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="mt-4 border-border bg-surface">
            <Card.Content
              className="
                flex
                min-h-40
                flex-col
                items-center
                justify-center
                p-6
                text-center
              "
            >
              <div
                className="
                  flex size-11
                  items-center justify-center
                  rounded-full
                  bg-cream-dark
                  text-ink-muted
                "
              >
                <FileCheck2 size={19} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-ink">
                No NOCs generated
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-ink-muted">
                NOCs will appear here after the SPOC approves internship
                applications.
              </p>
            </Card.Content>
          </Card>
        )}
      </motion.section>
    </motion.div>
  );
};

export default SPOCNOCs;
