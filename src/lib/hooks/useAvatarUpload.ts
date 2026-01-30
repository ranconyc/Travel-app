import { useState } from "react";
import { toast } from "sonner";

interface UseAvatarUploadOptions {
  onSuccess: (url: string, publicId?: string) => void;
  onError?: (error: unknown) => void;
}

interface UseAvatarUploadReturn {
  isUploading: boolean;
  cropModalOpen: boolean;
  tempImageUrl: string | null;
  handleSelect: (file: File, previewUrl: string) => void;
  handleCropComplete: (blob: Blob) => Promise<void>;
  setCropModalOpen: (open: boolean) => void;
  setTempImageUrl: (url: string | null) => void;
}

/**
 * Custom hook for avatar upload functionality
 *
 * Consolidates avatar upload state management and logic:
 * - File selection
 * - Crop modal state
 * - Upload to Cloudinary
 * - Error handling
 *
 * @example
 * ```tsx
 * const { isUploading, cropModalOpen, tempImageUrl, handleSelect, handleCropComplete, setCropModalOpen } =
 *   useAvatarUpload({
 *     onSuccess: (url) => setValue("avatarUrl", url)
 *   });
 *
 * return (
 *   <>
 *     <AvatarUpload src={avatarUrl} onSelect={handleSelect} disabled={isUploading} />
 *     {cropModalOpen && <AvatarCropModal imageUrl={tempImageUrl} onCropComplete={handleCropComplete} />}
 *   </>
 * );
 * ```
 */
export function useAvatarUpload({
  onSuccess,
  onError,
}: UseAvatarUploadOptions): UseAvatarUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const handleSelect = (file: File, previewUrl: string) => {
    setTempImageUrl(previewUrl);
    setCropModalOpen(true);
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropModalOpen(false);
    setIsUploading(true);

    // Create preview URL for immediate feedback
    const previewUrl = URL.createObjectURL(blob);
    onSuccess(previewUrl); // Update UI immediately with preview

    try {
      // Dynamically import to avoid bundling if not used
      const { uploadToCloudinary } =
        await import("@/lib/media/cloudinary.service");

      const result = await uploadToCloudinary(blob);

      // Update with the secure URL from Cloudinary
      onSuccess(result.secure_url, result.public_id);
      toast.success("Profile photo updated");

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("[useAvatarUpload] Upload error:", error);
      toast.error("Failed to upload photo");

      if (onError) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    cropModalOpen,
    tempImageUrl,
    handleSelect,
    handleCropComplete,
    setCropModalOpen,
    setTempImageUrl,
  };
}
