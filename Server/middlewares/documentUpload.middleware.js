import multer from "multer";

const storage = multer.memoryStorage();
export const documentUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Unsupported file type. Please upload PNG, JPEG, WEBP, PDF, DOC or DOCX.",
        ),
        false,
      );
    }
    cb(null, true);
  },
});
