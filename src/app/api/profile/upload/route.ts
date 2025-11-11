// Server-only file
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "profiles/avatars";
  const timestamp = Math.floor(Date.now() / 1000);

  // Build the string to sign according to Cloudinary rules
  // Only include parameters you send to Cloudinary (folder, timestamp, etc.)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  });
}
