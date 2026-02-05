"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = "Hero Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // 1) Instant preview relies on parent state update via onImageUploaded
      // But we can also show a loading state here if we want.

      // 2) Get Cloudinary signature
      const sigRes = await fetch("/api/destinations/upload", {
        method: "POST",
      });
      if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

      const {
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        transformation,
      } = await sigRes.json();

      // 3) Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("signature", signature);
      if (transformation) {
        formData.append("transformation", transformation);
      }

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData },
      );

      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }

      const result = await uploadRes.json();

      // 4) Update with CDN URL
      onImageUploaded(result.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-secondary mb-1">
        {label}
      </label>
      <div
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) await handleImageUpload(file);
          };
          input.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) await handleImageUpload(file);
        }}
        className={`relative border-2 border-dashed border-surface-secondary hover:border-brand rounded-lg p-md cursor-pointer transition-colors group ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {currentImageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
              <span className="text-white text-sm">
                Click or drag to replace
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary text-sm">
              Click or drag image here to upload
            </p>
            <p className="text-xs text-secondary/60 mt-1">
              Recommended: 1920x1080px
            </p>
          </div>
        )}
      </div>

      {/* Manual URL Input (fallback) */}
      <input
        value={currentImageUrl || ""}
        onChange={(e) => onImageUploaded(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors font-mono text-xs"
      />
    </div>
  );
}
