const SUBJECT_PREFIX = "Internship Opportunities for Students";
const SENDER_LABEL = "Department TPO, JGEC";

// "gmail" opens Gmail's compose window in a new tab (works without a mail app).
// "mailto" opens the computer's default mail app (needs one to be installed).
const MAIL_MODE = "gmail";

export const buildSubject = (organisationName) =>
  `${SUBJECT_PREFIX} – ${organisationName} | ${SENDER_LABEL}`;

export const getMailLink = ({ organisationMail, organisationName }) => {
  const subject = encodeURIComponent(buildSubject(organisationName));
  const to = encodeURIComponent(organisationMail);

  if (MAIL_MODE === "mailto") {
    // mailto needs %20 for spaces (not "+"), so encodeURIComponent is used
    return { href: `mailto:${organisationMail}?subject=${subject}` };
  }

  return {
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`,
    target: "_blank",
    rel: "noreferrer",
  };
};
