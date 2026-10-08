import PDFDocument from "pdfkit";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const safeValue = (value, fallback = "—") => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }

  return String(value).trim();
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getOrganisationName = (organisation) => {
  return (
    organisation?.name ||
    organisation?.organisationName ||
    organisation?.companyName ||
    "Organisation"
  );
};

const getOrganisationEmail = (organisation) => {
  return organisation?.email || organisation?.contactEmail || "";
};

const getOrganisationPhone = (organisation) => {
  return (
    organisation?.phone ||
    organisation?.contactNumber ||
    organisation?.mobileNumber ||
    ""
  );
};

const getOrganisationAddress = (organisation) => {
  const parts = [
    organisation?.address,
    organisation?.city,
    organisation?.state,
    organisation?.pincode,
  ].filter(Boolean);

  return parts.join(", ");
};

/* -------------------------------------------------------------------------- */
/* PDF GENERATOR                                                              */
/* -------------------------------------------------------------------------- */

export const generateNocPdf = ({ noc, application, student, organisation }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 45,
          bottom: 45,
          left: 55,
          right: 55,
        },
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      /* -------------------------------------------------------------------- */
      /* HEADER                                                               */
      /* -------------------------------------------------------------------- */

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("JALPAIGURI GOVERNMENT ENGINEERING COLLEGE", {
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("GOVERNMENT OF WEST BENGAL", {
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("TRAINING AND PLACEMENT CELL", {
          align: "center",
        });

      doc.font("Helvetica").fontSize(9).text("JALPAIGURI-735102", {
        align: "center",
      });

      doc.moveDown(1.5);

      /* -------------------------------------------------------------------- */
      /* REFERENCE + DATE                                                     */
      /* -------------------------------------------------------------------- */

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`Ref No: ${safeValue(noc.referenceNumber)}`, {
          continued: true,
        });

      doc.font("Helvetica").text(`    Date: ${formatDate(noc.generatedAt)}`, {
        align: "left",
      });

      doc.moveDown(1.2);

      /* -------------------------------------------------------------------- */
      /* RECIPIENT                                                             */
      /* -------------------------------------------------------------------- */

      const organisationName = getOrganisationName(organisation);
      const organisationAddress = getOrganisationAddress(organisation);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
          safeValue(
            organisation?.contactPersonDesignation ||
              organisation?.contactPersonRole,
            "Head Technical Service Department",
          ),
        );

      doc.font("Helvetica").fontSize(10).text(organisationName);

      if (organisationAddress) {
        doc.text(organisationAddress);
      }

      if (getOrganisationEmail(organisation)) {
        doc.text(getOrganisationEmail(organisation));
      }

      if (getOrganisationPhone(organisation)) {
        doc.text(getOrganisationPhone(organisation));
      }

      doc.moveDown(1);

      /* -------------------------------------------------------------------- */
      /* SUBJECT                                                               */
      /* -------------------------------------------------------------------- */

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
          "Subject: Request for granting permission to undertake Training/Internship program",
        );

      doc.moveDown(1);

      /* -------------------------------------------------------------------- */
      /* SALUTATION                                                            */
      /* -------------------------------------------------------------------- */

      doc.font("Helvetica").fontSize(10).text("Dear Sir/Madam,");

      doc.moveDown(0.8);

      /* -------------------------------------------------------------------- */
      /* INTRODUCTION                                                          */
      /* -------------------------------------------------------------------- */

      doc.text("Greetings from Jalpaiguri Government Engineering College!", {
        lineGap: 2,
      });

      doc.moveDown(0.5);

      /* -------------------------------------------------------------------- */
      /* INTERNSHIP BODY                                                       */
      /* -------------------------------------------------------------------- */

      const studentName = safeValue(student?.fullName);
      const department = safeValue(
        student?.department?.name ||
          student?.department ||
          application?.department,
      );

      const semester = safeValue(student?.semester || application?.semester);

      const batch = safeValue(student?.batch || application?.batch, "");

      const startDate = formatDate(application?.startDate);
      const endDate = formatDate(application?.endDate);

      const academicYearText = batch ? ` (${batch} Batch)` : "";

      const bodyText =
        `We would like to inform you that, the following student from ` +
        `Jalpaiguri Government Engineering College, currently studying ` +
        `${semester !== "—" ? `${semester} Semester, ` : ""}` +
        `Department of ${department}${academicYearText}, wishes to undertake ` +
        `their Internship/Training programme at your esteemed organization ` +
        `from ${startDate} to ${endDate}. This Internship/Training Program ` +
        `is an integral part of their B. Tech Program curriculum and aims to ` +
        `impart industry & research-oriented learning. We are confident that, ` +
        `your esteemed organization will offer them valuable practical exposure.`;

      doc.text(bodyText, {
        align: "justify",
        lineGap: 3,
      });

      doc.moveDown(0.8);

      doc.text(
        "Hence, we kindly request you to grant them permission to undertake " +
          "the aforesaid Internship / Training programme at your prestigious " +
          "organization and we shall be grateful for your co-operation.",
        {
          align: "justify",
          lineGap: 3,
        },
      );

      doc.moveDown(1);

      /* -------------------------------------------------------------------- */
      /* STUDENT DETAILS                                                      */
      /* -------------------------------------------------------------------- */

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("The details of the student are as follows:");

      doc.moveDown(0.7);

      const tableX = 55;
      const tableWidth = 485;

      const columns = [
        {
          title: "Name of the Student",
          value: studentName,
          width: 95,
        },
        {
          title: "Email-Id",
          value: safeValue(student?.email),
          width: 90,
        },
        {
          title: "Sem",
          value: semester,
          width: 45,
        },
        {
          title: "Roll No.",
          value: safeValue(student?.rollNumber),
          width: 65,
        },
        {
          title: "Contact No.\n(Student)",
          value: safeValue(student?.mobileNumber),
          width: 65,
        },
        {
          title: "Guardian's Name",
          value: safeValue(student?.guardianName),
          width: 75,
        },
        {
          title: "Contact\n(Guardian)",
          value: safeValue(student?.guardianMobile),
          width: 50,
        },
      ];

      const headerHeight = 45;
      const rowHeight = 60;

      let currentX = tableX;

      /* Header */
      doc.rect(tableX, doc.y, tableWidth, headerHeight).stroke();

      columns.forEach((column) => {
        doc.rect(currentX, doc.y, column.width, headerHeight).stroke();

        doc
          .font("Helvetica-Bold")
          .fontSize(6.5)
          .text(column.title, currentX + 3, doc.y + 5, {
            width: column.width - 6,
            height: headerHeight - 8,
            align: "center",
          });

        currentX += column.width;
      });

      const rowTop = doc.y + headerHeight;

      currentX = tableX;

      columns.forEach((column) => {
        doc.rect(currentX, rowTop, column.width, rowHeight).stroke();

        doc
          .font("Helvetica")
          .fontSize(6.5)
          .text(column.value, currentX + 3, rowTop + 8, {
            width: column.width - 6,
            height: rowHeight - 12,
            align: "center",
            lineGap: 1,
          });

        currentX += column.width;
      });

      doc.y = rowTop + rowHeight + 25;

      /* -------------------------------------------------------------------- */
      /* CLOSING                                                              */
      /* -------------------------------------------------------------------- */

      doc.font("Helvetica").fontSize(10).text("Best regards.");

      doc.moveDown(2);

      doc
        .font("Helvetica")
        .text("---------------------------------------------");

      doc
        .font("Helvetica-Bold")
        .text("Departmental Training and Placement Coordinator");

      doc
        .font("Helvetica")
        .text("---------------------------------------------");

      doc.moveDown(0.5);

      doc.font("Helvetica-Bold").text("Sandipan Ganguly");

      doc.font("Helvetica").text("Training & Placement Coordinator,");

      doc.text("Jalpaiguri Government Engineering College");

      doc.text("+91-7319579443 | training@jgec.ac.in");

      doc.text("SPOC regarding Training and Internship");

      doc.moveDown(1);

      /* -------------------------------------------------------------------- */
      /* COPY TO                                                              */
      /* -------------------------------------------------------------------- */

      doc.font("Helvetica-Bold").text("Copy to:");

      doc
        .font("Helvetica")
        .text(
          "Dr. Samir Das; Head, Training & Placement Cell; " +
            "Jalpaiguri Government Engineering College",
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
