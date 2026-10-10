import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import path from "node:path";

// Static Fallbacks
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

// Page Layout Constants
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_TOP = 30;
const MARGIN_BOTTOM = 30;
const MARGIN_SIDE = 35;
const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN_BOTTOM;

/*
 * Vertical space required by everything rendered after the student table:
 * "With best regards", both signatory blocks, the head signatory and the
 * footer note. The last student row is always kept on the same page as this
 * block so the signatories never appear on a page without student data.
 * Update this value if the sign-off layout changes.
 */
const SIGNOFF_HEIGHT = 270;
// Generic Helpers
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
  if (mod100 >= 11 && mod100 <= 13) {
    return `${n}th`;
  }
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
// Date Helpers
const formatMonthDay = (date) => {
  const d = new Date(date);
  return `${MONTHS[d.getUTCMonth()]} ${ordinal(d.getUTCDate())}`;
};

const formatShortDate = (date) => {
  const d = new Date(date);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

const splitDateIST = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(isValidDate(date) ? new Date(date) : new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return {
    day: get("day"),
    month: get("month"),
    year: get("year"),
  };
};

const getSemesterNumber = (semester) => {
  const n = Number(String(semester ?? "").replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const formatSemester = (semester) => {
  const n = getSemesterNumber(semester);
  return n ? `${ordinal(n)} Semester` : safe(semester);
};

const getYearText = (semester) => {
  const n = getSemesterNumber(semester);
  return n ? `${ordinal(Math.ceil(n / 2))} year` : "";
};

// Get the Students Batch (e.g. 2023 to 2027)
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

// Get Department Names
const getDepartmentName = (department) => {
  const raw = String(department || "").trim();
  if (!raw) return "-";
  return DEPARTMENT_NAMES[raw.toUpperCase()] || raw;
};

// Get Peoples
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

// Format the Phone Numbers
const formatPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) {
    return `+91-${digits}`;
  }
  return String(phone);
};

// Images
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

const convertToPng = async (buffer) => {
  try {
    const { default: sharp } = await import("sharp");
    return await sharp(buffer).png().toBuffer();
  } catch {
    return null;
  }
};

const normalizeImage = async (buffer, label = "image") => {
  if (!buffer) return null;
  const png = await convertToPng(buffer);
  if (png) return png;
  if (detectImageType(buffer)) {
    return buffer;
  }
  console.error(
    `${label}: unsupported image format. ` +
      `pdfkit only supports JPEG and PNG - ` +
      `convert the file, or run "npm i sharp" ` +
      `to convert automatically.`,
  );
  return null;
};

// Local Assests
const stripExtension = (name) => name.replace(/\.[^.]+$/, "").toLowerCase();

const assetCandidates = (configured, fallback) => {
  const value = String(configured || fallback).trim();
  const projectRelative = path.resolve(
    process.cwd(),
    value.replace(/^[/\\]+/, ""),
  );
  return path.isAbsolute(value) ? [value, projectRelative] : [projectRelative];
};

const readFirstAvailable = async (candidates) => {
  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate);
    } catch {
      // Try extension-agnostic lookup below.
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
      // Try next candidate.
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

// Student Signature
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

// Drawing Helpers
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
 * Splits styled segments into word tokens. `space` marks whether a token is
 * preceded by whitespace, which keeps spacing correct across segment borders
 * (e.g. a bold segment followed by a segment starting with a space).
 */
const tokenizeSegments = (segments) => {
  const tokens = [];
  let pendingSpace = false;
  segments.forEach((segment) => {
    const text = String(segment.text ?? "");
    const font = segment.font || "Times-Roman";
    const words = text.match(/\S+/g) || [];
    if (/^\s/.test(text)) pendingSpace = true;
    words.forEach((word, index) => {
      tokens.push({
        text: word,
        font,
        space: tokens.length > 0 && (pendingSpace || index > 0),
      });
      pendingSpace = false;
    });

    if (words.length && /\s$/.test(text)) pendingSpace = true;
  });
  return tokens;
};

/**
 * Justified paragraph with mixed fonts.
 *
 * PDFKit's `continued` text justifies every fragment independently, which
 * produces uneven gaps wherever the font changes. Lines are therefore wrapped
 * and justified here, once per line, and words are drawn individually.
 *
 * Returns the Y position below the last line.
 */
const drawRichParagraph = (
  doc,
  segments,
  x,
  y,
  width,
  fontSize = 9.5,
  lineGap = 2,
) => {
  const tokens = tokenizeSegments(segments);
  doc.font("Times-Roman").fontSize(fontSize);
  const spaceWidth = doc.widthOfString(" ");
  const lineHeight = doc.currentLineHeight() + lineGap;
  tokens.forEach((token) => {
    token.width = doc
      .font(token.font)
      .fontSize(fontSize)
      .widthOfString(token.text);
  });
  const lines = [];
  let current = { tokens: [], width: 0 };
  tokens.forEach((token) => {
    const gap = token.space && current.tokens.length ? spaceWidth : 0;
    if (current.tokens.length && current.width + gap + token.width > width) {
      lines.push(current);
      current = { tokens: [], width: 0 };
    }
    const appliedGap = token.space && current.tokens.length ? spaceWidth : 0;
    current.tokens.push({ ...token, gap: appliedGap });
    current.width += appliedGap + token.width;
  });
  if (current.tokens.length) lines.push(current);
  let cursorY = y;
  lines.forEach((line, lineIndex) => {
    const isLast = lineIndex === lines.length - 1;
    const gapCount = line.tokens.filter((token) => token.gap > 0).length;
    const extra = !isLast && gapCount ? (width - line.width) / gapCount : 0;
    let cursorX = x;
    line.tokens.forEach((token) => {
      if (token.gap > 0) cursorX += token.gap + extra;
      doc
        .font(token.font)
        .fontSize(fontSize)
        .text(token.text, cursorX, cursorY, { lineBreak: false });

      cursorX += token.width;
    });
    cursorY += lineHeight;
  });
  return cursorY;
};

// Signatory
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
    .dash(2, {
      space: 1.5,
    })
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

// Main PDF Generator
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
  // Dates
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
  // Students & Academic Details
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
  // Organisations
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

  const contactName = firstValue(
    application.organisationsEmployye,
    application.organisationEmployee,
  );

  const toLines = [
    addresseeLine,
    organisationName,
    ...addressLines,
    contactName ? `Attn: ${contactName}` : "",
  ].filter(Boolean);
  // SPOC & TPO Details
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

  const HEAD_TNP = {
    name: "Dr. Samir Das",
    lines: ["Head, Training & Placement Cell", COLLEGE_NAME],
  };

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
    console.warn("NOC PDF: SPOC not resolved.");
  }

  if (!tpo) {
    console.warn("NOC PDF: TPO not resolved.");
  }
  // Assests
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

  /*
   * For bulk NOCs, every application in the same organisation + department
   * group shares one reference number, supplied by the bulk service through
   * the `noc` object.
   */
  const referenceNumber = safe(nocData.referenceNumber, "");
  // PDF
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: MARGIN_TOP,
          bottom: MARGIN_BOTTOM,
          left: MARGIN_SIDE,
          right: MARGIN_SIDE,
        },
        bufferPages: true,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      const left = MARGIN_SIDE;
      const right = PAGE_WIDTH - MARGIN_SIDE;
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
            text:
              ` at your distinguished organization from ${periodText} ` +
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
      const introHeight = 15;
      const lastIndex = students.length - 1;

      /*
       * Space a row needs on the current page. The last row also reserves
       * room for the sign-off block so it is never rendered without
       * at least one student above it.
       */
      const spaceNeededFor = (index) =>
        rowHeight + (index === lastIndex ? SIGNOFF_HEIGHT : 0);

      const startNewPage = () => {
        doc.addPage();

        return MARGIN_TOP;
      };

      const drawTableHeader = (headerY) => {
        let headerCellX = tableLeft;

        columns.forEach((column) => {
          drawCell({
            doc,
            text: column.title,
            x: headerCellX,
            y: headerY,
            width: column.width,
            height: headerHeight,
            font: "Times-Bold",
            fontSize: 8.5,
          });

          headerCellX += column.width;
        });
      };

      /* Keep the intro line, header and first row together. */
      if (y + introHeight + headerHeight + spaceNeededFor(0) > PAGE_BOTTOM) {
        y = startNewPage();
      }

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

      y += introHeight;
      drawTableHeader(y);
      let rowY = y + headerHeight;
      students.forEach((student, index) => {
        if (rowY + spaceNeededFor(index) > PAGE_BOTTOM) {
          rowY = startNewPage();
          drawTableHeader(rowY);
          rowY += headerHeight;
        }

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

        let x = tableLeft;

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

      const leftEnd = drawSignatory({
        doc,
        x: left + 5,
        y,
        width: blockWidth,
        align: "left",
        name: facultyBlock.name,
        lines: facultyBlock.lines,
      });

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

// Controllers
export const resolveNocSignatories = async ({
  application: rawApplication,
  noc,
  SPOC,
  TPO,
  User,
}) => {
  const application = rawApplication?.data ?? rawApplication ?? {};
  const nocData = noc || application.noc || {};
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

  if (!spoc && SPOC && department) {
    spoc = await SPOC.findOne({
      department,
      isActive: true,
    }).lean();
  }

  /* ------------------------------- TPO ------------------------------- */

  let tpo = [application.tpoReviewedBy, application.tpo].find(isPerson);

  if (!tpo) {
    const id = idOf(application.tpoReviewedBy);

    tpo = (await findById(TPO, id)) || (await findById(User, id));
  }

  if (!tpo && TPO) {
    tpo = await TPO.findOne({
      isActive: true,
    }).lean();
  }

  if (!spoc) {
    console.warn("resolveNocSignatories: SPOC not found");
  }

  if (!tpo) {
    console.warn("resolveNocSignatories: TPO not found");
  }

  return {
    spoc,
    tpo,
  };
};

// NOC File Name
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
