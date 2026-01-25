/**
 * Cloudinary upload service
 * Handles image uploads to Cloudinary with signature-based authentication
 */

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  transformation?: string;
}

/**
 * Fetches upload signature from the server
 */
async function getUploadSignature(): Promise<CloudinaryUploadSignature> {
  const res = await fetch("/api/profile/upload", { method: "POST" });
  if (!res.ok) {
    throw new Error("Failed to get upload signature");
  }
  return res.json();
}

/**
 * Uploads a blob (image) to Cloudinary
 * @param blob - The image blob to upload
 * @returns Cloudinary upload result with public_id and secure_url
 */
export async function uploadToCloudinary(
  blob: Blob,
): Promise<CloudinaryUploadResult> {
  try {
    // Get upload signature from server
    const {
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      transformation,
    } = await getUploadSignature();

    // Prepare form data
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);
    if (transformation) {
      formData.append("transformation", transformation);
    }

    // Upload to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Uploads an image file to Cloudinary
 * Convenience wrapper that converts File to Blob
 * @param file - The image file to upload
 * @returns Cloudinary upload result
 */
export async function uploadFileToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file);
}
