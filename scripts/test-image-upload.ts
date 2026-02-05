// scripts/test-image-upload.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import crypto from "crypto";
import fetch from "node-fetch";
import FormData from "form-data";

async function testCloudinaryUpload() {
  console.log("Testing Cloudinary Upload...");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary config in .env.local");
    return;
  }

  // Use a reliable test image
  const imageUrl =
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=60";
  const folder = "test_uploads";
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `test_upload_${timestamp}`;
  const transformation = "w_500,h_500,c_fill";

  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}&transformation=${transformation}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  const formData = new FormData();
  formData.append("file", imageUrl);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("transformation", transformation);

  try {
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Upload Failed:", errorText);
    } else {
      const result = await uploadRes.json();
      console.log("Upload Success!");
      console.log("URL:", result.secure_url);
    }
  } catch (e) {
    console.error("Exception during upload:", e);
  }
}

testCloudinaryUpload();
