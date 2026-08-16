import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary";
import { requireEnv } from "../utils/requireEnv.js";

cloudinary.config({
  cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET"),
});

export function uploadToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result as UploadApiResponse);
      },
    );
    stream.end(buffer);
  });
}

export function getCloudinaryResourceType(
  mimeType: string,
): "image" | "video" | "raw" {
  if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
    return "image";
  }
  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
    return "video";
  }
  return "raw";
}

export async function deleteFromCloudinary(publicId: string, mimeType: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: getCloudinaryResourceType(mimeType),
  });
}
