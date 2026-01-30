"use client";

import { memo, useRef, useState, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import Image from "next/image";
import { CameraIcon, Check } from "lucide-react";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

const INITIAL_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500835595333-7253457f938c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=400&fit=crop",
];

function AvatarSectionClient() {
  const { control } = useFormContext();
  const { field } = useController({ control, name: "avatarUrl" }); // Schema uses avatarUrl
  const { field: publicIdField } = useController({
    control,
    name: "imagePublicId",
  });

  const [images, setImages] = useState<string[]>([]);
  const uploadingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uniqueImages = new Set<string>();
    if (field.value) uniqueImages.add(field.value);
    INITIAL_PLACEHOLDERS.forEach((img) => uniqueImages.add(img));
    setImages(Array.from(uniqueImages).slice(0, 6));
  }, [field.value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingRef.current) return;
    uploadingRef.current = true;

    try {
      const avatarUrl = URL.createObjectURL(file);
      field.onChange(avatarUrl);
      setImages((prev) =>
        [avatarUrl, ...prev.filter((img) => img !== avatarUrl)].slice(0, 6),
      );

      // Use centralized Cloudinary service
      const { uploadToCloudinary } =
        await import("@/lib/media/cloudinary.service");
      const result = await uploadToCloudinary(file);

      field.onChange(result.secure_url);
      publicIdField.onChange(result.public_id);
      setImages((prev) =>
        [result.secure_url, ...prev.filter((img) => img !== avatarUrl)].slice(
          0,
          6,
        ),
      );

      // Save media to database
      const { createAvatarMediaAction } =
        await import("@/domain/media/media.actions");
      await createAvatarMediaAction({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      console.error("[AvatarSection] Upload failed", err);
    } finally {
      uploadingRef.current = false;
    }
  };

  return (
    <div className="w-full mb-xl pt-md">
      <div className="relative flex gap-md overflow-x-auto pb-lg px-md no-scrollbar snap-x items-center min-h-[180px]">
        {images.map((img, idx) => {
          const isSelected = field.value === img;
          return (
            <div
              key={img}
              onClick={() => field.onChange(img)}
              className={`relative flex-shrink-0 transition-all duration-500 cursor-pointer snap-center
                ${isSelected ? "w-40 h-40 z-10" : "w-28 h-28 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 scale-90 hover:scale-95"}
              `}
            >
              <div
                className={`relative w-full h-full rounded-pill overflow-hidden border-4 transition-all duration-300 ${isSelected ? "border-brand shadow-xl scale-105" : "border-stroke"}`}
              >
                <Image
                  src={img}
                  alt={`option-${idx}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 120px"
                />
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-brand text-white rounded-full p-1.5 shadow-lg z-20 border-2 border-white">
                  <Check size={16} strokeWidth={4} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-md mt-lg">
        <Typography
          variant="tiny"
          color="sec"
          className="uppercase tracking-widest font-bold"
        >
          Profile Photo
        </Typography>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="primary"
          size="md"
          icon={<CameraIcon size={20} />}
          className="shadow-pill"
        >
          Edit Photo
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default memo(AvatarSectionClient);
