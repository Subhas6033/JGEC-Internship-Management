import express from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load Server/.env explicitly.
dotenv.config({
  path: resolve(__dirname, "../.env"),
});

const app = express();
const PORT = 5850;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5850/api/v1/google-drive/oauth/callback";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in Server/.env",
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

// Landing page
app.get("/", (_req, res) => {
  res
    .type("text")
    .send(
      "Google Drive OAuth setup is running. Visit /authorize to connect your account.",
    );
});

// Start Google authorization
app.get("/authorize", (_req, res) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  res.redirect(authorizationUrl);
});

// IMPORTANT: This is the callback route Google redirects to.
app.get("/api/v1/google-drive/oauth/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error("Google authorization failed:", error);

    return res
      .status(400)
      .send("Google authorization was denied. Check the terminal for details.");
  }

  if (typeof code !== "string" || !code) {
    return res
      .status(400)
      .send("Authorization code is missing. Visit /authorize and try again.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      console.error(
        "Google did not return a refresh token. Revoke this application's access in your Google Account, then authorize again.",
      );

      return res
        .status(400)
        .send(
          "No refresh token was returned. Check the terminal for instructions.",
        );
    }

    console.log("\nGoogle Drive OAuth successful.");
    console.log("\nAdd this value to Server/.env:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    return res
      .status(200)
      .type("text")
      .send(
        "Google Drive authorization successful. Check your backend terminal for the refresh token. Keep it secret.",
      );
  } catch (err) {
    console.error(
      "Failed to exchange authorization code:",
      err.response?.data || err.message,
    );

    return res
      .status(500)
      .send(
        "OAuth token exchange failed. Check the backend terminal and redirect URI configuration.",
      );
  }
});

const server = app.listen(PORT, () => {
  console.log(`Google OAuth setup server: http://localhost:${PORT}`);
  console.log(`Authorization page: http://localhost:${PORT}/authorize`);
  console.log(`OAuth redirect URI: ${REDIRECT_URI}`);
  console.log("\nSign in using the Google account that owns your NOC folder.");
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
