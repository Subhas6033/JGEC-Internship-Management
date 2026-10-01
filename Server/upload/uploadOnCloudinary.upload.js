import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(`Please Provide the Cloudinary Credentials...`);
}

/**
 * Upload a file to Cloudinary.
 *
 * @param {Buffer} fileBuffer - File data
 * @param {"image"|"pdf"|"raw"|"video"} fileType - Type of file
 * @param {string} folder - Cloudinary folder
 * @param {string} [publicId] - Optional Cloudinary public ID
 * @returns {Promise<Object>}
 */
export const uploadToCloudinary = (fileBuffer, fileType, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const resourceType =
      fileType === "image" ? "image" : fileType === "video" ? "video" : "raw";

    const uploadOptions = {
      resource_type: resourceType,
      folder,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};
