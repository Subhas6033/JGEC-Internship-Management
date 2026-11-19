export const buildResetEmail = (resetLink) => {
  return {
    subject: "Reset Your JGEC Portal Password",

    text: `
Hello,

We received a request to reset your JGEC Internship Management Portal password.

Use the following link to reset your password:

${resetLink}

This link will expire in 20 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
JGEC Internship Management Portal
    `,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 30px 15px;
          background-color: #f0fdf4;
          font-family: Arial, sans-serif;
          color: #1f2937;
        ">
          <div style="
            max-width: 520px;
            margin: auto;
            padding: 32px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #dcfce7;
          ">
            <h2 style="color: #166534;">
              Password Reset Request
            </h2>

            <p>
              We received a request to reset your
              JGEC Internship Management Portal password.
            </p>

            <p>
              Click the button below to choose a new password.
            </p>

            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 13px 22px;
                background: #15803d;
                color: #ffffff;
                text-decoration: none;
                border-radius: 7px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

            <p style="margin-top: 24px;">
              This link expires in <strong>20 minutes</strong>.
            </p>

            <p style="
              font-size: 13px;
              color: #64748b;
            ">
              If you did not request this password reset,
              you can safely ignore this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            " />

            <p style="
              font-size: 12px;
              color: #64748b;
            ">
              JGEC Internship Management Portal
            </p>
          </div>
        </body>
      </html>
    `,
  };
};
