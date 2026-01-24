"use client";

import { useState, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Input from "@/components/atoms/Input";
import { PersonaFormValues } from "@/features/persona/types/form";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import AvatarCropModal from "@/features/persona/components/AvatarCropModal";
import { searchCitiesAction } from "@/domain/city/city.search.action";
import Image from "next/image";
import { CameraIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BasicInfoStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PersonaFormValues>();

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = watch("avatarUrl");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImageUrl(url);
      setCropModalOpen(true);
    }
  };

  const uploadToCloudinary = async (blob: Blob) => {
    try {
      const sigRes = await fetch("/api/profile/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");

      const {
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        transformation,
      } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("signature", signature);
      if (transformation) formData.append("transformation", transformation);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData },
      );

      if (!res.ok) throw new Error(`Upload failed`);
      return res.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropModalOpen(false);
    setIsUploading(true);

    // Show Optimistic Preview
    const previewUrl = URL.createObjectURL(blob);
    setValue("avatarUrl", previewUrl);

    try {
      const result = await uploadToCloudinary(blob);
      setValue("avatarUrl", result.secure_url); // Update with real URL
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error("Fixed to upload photo");
      setValue("avatarUrl", ""); // Revert on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-md mb-2">
        <div
          className="relative group cursor-pointer"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-secondary bg-surface relative">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center bg-surface-secondary/50">
                <Loader2 className="animate-spin text-brand" />
              </div>
            ) : avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary bg-surface-secondary/30">
                <CameraIcon size={32} />
              </div>
            )}
          </div>
          {!isUploading && (
            <div className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
              <CameraIcon size={14} />
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold">Profile Photo</h3>
          <p className="text-xs text-secondary">Tap to upload</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-4">
        <Input
          label="First Name"
          placeholder="e.g. Alex"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <Controller
          control={control}
          name="hometown"
          render={({ field: { value, onChange, onBlur } }) => (
            <div className="flex flex-col gap-1">
              <Autocomplete
                label="Home City"
                name="hometown"
                placeholder="Search your city..."
                value={value || ""}
                onQueryChange={onChange} // Update form text as user types
                loadOptions={async (q) => {
                  const res = await searchCitiesAction({ query: q, limit: 5 });
                  const data = (res as any)?.data;
                  if (!data) return [];
                  return data.map((c: any) => ({
                    id: c.id,
                    label: c.label,
                    subtitle: c.subtitle || undefined,
                  }));
                }}
                onSelect={(val, opt) => {
                  onChange(val);
                }}
                error={errors.hometown?.message}
              />
              <p className="text-xs text-secondary px-1">
                Where are you currently based?
              </p>
            </div>
          )}
        />
      </div>

      {cropModalOpen && tempImageUrl && (
        <AvatarCropModal
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropModalOpen(false)}
        />
      )}
    </div>
  );
}
