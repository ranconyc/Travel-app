// Server-only file
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder =
    process.env.CLOUDINARY_UPLOAD_FOLDER_DESTINATIONS || "destinations";
  const timestamp = Math.floor(Date.now() / 1000);

  // Optimize for destination hero images (larger, landscape)
  const transformation = "w_1920,h_1080,c_fill,q_auto:good,f_auto";

  // Build the string to sign according to Cloudinary rules (alphabetical order)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&transformation=${transformation}`;
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
    transformation,
  });
}
