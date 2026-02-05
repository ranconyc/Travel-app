import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Upload an image from an external URL to Cloudinary.
 * This is used by the image picker to save selected images from Unsplash/Pexels.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, entityType, entityId, attribution } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 },
      );
    }

    // Determine folder based on entity type
    const folder = entityType
      ? `destinations/${entityType}s`
      : process.env.CLOUDINARY_UPLOAD_FOLDER_DESTINATIONS || "destinations";

    const timestamp = Math.floor(Date.now() / 1000);

    // Transformation for hero images
    const transformation = "w_1920,h_1080,c_fill,q_auto:good,f_auto";

    // Generate public_id from entity info if available
    const publicId = entityId
      ? `${entityType}_${entityId}_${Date.now()}`
      : `destination_${Date.now()}`;

    // Build params string for signature (alphabetical order)
    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}&transformation=${transformation}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    // Prepare form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", imageUrl); // Cloudinary accepts URLs directly
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("transformation", transformation);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Cloudinary upload error:", errorText);
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 },
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json({
      success: true,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      attribution, // Pass back for storage
    });
  } catch (error) {
    console.error("Error in upload-from-url:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
