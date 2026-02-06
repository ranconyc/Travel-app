"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import ImagePickerModal from "@/components/organisms/ImagePickerModal";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string, publicId?: string) => void;
  label?: string;
  entityType?: "country" | "city" | "state";
  entityId?: string;
  defaultSearchQuery?: string;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = "Hero Image",
  entityType,
  entityId,
  defaultSearchQuery = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Get Cloudinary signature
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

      // Upload to Cloudinary
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

      onImageUploaded(result.secure_url, result.public_id);
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

      {/* Search Stock Photos Button */}
      <button
        type="button"
        onClick={() => setShowImagePicker(true)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-surface-secondary hover:bg-surface-tertiary rounded-lg text-sm font-medium transition-colors"
      >
        <Search size={16} />
        Search Stock Photos (Unsplash / Pexels)
      </button>

      {/* Manual URL Input (fallback) */}
      <input
        value={currentImageUrl || ""}
        onChange={(e) => onImageUploaded(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors font-mono text-xs"
      />

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={(cloudinaryUrl, publicId) => {
          onImageUploaded(cloudinaryUrl, publicId);
          toast.success("Image selected and saved!");
        }}
        defaultQuery={defaultSearchQuery}
        entityType={entityType}
        entityId={entityId}
      />
    </div>
  );
}
