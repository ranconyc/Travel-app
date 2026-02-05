"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/organisms/editors/ImageUploader";
import { createPlaceMediaAction } from "@/domain/media/media.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import { Plus } from "lucide-react";

interface UserMediaUploaderProps {
  placeId?: string;
  cityId?: string;
  countryId?: string;
  userId?: string; // Current user ID check
  trigger?: React.ReactNode;
}

export default function UserMediaUploader({
  placeId,
  cityId,
  countryId,
  userId,
  trigger,
}: UserMediaUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!userId) {
    return null; // Don't show upload if not logged in
  }

  const handleUpload = async (url: string) => {
    // 1. We have the URL from Cloudinary (via ImageUploader)
    // 2. Now save it to our DB linked to the place
    try {
      const result = await createPlaceMediaAction({
        url,
        publicId: url.split("/").pop() || "unknown", // Simple extraction or pass full obj if needed
        placeId,
        cityId,
        countryId,
      });

      if (result.success) {
        toast.success("Photo added to gallery! Thanks for sharing.");
        setIsOpen(false);
        router.refresh(); // Refresh to show new image
      } else {
        toast.error("Failed to save photo record.");
      }
    } catch (error) {
      console.error("Upload save error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button variant="outline" size="sm" icon={<Plus size={16} />}>
            Add Photo
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add a Photo"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Share your experience! Upload a photo for others to see.
          </p>
          <ImageUploader
            onImageUploaded={handleUpload}
            label="Select Photo"
            entityType={placeId ? "state" : "city"} // Mapping constraints of component, might need generic
            entityId={placeId || cityId || countryId}
          />
        </div>
      </Modal>
    </>
  );
}
