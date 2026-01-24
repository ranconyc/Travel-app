"use client";

import { memo, useRef, useState, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import Image from "next/image";
import { CameraIcon } from "lucide-react";

const INITIAL_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&h=400&fit=crop", // Santorini
  "https://images.unsplash.com/photo-1500835595333-7253457f938c?w=400&h=400&fit=crop", // Bali
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop", // Alps/Lake
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop", // Paris
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=400&fit=crop", // Venice
];

function AvatarSectionClient() {
  const { control } = useFormContext();
  const { field } = useController({ control, name: "image" });
  const { field: publicIdField } = useController({
    control,
    name: "imagePublicId",
  });

  const [images, setImages] = useState<string[]>([]);
  const uploadingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize images with current value and placeholders
  useEffect(() => {
    const uniqueImages = new Set<string>();
    if (field.value) uniqueImages.add(field.value);
    INITIAL_PLACEHOLDERS.forEach((img) => uniqueImages.add(img));
    setImages(Array.from(uniqueImages).slice(0, 6));
    // We only want to initialize this once, but field.value is needed for the first run
  }, [field.value]);

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
    if (transformation) formData.append("transformation", transformation);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error(`Cloudinary upload failed`);
    return res.json();
  };

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

      const result = await uploadToCloudinary(file);
      field.onChange(result.secure_url);
      publicIdField.onChange(result.public_id);
      setImages((prev) =>
        [result.secure_url, ...prev.filter((img) => img !== avatarUrl)].slice(
          0,
          6,
        ),
      );
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      uploadingRef.current = false;
    }
  };

  return (
    <div className="w-full mb-8 pt-md">
      <div className="relative flex gap-md overflow-x-auto pb-md px-4 no-scrollbar snap-x items-center min-h-[160px]">
        {images.map((img, idx) => {
          const isSelected = field.value === img;
          return (
            <div
              key={img}
              onClick={() => field.onChange(img)}
              className={`relative flex-shrink-0 transition-all duration-300 cursor-pointer snap-center
                ${isSelected ? "w-40 h-40 z-10" : "w-28 h-28 opacity-60 hover:opacity-100"}
                ${idx === 0 ? "absolot l-0" : ""}
              `}
            >
              <Image
                src={img}
                alt={`option-${idx}`}
                fill
                className={`object-cover rounded-3xl border-2 ${isSelected ? "border-brand shadow-lg" : "border-transparent"}`}
                sizes="(max-width: 768px) 160px, 120px"
              />
            </div>
          );
        })}
        {/* Placeholder for "Add" if needed, but we use the Edit button below */}
      </div>

      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-full hover:bg-brand-hover transition-all active:scale-95 shadow-md"
        >
          <CameraIcon size={20} />
          <span className="font-bold">Edit</span>
        </button>
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
