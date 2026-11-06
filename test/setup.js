// Mock Cloudinary to avoid requiring credentials during testing

// Set up Cloudinary env vars to bypass the check
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "test-cloud-name";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "test-api-key";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "test-api-secret";

// Set up Google Cloud Storage env vars
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "test-client-secret";
process.env.GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/callback";
process.env.GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "test@test.iam.gserviceaccount.com";
process.env.GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n";
process.env.GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "test-refresh-token";
process.env.GOOGLE_NOC_ROOT_FOLDER_ID = process.env.GOOGLE_NOC_ROOT_FOLDER_ID || "test-folder-id";

// Set up CORS origin
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
