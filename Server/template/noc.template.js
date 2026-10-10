const COLLEGE_NAME = "Jalpaiguri Government Engineering College";
const CELL_NAME = "Training and Placement Cell";

export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

/**
 * Template for the email that delivers a generated NOC.
 * Returns { subject, text, html } only; recipients and attachments are
 * handled by the mail utils.
 */
export const nocMailTemplate = ({
  studentName,
  organisationName,
  referenceNumber,
}) => {
  const name = studentName || "Student";
  const organisation = organisationName || "the organisation";

  return {
    subject: `No Objection Certificate - ${organisation} (${referenceNumber})`,

    text:
      `Dear ${name},\n\n` +
      `Your No Objection Certificate for the internship at ${organisation} ` +
      `has been generated. Reference No: ${referenceNumber}.\n` +
      `The certificate is attached to this email.\n\n` +
      `Regards,\n${CELL_NAME}\n${COLLEGE_NAME}`,

    html:
      `<p>Dear ${escapeHtml(name)},</p>` +
      `<p>Your No Objection Certificate for the internship at ` +
      `<b>${escapeHtml(organisation)}</b> has been generated.<br/>` +
      `Reference No: <b>${escapeHtml(referenceNumber)}</b></p>` +
      `<p>The certificate is attached to this email.</p>` +
      `<p>Regards,<br/>${escapeHtml(CELL_NAME)}<br/>` +
      `${escapeHtml(COLLEGE_NAME)}</p>`,
  };
};
