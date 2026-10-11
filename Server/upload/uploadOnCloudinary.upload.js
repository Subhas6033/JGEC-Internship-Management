import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import sharp from "sharp";
import { APIERR } from "../utils/helper.utils.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Please Provide the Cloudinary Credentials...");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MIN_INK_RATIO = 0.001; // below this: nothing was detected (blank image)
const MAX_INK_RATIO = 0.35; // above this: background wasn't removed (dark/busy image)
const MIN_PAPER_LUMINANCE = 130; // median brightness below this: background is too dark

const removeSignatureBackground = async (fileBuffer) => {
  try {
    console.log(`Starting BG remover!!!`);

    const { data: gray, info } = await sharp(fileBuffer)
      .rotate()
      .flatten({ background: "#ffffff" })
      .grayscale()
      .normalise()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const pixelCount = width * height;

    // Estimate paper brightness (median)
    const histogram = new Uint32Array(256);
    for (let i = 0; i < pixelCount; i++) histogram[gray[i]]++;

    let acc = 0;
    let paper = 255;
    for (let v = 0; v < 256; v++) {
      acc += histogram[v];
      if (acc >= pixelCount * 0.5) {
        paper = v;
        break;
      }
    }

    // FAIL: background too dark, so extraction can't work reliably
    if (paper < MIN_PAPER_LUMINANCE) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        `Background is too dark. Please use a light background image for proper signature extraction`,
      );
    }

    const high = Math.max(paper - 10, 120);
    const low = Math.max(high - 90, 20);

    const out = Buffer.alloc(pixelCount * 4);
    const INK = { r: 20, g: 20, b: 20 };
    let inkPixels = 0;

    for (let i = 0; i < pixelCount; i++) {
      const lum = gray[i];
      let alpha;

      if (lum >= high) alpha = 0;
      else if (lum <= low) alpha = 255;
      else alpha = Math.round(((high - lum) / (high - low)) * 255);

      if (alpha > 128) inkPixels++;

      const o = i * 4;
      out[o] = INK.r;
      out[o + 1] = INK.g;
      out[o + 2] = INK.b;
      out[o + 3] = alpha;
    }

    const inkRatio = inkPixels / pixelCount;

    // FAIL: nothing detected
    if (inkRatio < MIN_INK_RATIO) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        `No signature detected. Please upload a clear image of a signature on a light background`,
      );
    }

    // FAIL: too much "ink" means the background wasn't removed
    if (inkRatio > MAX_INK_RATIO) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        `Could not separate the signature from the background. Please use a plain, light background image`,
      );
    }

    return await sharp(out, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } catch (error) {
    // Re-throw our own validation errors untouched
    if (error instanceof APIERR) throw error;

    console.error(`Err!! While removing the BG from the Signatures ${error}`);
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Please use a light background image for proper signature extractions`,
    );
  }
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

  const shouldRemoveBg =
    options.removeSignatureBackground && fileType === "image";

  const uploadBuffer = shouldRemoveBg
    ? await removeSignatureBackground(fileBuffer)
    : fileBuffer;

  const uploadOptions = { resource_type: resourceType, folder };
  if (shouldRemoveBg) uploadOptions.format = "png";
  if (publicId) uploadOptions.public_id = publicId;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    Readable.from(uploadBuffer).pipe(uploadStream);
  });
};

export { cloudinary, uploadToCloudinary, removeSignatureBackground };
