import PDFDocument from "pdfkit";
import crypto from "crypto";
import { uploadToCloudinary } from "../../upload/uploadOnCloudinary.upload.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { StudentNOC } from "../../models/studentNoc.models.js";
import { StudentDocument } from "../../models/studentDocument.models.js";

const ACCEPTED_STATUSES = ["approved_by_spoc", "accepted"];

const getStudentName = (student) =>
  student?.fullName || student?.name || student?.studentName || "Student";

const getStudentRollNumber = (student) =>
  student?.rollNumber ||
  student?.registrationNumber ||
  student?.studentId ||
  "N/A";

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Create PDF buffer for NOC.
 */
const createPdfBuffer = ({
  student,
  application,
  organisation,
  signatureUrl,
}) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 55,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    const studentName = getStudentName(student);
    const rollNumber = getStudentRollNumber(student);

    const organisationName =
      organisation?.organisationName ||
      organisation?.name ||
      organisation?.organisation ||
      "the concerned organisation";

    const designation = application?.designation || "an intern";

    const workLocations =
      application?.tentativeWorkLocations?.length > 0
        ? application.tentativeWorkLocations.join(", ")
        : "Not specified";

    /*
     * Header
     */
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("JALPAIGURI GOVERNMENT ENGINEERING COLLEGE", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc.fontSize(10).font("Helvetica").text("Internship Management Portal", {
      align: "center",
    });

    doc.moveDown(1.5);

    /*
     * NOC heading
     */
    doc.fontSize(14).font("Helvetica-Bold").text("NO OBJECTION CERTIFICATE", {
      align: "center",
      underline: true,
    });

    doc.moveDown(1.5);

    /*
     * Student statement
     */
    doc
      .fontSize(11)
      .font("Helvetica")
      .text(
        `This is to certify that ${studentName}, Roll/Registration No. ${rollNumber}, is a student of Jalpaiguri Government Engineering College.`,
        {
          align: "justify",
          lineGap: 6,
        },
      );

    doc.moveDown(1);

    /*
     * Organisation statement
     */
    doc.text(
      `The college has no objection to the student undertaking an internship with ${organisationName} as ${designation}.`,
      {
        align: "justify",
        lineGap: 6,
      },
    );

    doc.moveDown(1);

    /*
     * Internship period
     */
    doc.text(
      `The proposed internship period is from ${formatDate(
        application?.tentativeStartDate,
      )} to ${formatDate(application?.tentativeEndDate)}.`,
      {
        lineGap: 6,
      },
    );

    doc.moveDown(1);

    /*
     * Work location
     */
    doc.text(`Work location: ${workLocations}.`, {
      lineGap: 6,
    });

    doc.moveDown(1);

    /*
     * Internship mode/type
     */
    doc.text(
      `Internship type: ${application?.internshipType || "Not specified"}.`,
      {
        lineGap: 6,
      },
    );

    doc.text(
      `Mode of internship: ${
        application?.modeOfInternship || "Not specified"
      }.`,
      {
        lineGap: 6,
      },
    );

    doc.moveDown(2);

    /*
     * Final statement
     */
    doc.text(
      "This certificate is issued after completion of the required internship application verification and approval process.",
      {
        align: "justify",
        lineGap: 6,
      },
    );

    doc.moveDown(3);

    /*
     * Signature
     */
    if (signatureUrl) {
      try {
        doc.fontSize(10).font("Helvetica").text("Student Signature:");

        doc.moveDown(0.5);

        doc.image(signatureUrl, {
          fit: [120, 60],
          align: "left",
        });
      } catch {
        /*
         * Signature is optional.
         * PDF generation should continue even
         * if the signature cannot be embedded.
         */
      }
    } else {
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Student Signature: ____________________");
    }

    doc.moveDown(2);

    /*
     * Generated information
     */
    doc.font("Helvetica-Bold").fontSize(10).text("Generated on:");

    doc.font("Helvetica").fontSize(10).text(formatDate(new Date()));

    doc.moveDown(3);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Jalpaiguri Government Engineering College");

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("gray")
      .text(
        "Digitally generated through the JGEC Internship Management Portal.",
        {
          align: "center",
        },
      );

    doc.end();
  });

/**
 * Generate or regenerate NOC for an accepted application.
 */
export const generateNOCForApplication = async (applicationId) => {
  const application = await StudentApplication.findById(applicationId)
    .populate("student")
    .populate("organisation");

  if (!application) {
    throw new Error("Application not found");
  }

  /*
   * NOC can only be generated after final approval.
   */
  if (!ACCEPTED_STATUSES.includes(application.status)) {
    throw new Error("NOC can only be generated for an accepted application");
  }

  /*
   * Student document containing signature.
   */
  const studentDocument = await StudentDocument.findOne({
    student: application.student._id,
  }).lean();

  /*
   * Check whether an NOC already exists.
   */
  const existingNoc = await StudentNOC.findOne({
    application: application._id,
  });

  /*
   * Every regeneration creates a new version.
   */
  const version = existingNoc ? existingNoc.version + 1 : 1;

  /*
   * Keep the same NOC ID when regenerating.
   */
  const nocId =
    existingNoc?.nocId ||
    `NOC-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  const fileName = `${nocId}.pdf`;

  /*
   * Generate PDF.
   */
  const pdfBuffer = await createPdfBuffer({
    student: application.student,
    application,
    organisation: application.organisation,
    signatureUrl: studentDocument?.signature?.url || null,
  });

  /*
   * Cloudinary public ID.
   *
   * Version is included so a regenerated NOC
   * does not overwrite the previous Cloudinary file.
   */
  const publicId = `${application.student._id}/${nocId}-v${version}`;

  /*
   * IMPORTANT:
   *
   * Reuse the project's existing Cloudinary uploader.
   *
   * "pdf" is automatically converted to
   * resource_type: "raw" by uploadToCloudinary().
   */
  const uploaded = await uploadToCloudinary(
    pdfBuffer,
    "pdf",
    process.env.CLOUDINARY_FOLDER
      ? `${process.env.CLOUDINARY_FOLDER}/noc`
      : "jgec-internship/noc",
    publicId,
  );

  /*
   * Update existing NOC.
   */
  if (existingNoc) {
    existingNoc.fileName = fileName;
    existingNoc.url = uploaded.secure_url;
    existingNoc.publicId = uploaded.public_id;
    existingNoc.version = version;
    existingNoc.generatedAt = new Date();
    existingNoc.generatedForStatus = application.status;

    await existingNoc.save();

    return existingNoc;
  }

  /*
   * Create first NOC.
   */
  return StudentNOC.create({
    application: application._id,
    student: application.student._id,

    nocId,

    fileName,

    url: uploaded.secure_url,

    publicId: uploaded.public_id,

    generatedAt: new Date(),

    version,

    generatedForStatus: application.status,
  });
};
