import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import path from "node:path";

/* -------------------------------------------------------------------------- */
/* Static fallbacks                                                           */
/* -------------------------------------------------------------------------- */

const COLLEGE_NAME = "Jalpaiguri Government Engineering College";

const DEPARTMENT_NAMES = {
  CE: "Civil Engineering",
  CIVIL: "Civil Engineering",
  CSE: "Computer Science and Engineering",
  IT: "Information Technology",
  ECE: "Electronics and Communication Engineering",
  EE: "Electrical Engineering",
  ME: "Mechanical Engineering",
};

/* -------------------------------------------------------------------------- */
/* Generic helpers                                                            */
/* -------------------------------------------------------------------------- */

const safe = (value, fallback = "-") =>
  value === undefined || value === null || value === ""
    ? fallback
    : String(value);

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const ordinal = (number) => {
  const n = Number(number);
  if (!Number.isFinite(n)) return "";

  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isValidDate = (date) => date && !Number.isNaN(new Date(date).getTime());

/*
 * Internship dates are stored as midnight UTC (e.g. 2026-10-08T00:00:00.000Z),
 * so they are formatted with UTC getters.
 */

/** "October 23rd" */
const formatMonthDay = (date) => {
  const d = new Date(date);
  return `${MONTHS[d.getUTCMonth()]} ${ordinal(d.getUTCDate())}`;
};

/** "23/10/26" */
const formatShortDate = (date) => {
  const d = new Date(date);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

/** Letter date (a real timestamp) in IST: { day, month, year } */
const splitDateIST = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(isValidDate(date) ? new Date(date) : new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;

  return { day: get("day"), month: get("month"), year: get("year") };
};

const getSemesterNumber = (semester) => {
  const n = Number(String(semester ?? "").replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const formatSemester = (semester) => {
  const n = getSemesterNumber(semester);
  return n ? `${ordinal(n)} Semester` : safe(semester);
};

/** Sem 7/8 -> "4th year" */
const getYearText = (semester) => {
  const n = getSemesterNumber(semester);
  return n ? `${ordinal(Math.ceil(n / 2))} year` : "";
};

/**
 * Batch, e.g. "2023-2027".
 *
 * Semester mapping:
 *   1/2 -> 1st year
 *   3/4 -> 2nd year
 *   5/6 -> 3rd year
 *   7/8 -> 4th year
 *
 * The admission year is derived from the academic year containing the
 * internship/reference date.
 */
const getBatch = ({ student, application, semester, referenceDate }) => {
  const sem = getSemesterNumber(semester);

  if (sem && isValidDate(referenceDate)) {
    const d = new Date(referenceDate);

    const academicStart =
      d.getUTCMonth() >= 6 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;

    const yearNumber = Math.ceil(sem / 2);

    const admissionYear = academicStart - (yearNumber - 1);

    return `${admissionYear}-${admissionYear + 4}`;
  }

  const explicit = firstValue(
    student?.batch,
    student?.batchYear,
    student?.academicBatch,
    application?.batch,
    application?.batchYear,
  );

  return explicit ? String(explicit) : "-";
};

const getDepartmentName = (department) => {
  const raw = String(department || "").trim();

  if (!raw) return "-";

  return DEPARTMENT_NAMES[raw.toUpperCase()] || raw;
};

/* -------------------------------------------------------------------------- */
/* People (SPOC / TPO)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Normalises a populated SPOC / TPO document.
 *
 * Both schemas use:
 *   fullName
 *   email
 *   mobile
 *   department
 *   role
 *
 * A bare ObjectId (not populated) returns null.
 */
const getPerson = (user) => {
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    return null;
  }

  const name = firstValue(user.fullName, user.name);

  if (!name) return null;

  return {
    name: String(name),

    mobile: safe(
      firstValue(
        user.mobile,
        user.mobileNumber,
        user.phone,
        user.contactNumber,
      ),
      "",
    ),

    email: safe(user.email, ""),

    department: safe(user.department, ""),

    role: safe(user.role, "").toLowerCase(),
  };
};

const formatPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 10) {
    return `+91-${digits}`;
  }

  return String(phone);
};

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

const detectImageType = (buffer) => {
  if (!buffer || buffer.length < 4) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return "jpeg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  return null;
};

/** Converts to PNG with `sharp` if it is installed (optional dependency). */
const convertToPng = async (buffer) => {
  try {
    const { default: sharp } = await import("sharp");

    return await sharp(buffer).png().toBuffer();
  } catch {
    return null;
  }
};

/**
 * Returns a buffer pdfkit can embed (JPEG/PNG), or null.
 *
 * If `sharp` is installed it is used to normalise any image
 * (WebP, CMYK or progressive JPEG, wrongly named files, ...)
 * to PNG.
 */
const normalizeImage = async (buffer, label = "image") => {
  if (!buffer) return null;

  const png = await convertToPng(buffer);

  if (png) return png;

  if (detectImageType(buffer)) {
    return buffer;
  }

  console.error(
    `${label}: unsupported image format. pdfkit only supports JPEG and PNG - ` +
      `convert the file, or run "npm i sharp" to convert automatically.`,
  );

  return null;
};

/* ---- Local assets (logos) ---- */

const stripExtension = (name) => name.replace(/\.[^.]+$/, "").toLowerCase();

/**
 * "/public/logo.jpg" in a .env file is an absolute filesystem path,
 * so we try it as given and also as project-relative.
 */
const assetCandidates = (configured, fallback) => {
  const value = String(configured || fallback).trim();

  const projectRelative = path.resolve(
    process.cwd(),
    value.replace(/^[/\\]+/, ""),
  );

  return path.isAbsolute(value) ? [value, projectRelative] : [projectRelative];
};

/**
 * Reads the first candidate that exists.
 *
 * If the exact file name is not found it also looks in the same folder
 * for a file with the same base name but a different case / extension.
 */
const readFirstAvailable = async (candidates) => {
  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate);
    } catch {
      // fall through to fuzzy lookup
    }

    try {
      const directory = path.dirname(candidate);

      const wanted = stripExtension(path.basename(candidate));

      const entries = await fs.readdir(directory);

      const match = entries.find(
        (entry) =>
          stripExtension(entry) === wanted &&
          /\.(jpe?g|png|webp|gif|avif)$/i.test(entry),
      );

      if (match) {
        return await fs.readFile(path.join(directory, match));
      }
    } catch {
      // directory missing - try next candidate
    }
  }

  console.error(`Image not found. Tried: ${candidates.join(", ")}`);

  return null;
};

const loadLocalImage = async (configured, fallback, label) =>
  normalizeImage(
    await readFirstAvailable(assetCandidates(configured, fallback)),
    label,
  );

/* ---- Student signature ---- */

const getStudentSignatureUrl = (student) => {
  if (!student) return null;

  const direct = firstValue(
    student.signatureUrl,
    student.signature?.url,
    student.signature,
    student.studentSignatureUrl,
    student.studentSignature,
  );

  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const documents = student.documents;

  if (!documents) return null;

  if (typeof documents.signature === "string" && documents.signature.trim()) {
    return documents.signature.trim();
  }

  if (typeof documents.signature?.url === "string") {
    return documents.signature.url;
  }

  if (typeof documents.studentSignature?.url === "string") {
    return documents.studentSignature.url;
  }

  if (
    typeof documents.studentSignature === "string" &&
    documents.studentSignature.trim()
  ) {
    return documents.studentSignature.trim();
  }

  if (Array.isArray(documents)) {
    const found = documents.find((document) =>
      String(
        document?.type ||
          document?.documentType ||
          document?.name ||
          document?.title ||
          "",
      )
        .toLowerCase()
        .includes("signature"),
    );

    if (found) {
      return (
        found.url ||
        found.secureUrl ||
        found.cloudinaryUrl ||
        found.fileUrl ||
        null
      );
    }
  }

  return null;
};

const downloadImage = async (url) => {
  if (!url) return null;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to download image: ${response.status}`);
    }

    return await normalizeImage(
      Buffer.from(await response.arrayBuffer()),
      "Student signature",
    );
  } catch (error) {
    console.error("Signature download failed:", error.message);

    return null;
  }
};

/* -------------------------------------------------------------------------- */
/* Drawing helpers                                                            */
/* -------------------------------------------------------------------------- */

const drawCell = ({
  doc,
  text,
  x,
  y,
  width,
  height,
  font = "Times-Roman",
  fontSize = 9,
  align = "center",
  padding = 3,
}) => {
  doc.lineWidth(0.8).rect(x, y, width, height).stroke();

  doc.font(font).fontSize(fontSize);

  const innerWidth = Math.max(width - padding * 2, 5);

  const textHeight = doc.heightOfString(safe(text), {
    width: innerWidth,
    align,
  });

  doc.text(
    safe(text),
    x + padding,
    y + Math.max(padding, (height - textHeight) / 2),
    {
      width: innerWidth,
      align,
    },
  );
};

const drawSignatureCell = ({ doc, buffer, x, y, width, height }) => {
  doc.lineWidth(0.8).rect(x, y, width, height).stroke();

  if (!buffer) return;

  try {
    doc.image(buffer, x + 4, y + 4, {
      fit: [width - 8, height - 8],
      align: "center",
      valign: "center",
    });
  } catch (error) {
    console.error("Unable to render student signature:", error.message);
  }
};

/**
 * Paragraph of mixed-style segments:
 * [{ text, font? }]
 *
 * Returns end y.
 */
const drawRichParagraph = (doc, segments, x, y, width, fontSize = 9.5) => {
  doc.fontSize(fontSize);

  segments.forEach((segment, index) => {
    doc.font(segment.font || "Times-Roman");

    const options = {
      width,
      align: "justify",
      lineGap: 2,
      continued: index < segments.length - 1,
    };

    if (index === 0) {
      doc.text(segment.text, x, y, options);
    } else {
      doc.text(segment.text, options);
    }
  });

  return doc.y;
};

/** Dashed line + name + lines. Returns the y after the block. */
const drawSignatory = ({
  doc,
  x,
  y,
  width,
  align,
  name,
  lines = [],
  boldContact,
}) => {
  const lineLen = 140;

  const lineStart =
    align === "center"
      ? x + width / 2 - lineLen / 2
      : align === "right"
        ? x + width - lineLen
        : x;

  doc
    .lineWidth(0.6)
    .dash(2, { space: 1.5 })
    .moveTo(lineStart, y)
    .lineTo(lineStart + lineLen, y)
    .stroke()
    .undash();

  let cy = y + 6;

  if (name) {
    doc.font("Times-Bold").fontSize(9).text(name, x, cy, {
      width,
      align,
    });

    cy += 11.5;
  }

  lines.filter(Boolean).forEach((line) => {
    doc.font("Times-Roman").fontSize(9).text(line, x, cy, {
      width,
      align,
    });

    cy += 11.5;
  });

  if (boldContact) {
    doc.font("Times-Bold").fontSize(9).text(boldContact, x, cy, {
      width,
      align,
    });

    cy += 11.5;
  }

  return cy;
};

/* -------------------------------------------------------------------------- */
/* Main PDF generator                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Generate the JGEC Training & Placement Cell internship permission (NOC) PDF.
 *
 * @param {Object}  params
 * @param {Object}  params.application
 * @param {Object} [params.noc]
 * @param {Object} [params.spoc]
 * @param {Object} [params.tpo]
 */
export const generateNocPdf = async ({
  noc,
  application: rawApplication,
  spoc: spocOverride,
  tpo: tpoOverride,
}) => {
  const application = rawApplication?.data ?? rawApplication ?? {};

  const nocData = noc || application.noc || {};

  const students =
    Array.isArray(application.students) && application.students.length
      ? application.students
      : [application.student || {}];

  const primary = students[0];

  const organisation = application.organisation || {};

  const isPlural = students.length > 1;

  /* ---------------------------------------------------------------------- */
  /* Dates                                                                  */
  /* ---------------------------------------------------------------------- */

  const startDate = firstValue(
    application.tentativeStartDate,
    application.startDate,
  );

  const endDate = firstValue(application.tentativeEndDate, application.endDate);

  let periodText = "-";
  let shortPeriod = "-";

  if (isValidDate(startDate) && isValidDate(endDate)) {
    const s = new Date(startDate);
    const e = new Date(endDate);

    periodText =
      s.getUTCFullYear() === e.getUTCFullYear()
        ? `${formatMonthDay(s)} to ${formatMonthDay(e)}, ${e.getUTCFullYear()}`
        : `${formatMonthDay(s)}, ${s.getUTCFullYear()} to ${formatMonthDay(
            e,
          )}, ${e.getUTCFullYear()}`;

    shortPeriod = `${formatShortDate(s)} - ${formatShortDate(e)}`;
  }

  const { day, month, year } = splitDateIST(
    firstValue(nocData.generatedAt, application.nocGeneratedAt),
  );

  /* ---------------------------------------------------------------------- */
  /* Student / academic details                                             */
  /* ---------------------------------------------------------------------- */

  const semesterRaw = firstValue(primary.semester, application.semester);

  const semesterText = formatSemester(semesterRaw);

  const yearText = getYearText(semesterRaw);

  const batch = getBatch({
    student: primary,
    application,
    semester: semesterRaw,
    referenceDate: startDate,
  });

  const department = getDepartmentName(
    firstValue(primary.department, application.department, nocData.department),
  );

  /* ---------------------------------------------------------------------- */
  /* Organisation                                                           */
  /* ---------------------------------------------------------------------- */

  const organisationName = safe(
    firstValue(
      organisation.organisationName,
      organisation.name,
      application.organisationName,
    ),
  );

  const organisationLocation = safe(
    firstValue(
      organisation.organisationLocation,
      organisation.location,
      organisation.address,
      application.organisationLocation,
    ),
    "",
  );

  /*
   * Do NOT hard-code:
   * "The Head of the Organisation"
   *
   * The designation must come from the student's application.
   */
  const addresseeLine = firstValue(
    application.designation,
    application.internshipDesignation,
    application.addresseeLine,
    application.addressee,
  );

  const addressLines = [
    organisationLocation && !/india/i.test(organisationLocation)
      ? `${organisationLocation}, India`
      : organisationLocation,
  ].filter(Boolean);

  /*
   * Organisation employee/contact comes from the application.
   */
  const contactName = firstValue(
    application.organisationsEmployye,
    application.organisationEmployee,
  );

  const designation = firstValue(
    application.designation,
    application.internshipDesignation,
  );

  const toLines = [
    addresseeLine,
    organisationName,
    ...addressLines,
    contactName ? `Attn: ${contactName}` : "",
  ].filter(Boolean);

  /* ---------------------------------------------------------------------- */
  /* SPOC / TPO                                                             */
  /* ---------------------------------------------------------------------- */

  /*
   * Prefer the actual reviewed users supplied by the application/NOC.
   *
   * No hard-coded:
   * - TPO name
   * - TPO mobile
   * - SPOC name
   * - SPOC mobile
   *
   * The Head of T&P Cell (Dr. Samir Das) is the only static signatory.
   */
  const populated = [
    application.spocReviewedBy,
    application.tpoReviewedBy,
    nocData.generatedBy,
  ]
    .map(getPerson)
    .filter(Boolean);

  const byRole = (role) => populated.find((person) => person.role === role);

  const spoc =
    getPerson(spocOverride) ||
    getPerson(application.spocReviewedBy) ||
    getPerson(application.spoc) ||
    byRole("spoc");

  const tpo =
    getPerson(tpoOverride) ||
    getPerson(application.tpoReviewedBy) ||
    getPerson(application.tpo) ||
    byRole("tpo");

  /* Static Head of T&P Cell */
  const HEAD_TNP = {
    name: "Dr. Samir Das",
    lines: ["Head, Training & Placement Cell", COLLEGE_NAME],
  };

  /* Left: Faculty Coordinator = TPO (name and details from DB) */
  const facultyBlock = {
    name: tpo?.name ? `Prof. ${tpo.name.replace(/^prof\.?\s*/i, "")}` : "",

    lines: [
      "Faculty Coordinator",

      tpo?.department
        ? `Department of ${getDepartmentName(tpo.department)}`
        : `Department of ${department}`,

      "Training and Placement Cell",

      COLLEGE_NAME,
    ],
  };

  /* Right: Coordinator, Internship & Training = SPOC (name and details from DB) */
  const spocContact = [formatPhone(spoc?.mobile), spoc?.email]
    .filter(Boolean)
    .join(" | ");

  const coordinatorBlock = {
    name: spoc?.name ? `Prof. ${spoc.name.replace(/^prof\.?\s*/i, "")}` : "",

    lines: [
      "Coordinator, Internship & Training",

      "Training and Placement Cell",

      COLLEGE_NAME,
    ],

    boldContact: spocContact,
  };

  if (!spoc) {
    console.warn(
      "NOC PDF: SPOC not resolved. Pass the actual SPOC document to " +
        "generateNocPdf or populate application.spocReviewedBy.",
    );
  }

  if (!tpo) {
    console.warn(
      "NOC PDF: TPO not resolved. Pass the actual TPO document to " +
        "generateNocPdf or populate application.tpoReviewedBy.",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Assets                                                                 */
  /* ---------------------------------------------------------------------- */

  /*
   * Env vars are read at call time so dotenv load order cannot break them.
   */
  const [collegeLogo, govtEmblem, signatureBuffers] = await Promise.all([
    loadLocalImage(
      process.env.NOC_COLLEGE_LOGO_PATH,
      "public/jgecLogo.jpg",
      "College logo",
    ),

    loadLocalImage(
      process.env.NOC_GOVT_LOGO_PATH,
      "public/govtOfIndia.jpg",
      "Government emblem",
    ),

    Promise.all(
      students.map((student) => downloadImage(getStudentSignatureUrl(student))),
    ),
  ]);

  const referenceNumber = safe(nocData.referenceNumber, "");

  /* ---------------------------------------------------------------------- */
  /* PDF                                                                    */
  /* ---------------------------------------------------------------------- */

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",

        margins: {
          top: 30,
          bottom: 30,
          left: 35,
          right: 35,
        },

        bufferPages: true,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.on("error", reject);

      const pageWidth = 595.28;

      const left = 35;

      const right = pageWidth - 35;

      const contentWidth = right - left;

      /* ------------------------------ HEADER ----------------------------- */

      if (collegeLogo) {
        try {
          doc.image(collegeLogo, left + 5, 30, {
            fit: [75, 75],
          });
        } catch (error) {
          console.error("College logo render error:", error.message);
        }
      }

      if (govtEmblem) {
        try {
          doc.image(govtEmblem, right - 70, 30, {
            fit: [65, 75],
          });
        } catch (error) {
          console.error("Emblem render error:", error.message);
        }
      }

      const headerX = left + 85;

      const headerWidth = contentWidth - 170;

      doc
        .font("Times-Bold")
        .fontSize(13)
        .text("TRAINING AND PLACEMENT CELL", headerX, 36, {
          width: headerWidth,
          align: "center",
        });

      doc
        .fontSize(10.5)
        .text("JALPAIGURI GOVERNMENT ENGINEERING COLLEGE", headerX, 53, {
          width: headerWidth,
          align: "center",
        });

      doc.fontSize(9.5).text("GOVERNMENT OF WEST BENGAL", headerX, 67, {
        width: headerWidth,
        align: "center",
      });

      doc.fontSize(9.5).text("JALPAIGURI-735102", headerX, 80, {
        width: headerWidth,
        align: "center",
      });

      /* ------------------------- REF NO / DATE --------------------------- */

      let y = 125;

      doc
        .font("Times-Roman")
        .fontSize(9)
        .text("Ref No: ", left, y, {
          continued: true,
        })
        .font("Times-Bold")
        .text(referenceNumber);

      doc.font("Times-Roman").fontSize(9);

      doc.text("Date:", right - 135, y, {
        lineBreak: false,
      });

      doc.text(day, right - 100, y, {
        width: 22,
        align: "center",
      });

      doc.text("/", right - 76, y, {
        lineBreak: false,
      });

      doc.text(month, right - 68, y, {
        width: 22,
        align: "center",
      });

      doc.text("/", right - 44, y, {
        lineBreak: false,
      });

      doc.text(year, right - 38, y, {
        width: 38,
        align: "right",
      });

      /* -------------------------------- TO ------------------------------- */

      y = 150;

      doc.font("Times-Bold").fontSize(9.5).text("To", left, y);

      y += 12;

      toLines.forEach((line) => {
        doc.font("Times-Bold").fontSize(9.5).text(line, left, y);

        y += 11.5;
      });

      y += 12;

      /* ------------------------------ SUBJECT ---------------------------- */

      doc
        .font("Times-Bold")
        .fontSize(9.5)
        .text(
          "Subject: Request for granting permission to undertake an internship programme",
          left,
          y,
          {
            width: contentWidth,
            align: "center",
          },
        );

      y += 26;

      /* --------------------------- SALUTATION ---------------------------- */

      doc.font("Times-Roman").fontSize(9.5).text("Dear Sir/Madam,", left, y);

      y += 12;

      doc
        .font("Times-Roman")
        .fontSize(9.5)
        .text(`Greetings from ${COLLEGE_NAME}.`, left, y);

      y += 18;

      /* ---------------------------- PARAGRAPH 1 -------------------------- */

      y = drawRichParagraph(
        doc,
        [
          {
            text:
              `We wish to inform you that the ${
                isPlural ? "students" : "student"
              } ` +
              `from the present ${yearText ? `${yearText} ` : ""}` +
              `(${semesterText}, ${batch} Batch), Department of ${department}, ` +
              `${COLLEGE_NAME}, ${
                isPlural ? "intend" : "intends"
              } to pursue their `,
          },

          {
            text: "Internship Programme",
            font: "Times-Bold",
          },

          {
            /*
             * NBSP prevents the unwanted visual gap after
             * "Internship Programme".
             */
            text:
              `\u00A0at your distinguished organization from ${periodText} ` +
              `(${shortPeriod}). This internship program is an integral part ` +
              `of the B. Tech Program curriculum and is designed to provide ` +
              `instruction that is relevant to industry and research. We are ` +
              `confident that your esteemed organization will provide ` +
              `valuable practical exposure.`,
          },
        ],
        left,
        y,
        contentWidth,
      );

      y += 10;

      /* ---------------------------- PARAGRAPH 2 -------------------------- */

      y = drawRichParagraph(
        doc,
        [
          {
            text:
              `Therefore, we kindly request that you allow ` +
              `${isPlural ? "them" : "him/her"} to participate in the ` +
              `aforementioned internship programme at your esteemed ` +
              `organization.`,
          },
        ],
        left,
        y,
        contentWidth,
      );

      y += 10;

      doc
        .font("Times-Roman")
        .fontSize(9.5)
        .text("We will be appreciative of your cooperation.", left, y);

      y += 22;

      /* ------------------------------ TABLE ------------------------------ */

      doc
        .font("Times-Roman")
        .fontSize(9.5)
        .text(
          `The details of the ${
            isPlural ? "students" : "student"
          } are as follows:`,
          left,
          y,
        );

      y += 15;

      const columns = [
        {
          key: "name",
          title: "Name of the student",
          width: 100,
        },

        {
          key: "email",
          title: "Email-Id",
          width: 120,
        },

        {
          key: "roll",
          title: "Roll No.",
          width: 65,
        },

        {
          key: "contact",
          title: "Contact No.\n(Student)",
          width: 70,
        },

        {
          key: "guardian",
          title: "Guardian's Name\nand Contact Number",
          width: 100,
        },

        {
          key: "signature",
          title: "Signature of the\nStudent",
          width: 85,
        },
      ];

      const tableWidth = columns.reduce((sum, c) => sum + c.width, 0);

      const tableLeft = left + (contentWidth - tableWidth) / 2;

      const headerHeight = 32;

      const rowHeight = 46;

      let x = tableLeft;

      columns.forEach((column) => {
        drawCell({
          doc,
          text: column.title,
          x,
          y,
          width: column.width,
          height: headerHeight,
          font: "Times-Bold",
          fontSize: 8.5,
        });

        x += column.width;
      });

      let rowY = y + headerHeight;

      students.forEach((student, index) => {
        /*
         * Guardian name:
         * Student schema -> guardianName
         * (API response currently returns the typo'd "gurdianName")
         */
        const guardianName = safe(
          firstValue(
            student.guardianName,
            student.gurdianName,
            student.fatherName,
            student.motherName,
            student.guardian?.name,
          ),
          "",
        );

        /*
         * Guardian contact:
         * Student schema -> guardianMobile
         * (API response currently returns the typo'd "gurdianMobile")
         */
        const guardianContact = formatPhone(
          firstValue(
            student.guardianMobile,
            student.gurdianMobile,
            student.guardianContact,
            student.guardianPhone,
            student.guardian?.mobileNumber,
            student.guardian?.phone,
            student.guardian?.contactNumber,
          ),
        );

        const values = {
          name: safe(
            firstValue(student.fullName, student.name, application.studentName),
          ),

          email: safe(
            firstValue(
              student.email,
              student.emailId,
              application.studentEmail,
            ),
          ),

          roll: safe(
            firstValue(
              student.rollNumber,
              student.rollNo,
              application.rollNumber,
            ),
          ),

          contact: safe(
            firstValue(
              student.mobileNumber,
              student.contactNumber,
              student.phone,
              student.mobile,
              student.phoneNumber,
              application.studentContact,
            ),
          ),

          guardian:
            [guardianName, guardianContact].filter(Boolean).join("\n") || "-",
        };

        x = tableLeft;

        columns.forEach((column) => {
          if (column.key === "signature") {
            drawSignatureCell({
              doc,
              buffer: signatureBuffers[index],
              x,
              y: rowY,
              width: column.width,
              height: rowHeight,
            });
          } else {
            drawCell({
              doc,
              text: values[column.key],
              x,
              y: rowY,
              width: column.width,
              height: rowHeight,
              fontSize: 8.5,
            });
          }

          x += column.width;
        });

        rowY += rowHeight;
      });

      y = rowY + 16;

      /* --------------------------- BEST REGARDS -------------------------- */

      doc.font("Times-Roman").fontSize(9.5).text("With best regards.", left, y);

      y += 52;

      /* --------------------------- SIGNATORIES --------------------------- */

      const blockWidth = 250;

      /* Left: Faculty Coordinator (TPO) */
      const leftEnd = drawSignatory({
        doc,

        x: left + 5,

        y,

        width: blockWidth,

        align: "left",

        name: facultyBlock.name,

        lines: facultyBlock.lines,
      });

      /* Right: Coordinator, Internship & Training (SPOC) */
      const rightEnd = drawSignatory({
        doc,

        x: right - blockWidth - 5,

        y,

        width: blockWidth,

        align: "right",

        name: coordinatorBlock.name,

        lines: coordinatorBlock.lines,

        boldContact: coordinatorBlock.boldContact,
      });

      y = Math.max(leftEnd, rightEnd) + 30;

      /* Static: Head of T&P Cell, centered */
      const headWidth = 260;

      const headEnd = drawSignatory({
        doc,

        x: left + (contentWidth - headWidth) / 2,

        y,

        width: headWidth,

        align: "center",

        name: HEAD_TNP.name,

        lines: HEAD_TNP.lines,
      });

      y = headEnd + 20;

      /*
       * Electronically generated notice.
       *
       * This replaces the old hard-coded Head of TNP information.
       */
      doc
        .font("Times-Italic")
        .fontSize(8)
        .text(
          "This is an electronically generated NOC. Please do not alter this PDF.",
          left,
          y,
          {
            width: contentWidth,
            align: "center",
          },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/* -------------------------------------------------------------------------- */
/* Controller helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Loads the SPOC and TPO documents for an application.
 *
 * The models are passed in so this file needs no import paths from your app.
 *
 * Example:
 *
 * const { spoc, tpo } =
 *   await resolveNocSignatories({
 *     application,
 *     noc,
 *     SPOC,
 *     TPO,
 *     User,
 *   });
 *
 * SPOC resolution:
 *   1. application.spocReviewedBy if populated
 *   2. application.spoc if populated
 *   3. SPOC model by spocReviewedBy / noc.generatedBy
 *   4. User model by spocReviewedBy / noc.generatedBy
 *   5. Active SPOC of student's department
 *
 * TPO resolution:
 *   1. application.tpoReviewedBy if populated
 *   2. application.tpo if populated
 *   3. TPO model by tpoReviewedBy
 *   4. User model by tpoReviewedBy
 */
export const resolveNocSignatories = async ({
  application: rawApplication,
  noc,
  SPOC,
  TPO,
  User,
}) => {
  const application = rawApplication?.data ?? rawApplication ?? {};

  const nocData = noc || application.noc || {};

  /* A real person document, not a bare ObjectId */
  const isPerson = (value) =>
    Boolean(
      value && typeof value === "object" && (value.fullName || value.name),
    );

  const idOf = (value) => value?._id ?? value ?? null;

  const findById = async (Model, id) => {
    if (!Model || !id) {
      return null;
    }

    try {
      return await Model.findById(id).lean();
    } catch {
      return null;
    }
  };

  const department = firstValue(
    application.student?.department,
    application.department,
    nocData.department,
  );

  /* ------------------------------ SPOC ------------------------------- */

  let spoc = [application.spocReviewedBy, application.spoc].find(isPerson);

  if (!spoc) {
    const ids = [
      idOf(application.spocReviewedBy),
      idOf(nocData.generatedBy),
    ].filter(Boolean);

    for (const id of ids) {
      spoc = (await findById(SPOC, id)) || (await findById(User, id));
      if (spoc) break;
    }
  }

  /* Last resort: the active SPOC of the student's department */
  if (!spoc && SPOC && department) {
    spoc = await SPOC.findOne({ department, isActive: true }).lean();
  }

  /* ------------------------------- TPO ------------------------------- */

  let tpo = [application.tpoReviewedBy, application.tpo].find(isPerson);

  if (!tpo) {
    const id = idOf(application.tpoReviewedBy);

    tpo = (await findById(TPO, id)) || (await findById(User, id));
  }

  /* Last resort: the active TPO */
  if (!tpo && TPO) {
    tpo = await TPO.findOne({ isActive: true }).lean();
  }

  if (!spoc) console.warn("resolveNocSignatories: SPOC not found");
  if (!tpo) console.warn("resolveNocSignatories: TPO not found");

  return { spoc, tpo };
};

/* -------------------------------------------------------------------------- */
/* NOC file name                                                              */
/* -------------------------------------------------------------------------- */

/**
 * File name:
 *
 *   "<Organisation_Name>_<dd-mm-yyyy>.pdf"
 *
 * Example:
 *
 *   Indian_Institute_of_Technology_Bombay_08-10-2026.pdf
 *
 * The date is the NOC generation date (IST).
 *
 * Pass `suffix` (e.g. the roll number) if several students can get a NOC
 * for the same organisation on the same day.
 */
export const buildNocFileName = ({
  noc,
  application: rawApplication,
  suffix,
} = {}) => {
  const application = rawApplication?.data ?? rawApplication ?? {};

  const nocData = noc || application.noc || {};

  const organisation = application.organisation || {};

  const organisationName =
    firstValue(
      organisation.organisationName,
      organisation.name,
      application.organisationName,
    ) || "Organisation";

  const { day, month, year } = splitDateIST(
    firstValue(nocData.generatedAt, application.nocGeneratedAt),
  );

  const clean = (value) =>
    String(value)
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "_");

  const suffixPart = suffix ? `_${clean(suffix)}` : "";

  return `${clean(organisationName)}_${day}-${month}-${year}${suffixPart}.pdf`;
};
