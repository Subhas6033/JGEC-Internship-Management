const PORTAL_NAME = "JGEC Internship Management Portal";

const PURPOSES = {
  LOGIN: {
    subject: "JGEC Portal - Login Verification Code",
    request: "verify your login",
  },
  EMAIL_VERIFICATION: {
    subject: "JGEC Portal - Email Verification Code",
    request: "verify your email address",
  },
};

// Anything interpolated into the HTML body must be escaped. Names come from user input.
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const authOtpTemplate = ({
  otp,
  userName = "User",
  userRole = "User",
  expiryMinutes = 5,
  purpose = "LOGIN",
}) => {
  const { subject, request } = PURPOSES[purpose] ?? PURPOSES.LOGIN;

  const roleName = String(userRole).toUpperCase();
  const minutes = `${expiryMinutes} ${expiryMinutes === 1 ? "minute" : "minutes"}`;

  const text = [
    `Hello ${userName},`,
    "",
    `We received a request to ${request} as ${roleName} on the ${PORTAL_NAME}.`,
    "",
    `Your One-Time Password (OTP) is: ${otp}`,
    "",
    `This code is valid for ${minutes} and can only be used once.`,
    "",
    "For your security:",
    "- Do not share this OTP with anyone.",
    "- JGEC administrators will never ask you for this code.",
    "",
    "If you did not initiate this request, please ignore this email.",
    "",
    "Regards,",
    PORTAL_NAME,
    "",
    "This is an automated email. Please do not reply.",
  ].join("\n");

  const p = "margin:0 0 16px;";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
  <!-- Preheader: shown in inbox previews -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    Your verification code is ${escapeHtml(otp)}. It is valid for ${minutes}.
  </div>

  <div style="max-width:560px;padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#222222;">

    <p style="${p}">Hello ${escapeHtml(userName)},</p>

    <p style="${p}">
      We received a request to ${escapeHtml(request)} as
      <strong>${escapeHtml(roleName)}</strong> on the ${PORTAL_NAME}.
    </p>

    <p style="${p}">
      Your One-Time Password (OTP) is: <strong>${escapeHtml(otp)}</strong>
    </p>

    <p style="${p}">
      This code is valid for <strong>${minutes}</strong> and can only be used once.
    </p>

    <p style="${p}">
      For your security, do not share this OTP with anyone. JGEC administrators
      will never ask you for this code.
    </p>

    <p style="${p}">
      If you did not initiate this request, please ignore this email.
    </p>

    <p style="margin:0 0 24px;">
      Regards,<br />
      ${PORTAL_NAME}
    </p>

    <p style="margin:0;font-size:12px;line-height:18px;color:#777777;">
      This is an automated email. Please do not reply.
    </p>

  </div>
</body>
</html>`;

  return { subject, text, html };
};

export { authOtpTemplate };
