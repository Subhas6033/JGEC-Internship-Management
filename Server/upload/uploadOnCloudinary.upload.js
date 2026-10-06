import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import sharp from "sharp";

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
  throw new Error("Please Provide the Cloudinary Credentials...");
}

const removeSignatureBackground = async (fileBuffer) => {
  const { data, info } = await sharp(fileBuffer)
    .flatten({
      background: {
        r: 255,
        g: 255,
        b: 255,
      },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

    // Remove white paper completely.
    if (luminance >= 245) {
      data[i + 3] = 0;
      continue;
    }

    // Remove light gray paper and scanner shadows gradually.
    if (luminance >= 180) {
      data[i + 3] = Math.round(((245 - luminance) / 65) * 255);
      continue;
    }

    // Preserve dark signature strokes completely.
    if (luminance <= 80) {
      data[i + 3] = 255;
      continue;
    }

    // Preserve anti-aliased edges while removing the background.
    data[i + 3] = Math.max(
      0,
      Math.min(255, Math.round(((180 - luminance) / 100) * 255)),
    );
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toBuffer();
};

const uploadToCloudinary = async (
  fileBuffer,
  fileType,
  folder,
  publicId,
  options = {},
) => {
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error("A valid file buffer is required");
  }

  const resourceType =
    fileType === "image" ? "image" : fileType === "video" ? "video" : "raw";

  let uploadBuffer = fileBuffer;

  if (options.removeSignatureBackground && fileType === "image") {
    uploadBuffer = await removeSignatureBackground(fileBuffer);
  }

  const uploadOptions = {
    resource_type: resourceType,
    folder,
  };

  if (options.removeSignatureBackground && fileType === "image") {
    uploadOptions.format = "png";
  }

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    Readable.from(uploadBuffer).pipe(uploadStream);
  });
};

export { cloudinary, uploadToCloudinary, removeSignatureBackground };
