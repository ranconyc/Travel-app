// Server-only file
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "profiles/avatars";
  const timestamp = Math.floor(Date.now() / 1000);

  // Optimize with transformation (must be included in signature)
  const transformation = "w_800,h_800,c_fill,g_face,q_auto,f_auto";

  // Build the string to sign according to Cloudinary rules (alphabetical order)
  // folder, timestamp, transformation
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
