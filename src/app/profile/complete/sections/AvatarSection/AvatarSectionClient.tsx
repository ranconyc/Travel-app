"use client";

import { memo, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import AvatarUpload from "@/app/components/form/AvatarUpload";

function AvatarSectionClient() {
  const { control } = useFormContext();

  // image: string | null
  const { field } = useController({
    control,
    name: "image",
  });

  // public_id (optional field in form)
  const { field: publicIdField } = useController({
    control,
    name: "imagePublicId",
  });

  // Prevent double uploads
  const uploadingRef = useRef(false);

  /**
   * Upload file to Cloudinary using signed preset
   */
  const uploadToCloudinary = async (file: File) => {
    const sigRes = await fetch("/api/profile/upload", { method: "POST" });
    if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

    const { cloudName, apiKey, timestamp, folder, signature, transformation } =
      await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);
    if (transformation) {
      formData.append("transformation", transformation);
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }

    return res.json() as Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      bytes: number;
      format: string;
    }>;
  };

  /**
   * Handles when user selects a new avatar
   */
  const handleSelect = async (file: File, previewUrl: string) => {
    if (uploadingRef.current) return; // prevent spam clicks
    uploadingRef.current = true;

    try {
      // 1) Instant preview for UX
      field.onChange(previewUrl);

      // 2) Upload in background → replace with CDN URL
      const result = await uploadToCloudinary(file);

      field.onChange(result.secure_url);
      publicIdField.onChange(result.public_id); // optional: save in DB
    } catch (err) {
      console.error("Avatar upload error:", err);
      // Optional: show toast error
    } finally {
      uploadingRef.current = false;
    }
  };

  return <AvatarUpload src={field.value || null} onSelect={handleSelect} />;
}

export default memo(AvatarSectionClient);
