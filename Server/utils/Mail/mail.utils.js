import nodemailer from "nodemailer";
import { nocMailTemplate } from "../../template/noc.template.js";

const DEFAULT_CONCURRENCY = 5;
let transporter = null;

export const isMailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      family: 4,
      pool: true,
      maxConnections: 3,
    });
  }
  return transporter;
};

/** Sends a single email. Throws on failure. */
export const sendMail = async ({ to, subject, text, html, attachments }) =>
  getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    attachments,
  });

/**
 * Sends many emails with bounded concurrency. Never throws: failures are
 * collected so one bad address cannot block the rest of the batch.
 *
 * @returns {Promise<{ sent: number, failed: Array<{ to: string, error: string }> }>}
 */
export const sendBulkMail = async (
  messages,
  { concurrency = DEFAULT_CONCURRENCY } = {},
) => {
  const result = { sent: 0, failed: [] };
  let cursor = 0;

  const worker = async () => {
    while (cursor < messages.length) {
      const message = messages[cursor++];

      try {
        await sendMail(message);
        result.sent += 1;
      } catch (error) {
        result.failed.push({
          to: message.to,
          error: error.message,
        });
      }
    }
  };

  await Promise.all(
    Array.from(
      {
        length: Math.min(concurrency, messages.length),
      },
      worker,
    ),
  );

  return result;
};

const buildNocMessage = ({
  to,
  studentName,
  organisationName,
  referenceNumber,
  fileName,
  pdfBuffer,
}) => ({
  to,
  ...nocMailTemplate({
    studentName,
    organisationName,
    referenceNumber,
  }),
  attachments: [
    {
      filename: fileName,
      content: pdfBuffer,
      contentType: "application/pdf",
    },
  ],
});

/**
 * Emails generated NOC PDFs to students in bulk (one email per student).
 * Jobs of the same group share one PDF buffer, so memory use stays flat.
 *
 * @param {Array<{ to, studentName, organisationName, referenceNumber, fileName, pdfBuffer }>} jobs
 */
export const sendNocMails = async (jobs) => {
  if (!jobs?.length) return { sent: 0, failed: [] };

  if (!isMailConfigured()) {
    console.warn("NOC mail skipped: SMTP is not configured.");

    return {
      sent: 0,
      failed: jobs.map((job) => ({
        to: job.to,
        error: "SMTP not configured",
      })),
    };
  }

  return sendBulkMail(jobs.map(buildNocMessage));
};
