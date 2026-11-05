# Architecture

## Overview

The JGEC Internship Management Portal uses a layered architecture with a React frontend and Express backend. The system follows a client-server pattern with MongoDB for data persistence and Redis for session management. External services include Cloudinary for file uploads, Google Drive for NOC PDF storage, and Nodemailer for email delivery.

## Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React | |
| Frontend | Redux | Store with authSlice for authentication state |
| Frontend | React Query | Hooks for data fetching and mutations |
| Frontend | React Router | Configuration with protected routes |
| Backend | Express | Server framework |
| Backend | Mongoose | MongoDB ODM |
| Data | MongoDB | Primary data store |
| Data | Redis | Session storage |
| External | Cloudinary | Signature upload and image processing |
| External | Google Drive API | NOC PDF storage |
| External | Nodemailer | SMTP email service |
| External | PDFKit | NOC PDF generation |

## Layers

### Frontend Architecture

| Layer | Description |
|-------|-------------|
| **Components** | Reusable UI components (Button, Card, Input, Modal, Select, Toast, etc.) |
| **Pages** | Route-specific pages (Dashboard, Applications, Profile, etc.) |
| **Layouts** | Role-based layouts (StudentLayout, SPOCLayout, TPOLayout, AdminLayout) |
| **Services** | API service layer with axios interceptors for auth |
| **Queries** | React Query hooks for data fetching and mutations |
| **Store** | Redux store with authSlice for authentication state |
| **Hooks** | Custom hooks (useLogin, useSignup, useTPOAuth) |
| **Routes** | React Router configuration with protected routes |

### Backend Architecture (Layered)

| Layer | Description |
|-------|-------------|
| **Routes** | Express Router definitions (auth.routes.js, application.routes.js, etc.) |
| **Middleware** | authenticateUser, requireRole, error.middleware, documentUpload |
| **Controllers** | Request handlers that coordinate services (e.g., application.controller.js) |
| **Services** | Business logic layer (notification.service.js, application.service.js, etc.) |
| **Models** | Mongoose schemas (Student, TPO, SPOC, Organisation, Application, NOC) |
| **Utils** | Helper functions (helper.utils.js, nocStorage.utils.js, mail.utils.js) |

### Data Layer

The Data Layer consists of MongoDB for primary data persistence and Redis for session storage.

## High-Level Component Diagram

![High-Level Component Diagram](images/diagram9.png)

Source: PRD §7 High-Level Component Diagram.

## Request Lifecycle

![Request Lifecycle](images/diagram10.png)

Source: PRD §7 Request Lifecycle.

## Folder Structure

**Client/src/**
```
Client/src/
├── Animations/          # Motion animations
├── Components/          # Reusable UI components
│   ├── AuthRoute.jsx    # Protected route wrapper
│   ├── ProtectedRoute.jsx
│   ├── Common/          # Button, Card, Input, Modal, Select, Toast
│   ├── Landing/         # Landing page components
│   ├── Loader/          # Loading components
│   ├── Navigations/     # Navbar and Sidebar per role
│   └── SPOC/            # SPOC-specific components
├── Layout/              # Layout wrappers per role
├── Pages/               # Route pages
│   ├── Auth/            # Login/Signup pages
│   ├── Services/
│   │   ├── Admin/       # Admin pages
│   │   ├── DeptTPO/     # TPO pages
│   │   ├── SPOC/        # SPOC pages
│   │   └── Students/    # Student pages
│   ├── Landing/         # Landing page
│   ├── Contact/         # Contact page
│   └── Not Found/       # 404 page
├── Services/            # API service layer
│   ├── Queries/         # React Query hooks
│   └── authSlice.js     # Redux auth slice
├── Hooks/               # Custom React hooks
├── App.jsx              # App router wrapper
└── main.jsx             # Entry point
```

**Server/**
```
Server/
├── config/              # Configuration files
│   ├── auth.config.js   # Auth configuration
│   ├── notification.config.js
│   ├── cookieConfig.config.js
│   ├── db.config.js     # MongoDB connection
│   └── httpConfig.config.js
├── middlewares/         # Express middleware
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── documentUpload.middleware.js
├── models/              # Mongoose schemas
│   ├── students.models.js
│   ├── tpo.models.js
│   ├── spoc.models.js
│   ├── organisation.models.js
│   ├── studentApplication.models.js
│   ├── studentDocument.models.js
│   ├── noc.models.js
│   ├── notification.models.js
│   └── refreshSessions.models.js
├── routes/              # Express routes
│   ├── auth.routes.js
│   ├── studentApplication.routes.js
│   ├── spocApplication.routes.js
│   ├── tpoApplication.routes.js
│   └── organisation.routes.js
├── services/            # Business logic
│   ├── auth/            # Authentication services
│   ├── students/        # Student services
│   ├── tpo/             # TPO services
│   ├── spoc/            # SPOC services
│   ├── notification/    # Notification service
│   └── noc/             # NOC generation service
├── utils/               # Utility functions
│   ├── helper.utils.js
│   ├── nocStorage.utils.js
│   └── Mail/mail.utils.js
├── index.js             # Entry point
└── app.js               # Express app setup
```

## Data Model

![ER Diagram](images/diagram11.png)

Source: PRD §8 ER Diagram.

### Model Descriptions

| Model | Fields | Relationships |
|-------|--------|---------------|
| **Student** | _id, fullName, email, mobileNumber, password, rollNumber, department, signature, guardianName, guardianMobile, role | Has many StudentApplications, Has one StudentDocument |
| **TPO** | _id, fullName, email, mobile, department, tpoId, password, signature, role, isActive, lastLoginAt | Reviews many StudentApplications (via tpoReviewedBy) |
| **SPOC** | _id, fullName, spocId, email, mobile, department, password, signature, role, isActive, lastLoginAt | Reviews many StudentApplications (via spocReviewedBy) |
| **Organisation** | _id, organisationName, organisationSite, organisationLocation, organisationMail | Many-to-many with StudentApplications |
| **StudentApplication** | _id, student, semester, organisation, organisationsEmployye, designation, tentativeStartDate, tentativeEndDate, tentativeWorkLocations, modeOfInternship, internshipType, description, status, rejectionReason, rejectedBy, tpoReviewedBy, tpoReviewedAt, spocReviewedBy, spocReviewedAt, noc, nocGeneratedAt | Belongs to Student, Organisation; Has one NOC |
| **StudentDocument** | _id, student, signature, resume | Belongs to one Student |
| **Notification** | _id, recipient, recipientModel, recipientRole, application, actor, actorModel, actorRole, category, type, title, message, metadata, status, readAt | Belongs to Application |
| **NOC** | _id, application, student, organisation, referenceNumber, generatedBy, generatedAt, academicYear, department, storageProvider, driveFileId, fileName, filePath, fileUrl, fileMimeType, fileSize, status, revokedAt | Belongs to Application, Student, Organisation |
| **RefreshSession** | _id, user, userModel, tokenHash, previousTokenHash, familyId, expiresAt, revokedAt | Tracks refresh token sessions |

## Cross-references

For requirements see §6; for API surface see §9; for deployment see docs/deployment.md.
