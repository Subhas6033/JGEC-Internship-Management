# Deployment and Setup

## Environment Variables

**Required (.env):**
```
NODE_ENV=development|production
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/jgec_internship

# JWT
ACCESS_TOKEN_SECRET=<random-secret>
ACCESS_TOKEN_EXPIRY=15m
ACCESS_TOKEN_ISSUER=jgec
ACCESS_TOKEN_AUDIENCE=jgec-students

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<app-password>
MAIL_FROM=<email>

# College Email Domains
COLLEGE_MAILS=["@jgec.ac.in","@gmail.com"]

# Frontend
CORS_ORIGIN=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Google Drive
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_REFRESH_TOKEN=<refresh-token>

# TPO ID (for registration)
TPO_ID=TPO2024
```

## Local Installation

```bash
# Backend
cd Server
npm install
npm run dev  # or node index.js

# Frontend (in separate terminal)
cd Client
npm install
npm run dev
```

## Deployment Recommendations

| Component | Recommendation |
|-----------|----------------|
| **Hosting** | Render, Railway, or AWS EC2 |
| **Database** | MongoDB Atlas (production) |
| **Domain** | Custom domain with HTTPS |
| **Health Check** | `/api/v1/health` endpoint |
| **Logging** | PM2 + Winston logger |
| **Backups** | MongoDB Atlas automated backups |

## Health Check Endpoint

**Status:** Not yet implemented (placeholder in `Server/services/health/`)

**Planned Response:**
```json
{
  "statusCode": 200,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-11-05T17:00:00Z"
}
```

## Third-Party Service Configuration

### Cloudinary

| Function | Description |
|----------|-------------|
| **Signature Upload** | Student signatures uploaded to `jgec-internship/students/signatures/` with `removeSignatureBackground: true` |
| **Resume Upload** | Student resumes stored in Cloudinary (pending implementation) |
| **Image Processing** | Automatic background removal, format conversion to WebP |

### Google Drive

| Function | Description |
|----------|-------------|
| **NOC Storage** | Generated NOC PDFs stored in Google Drive |
| **OAuth2 Flow** | Service account authentication with `googleapis` package |
| **File ID Reference** | NOC records store `driveFileId` instead of local path |
| **File Naming** | Format: `NOC-<referenceNumber>.pdf` |

### Mail Service (Nodemailer)

| Function | Description |
|----------|-------------|
| **SMTP Configuration** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` |
| **Concurrency** | 5 emails concurrently via `sendBulkMail` |
| **NOC Email** | Sends with PDF attachment, HTML/text templates |
| **Notification Emails** | Status change notifications (no attachment) |

### PDF Generation (PDFKit)

| Function | Description |
|----------|-------------|
| **Template** | `Server/template/noc.template.js` |
| **Content** | Student details, organisation details, internship dates, signatories (TPO + SPOC) |
| **Format** | A4 PDF with college header, signature lines |

## Security Headers and CORS

```javascript
app.use(helmet()); // Default security headers
app.disable("x-powered-by");
```

| Setting | Value |
|---------|-------|
| `origin` | `CORS_ORIGIN` env variable |
| `credentials` | `true` (for cookies) |

## Token and Session Configuration

### Token Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| **Access Token Secret** | `ACCESS_TOKEN_SECRET` env | JWT signing secret |
| **Access Token Expiry** | `ACCESS_TOKEN_EXPIRY` env | Token lifetime (e.g., 15m) |
| **Refresh Token Expiry** | Configured in session | Longer lifetime (e.g., 7d) |
| **Cookie Name** | `refresh:<userModel>` | Dynamic per role (Student, TPO, SPOC, Admin) |
| **SameSite** | `Lax` | CSRF protection |
| **Secure** | `true` in production | HTTPS only |

### Session Management

| Feature | Description |
|---------|-------------|
| **Refresh Session Rotation** | Each refresh token usage generates a new one and revokes the old |
| **Family ID** | All refresh tokens from same browser/device share a familyId |
| **Revocation** | Logout revokes current session; login revokes all previous sessions |
| **Expiration** | Sessions auto-expire after configured duration (TTL on MongoDB index) |
