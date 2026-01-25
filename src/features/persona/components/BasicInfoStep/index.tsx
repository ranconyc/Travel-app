"use client";

import { useState, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Input from "@/components/atoms/Input";
import { PersonaFormValues } from "@/domain/persona/persona.schema";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import AvatarCropModal from "@/features/persona/components/AvatarCropModal";
import { searchCitiesAction } from "@/domain/city/city.search.action";
import Image from "next/image";
import { CameraIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Typography from "@/components/atoms/Typography";

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

  const handleCropComplete = async (blob: Blob) => {
    setCropModalOpen(false);
    setIsUploading(true);

    const previewUrl = URL.createObjectURL(blob);
    setValue("avatarUrl", previewUrl);

    try {
      const { uploadToCloudinary } = await import("@/lib/media/cloudinary.service");
      const result = await uploadToCloudinary(blob);
      
      // Update with the secure URL from Cloudinary
      setValue("avatarUrl", result.secure_url);
      toast.success("Profile photo updated");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
      setValue("avatarUrl", "");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-md">
        <div
          className="relative group cursor-pointer"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="w-32 h-32 rounded-pill overflow-hidden border-4 border-stroke bg-surface relative transition-all group-hover:border-brand shadow-lg">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center bg-surface/50">
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
              <div className="w-full h-full flex items-center justify-center text-txt-sec bg-bg-sub">
                <CameraIcon size={40} />
              </div>
            )}
          </div>
          {!isUploading && (
            <div className="absolute bottom-1 right-1 bg-brand text-white p-2.5 rounded-full shadow-xl z-20 border-2 border-white hover:scale-110 transition-all">
              <CameraIcon size={16} strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div className="text-center space-y-xs">
          <Typography variant="h4" color="main">
            Profile Photo
          </Typography>
          <Typography
            variant="tiny"
            color="sec"
            className="uppercase tracking-widest font-bold"
          >
            Tap to upload
          </Typography>
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
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-col gap-1">
              <Autocomplete
                label="Home City"
                name="hometown"
                placeholder="Search your city..."
                value={value || ""}
                onQueryChange={onChange} // Update form text as user types
                loadOptions={async (q) => {
                  const res = await searchCitiesAction({ query: q, limit: 5 });
                  if (!res.success || !res.data) return [];
                  return res.data.map((c) => ({
                    id: c.id,
                    label: c.label,
                    subtitle: c.subtitle || undefined,
                  }));
                }}
                onSelect={(val) => {
                  onChange(val);
                }}
                error={errors.hometown?.message}
              />
              <Typography variant="tiny" color="sec" className="px-xs mt-xs">
                Where are you currently based?
              </Typography>
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
