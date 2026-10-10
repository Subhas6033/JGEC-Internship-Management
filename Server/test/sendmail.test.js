import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import {
  isMailConfigured,
  sendMail,
  sendNocMails,
} from "../utils/Mail/mail.utils.js";

const RECIPIENT = "goalkeepersubhas07@gmail.com";

/** Smallest valid one-page PDF, used as a stand-in for a real NOC. */
const buildDummyPdf = () => {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] " +
      "/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    null, // content stream, filled in below
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  const stream = "BT /F1 18 Tf 20 70 Td (Test NOC - mail check) Tj ET";
  objects[3] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;

  let pdf = "%PDF-1.4\n";
  const offsets = [];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;

  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` +
    `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
};

const section = (title) => console.log(`\n=== ${title} ===`);

const run = async () => {
  section("Config");
  console.log("Recipient :", RECIPIENT);
  console.log("SMTP_HOST :", process.env.SMTP_HOST || "(missing)");
  console.log("SMTP_PORT :", process.env.SMTP_PORT || "587 (default)");
  console.log("SMTP_USER :", process.env.SMTP_USER || "(missing)");
  console.log("SMTP_PASS :", process.env.SMTP_PASS ? "(set)" : "(missing)");
  console.log(
    "MAIL_FROM :",
    process.env.MAIL_FROM || "(falls back to SMTP_USER)",
  );

  if (!isMailConfigured()) {
    console.error(
      "\nSMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    );
    process.exit(1);
  }

  let failures = 0;

  /* ------------------------ 1. plain mail ------------------------ */
  section("Test 1: plain mail (sendMail)");

  try {
    const info = await sendMail({
      to: RECIPIENT,
      subject: "Mail utils test - plain email",
      text: "If you can read this, SMTP is working.",
      html: "<p>If you can read this, <b>SMTP is working</b>.</p>",
    });

    console.log("OK  messageId:", info.messageId);
  } catch (error) {
    failures += 1;
    console.error("FAILED:", error.code || "", error.message);
  }

  /* --------------------- 2. NOC mail + PDF ----------------------- */
  section("Test 2: NOC mail with PDF attachment (sendNocMails)");

  const pdfBuffer = buildDummyPdf();

  const result = await sendNocMails([
    {
      to: RECIPIENT,
      studentName: "Test Student",
      organisationName: "Test Organisation Pvt. Ltd.",
      referenceNumber: "TNP/JGEC/INT/2026/CSE/001",
      fileName: "NOC-TNP_JGEC_INT_2026_CSE_001.pdf",
      pdfBuffer,
    },
  ]);

  console.log(`sent: ${result.sent}, failed: ${result.failed.length}`);

  result.failed.forEach(({ to, error }) => {
    failures += 1;
    console.error(`FAILED -> ${to}: ${error}`);
  });

  /* ------------------ 3. bulk (same PDF, 2 mails) ----------------- */
  section("Test 3: bulk send, one shared PDF buffer");

  const bulk = await sendNocMails(
    ["A", "B"].map((label) => ({
      to: RECIPIENT,
      studentName: `Bulk Student ${label}`,
      organisationName: "Bulk Test Organisation",
      referenceNumber: "TNP/JGEC/INT/2026/IT/002",
      fileName: "NOC-TNP_JGEC_INT_2026_IT_002.pdf",
      pdfBuffer,
    })),
  );

  console.log(`sent: ${bulk.sent}, failed: ${bulk.failed.length}`);

  bulk.failed.forEach(({ to, error }) => {
    failures += 1;
    console.error(`FAILED -> ${to}: ${error}`);
  });

  section("Summary");
  console.log(
    failures === 0
      ? `All good. Check the inbox of ${RECIPIENT} (and spam) for 4 emails.`
      : `${failures} failure(s). See the errors above.`,
  );

  process.exit(failures === 0 ? 0 : 1);
};

run().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
