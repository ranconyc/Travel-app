"use client";

import { useEffect, useRef } from "react";
import { CameraIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/atoms/Avatar";
import Typography from "@/components/atoms/Typography";

type Props = {
  src: string | null; // allow null to avoid crashes if empty
  onSelect: (file: File, previewUrl: string) => void;
  size?: number;
  disabled?: boolean;
  inputId?: string; // optional for multiple instances
  className?: string; // Additional class name for container
  initials?: string;
};

export default function AvatarUpload({
  src,
  onSelect,
  size = 96,
  disabled = false,
  inputId = "avatar-file",
  className,
  initials,
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
    <div
      className={cn("flex flex-col items-center gap-4 py-2", className)}
      aria-disabled={disabled}
    >
      <div className="relative inline-block" aria-disabled={disabled}>
        {/* Avatar Display */}
        <Avatar
          image={src || undefined}
          variant="square"
          alt="Profile Avatar"
          size={size}
          initials={initials}
          border
          className={cn(disabled ? "opacity-60" : "")}
        />

        {/* Edit Action Overlay */}
        {!disabled && (
          <label
            htmlFor={inputId}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 
                       cursor-pointer group"
            aria-label="Change profile picture"
          >
            <div
              className="bg-brand text-white flex items-center gap-2 px-4 py-1.5 
                          rounded-full shadow-lg transition-transform group-hover:scale-105"
            >
              <CameraIcon size={14} />
              <Typography variant="label-sm" color="white" weight="bold">
                Edit
              </Typography>
            </div>
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

      <div className="text-center space-y-1 mt-2">
        <Typography variant="caption" color="main" weight="medium">
          {src ? "Change profile picture" : "Upload profile picture"}
        </Typography>
        <Typography variant="caption-sm" color="sec">
          JPG, PNG or GIF (max. 5MB)
        </Typography>
      </div>
    </div>
  );
}
