"use client";
import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import AvatarUpload from "@/app/component/form/AvatarUpload";

function AvatarSectionInner() {
  const { control } = useFormContext();
  const { field } = useController({ control, name: "image" }); // image: string

  const uploadToCloudinary = async (file: File) => {
    console.log("Uploading to Cloudinary...", file);
    const sigRes = await fetch("/api/profile/upload", { method: "POST" });
    if (!sigRes.ok) throw new Error("Failed to get signature");
    const { cloudName, apiKey, timestamp, folder, signature } =
      await sigRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: form,
      }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Upload failed (${res.status}) ${body}`);
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

  const handleSelect = async (file: File, previewUrl: string) => {
    console.log("Avatar selected", { file, previewUrl });

    // 1) Immediate preview (RHF controlled value)
    field.onChange(previewUrl);

    // 2) Background upload -> swap to CDN URL
    try {
      const result = await uploadToCloudinary(file);
      field.onChange(result.secure_url);
    } catch (err) {
      console.error("Upload error", err);
      // Optional: toast / set error field / revert preview
    }
  };

  return <AvatarUpload src={field.value || null} onSelect={handleSelect} />;
}

export default memo(AvatarSectionInner);
