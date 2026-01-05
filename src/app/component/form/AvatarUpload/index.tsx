"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MdEdit } from "react-icons/md";

type Props = {
  src: string | null; // allow null to avoid crashes if empty
  onSelect: (file: File, previewUrl: string) => void;
  size?: number;
  disabled?: boolean;
  inputId?: string; // optional for multiple instances
};

export default function AvatarUpload({
  src,
  onSelect,
  size = 96,
  disabled = false,
  inputId = "avatar-file",
}: Props) {
  const previewRef = useRef<string | null>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewRef.current && previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const handleFileChange = (file: File) => {
    // Generate preview URL safely
    const previewUrl = URL.createObjectURL(file);
    previewRef.current = previewUrl;
    onSelect(file, previewUrl);
  };

  return (
    <div className="grid place-items-center gap-2" aria-disabled={disabled}>
      <div className="relative inline-block" aria-disabled={disabled}>
        {/* Avatar circle */}
        <div
          className={`rounded-full overflow-hidden border bg-gray-200 ${
            disabled ? "opacity-60" : ""
          }`}
          style={{ width: size, height: size }}
        >
          {src ? (
            <Image
              src={src}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority // detected as LCP in profile forms
            />
          ) : (
            <Image
              src="/placeholder-avatar.png"
              alt="avatar"
              width={size}
              height={size}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 80px, 120px"
              priority={size > 100}
              loading={size > 100 ? "eager" : "lazy"}
            />
          )}
        </div>

        {/* Edit button */}
        {!disabled && (
          <label
            htmlFor={inputId}
            className="absolute -bottom-1 -right-1 z-10 grid place-items-center
                     rounded-full bg-amber-300 p-2 shadow-lg hover:bg-amber-400 cursor-pointer"
            aria-label="Change profile picture"
          >
            <MdEdit size={18} />
          </label>
        )}

        {/* Hidden file input */}
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleFileChange(file);
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-xs">
          {src ? "Change profile picture" : "Upload profile picture"}
        </p>
        <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
      </div>
    </div>
  );
}
