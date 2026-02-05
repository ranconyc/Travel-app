import React, { useState } from "react";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import Modal from "@/components/molecules/Modal";
import UserMediaUploader from "./UserMediaUploader";

interface PlaceGalleryProps {
  media: any[]; // Using any[] to match Prisma Media type
  heroImage?: string | null;
  className?: string;
  placeId?: string;
  currentUserId?: string;
}

export default function PlaceGallery({
  media,
  heroImage,
  className = "",
  placeId,
  currentUserId,
}: PlaceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter out the hero image if it's already in the gallery to avoid duplication, optional
  // For now, let's just use all valid images
  const images =
    media?.filter((m) => m.url).map((m) => m.url) ||
    (heroImage ? [heroImage] : []);

  if (images.length === 0) return null;

  // We show up to 5 images in a bento grid
  const displayImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <>
      <div
        className={`grid grid-cols-4 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden ${className}`}
      >
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 transition-opacity bg-surface-secondary"
          onClick={() => setSelectedImage(displayImages[0])}
        >
          {displayImages[0] && (
            <ImageWithFallback
              src={displayImages[0]}
              fill
              alt="Gallery image 1"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* Secondary images and Add Button */}
        <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2 gap-2">
          {displayImages.slice(1).map((img, index) => (
            <div
              key={index}
              className="relative cursor-pointer hover:opacity-95 transition-opacity w-full h-full bg-surface-secondary"
              onClick={() => setSelectedImage(img)}
            >
              <ImageWithFallback
                src={img}
                fill
                alt={`Gallery image ${index + 2}`}
                className="object-cover w-full h-full"
              />
              {/* Overlay for the last image if there are more */}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Add Photo Button Slot - only if we have space (less than 4 secondary images) or as an overlay/action elsewhere? 
              Actually, let's put it as the last item if we have space (< 5 images total) 
              OR if we have 5 images, maybe we don't show it in the grid?
              Better approach: Always allow adding, maybe effectively "taking a slot" or just a floating button? 
              Let's make it simple: If we have < 5 images, it takes a slot. 
              If we have 5, we rely on the user seeing the "+" button in the header or elsewhere? 
              
              Alternative: The user requested a feature to add a picture. 
              Let's render it as a specific tile if there's room, or replace the last tile?
              
              Let's just append it to the grid if length < 5. 
              If length >= 5, we might need another UI element. 
              
              For now, let's ALWAYS render the uploader as a small floating action or a dedicated slot if possible.
              Let's put it in the "See All" overlay or just a floating button on top of the gallery?
          */}
          {currentUserId && placeId && displayImages.length < 5 && (
            <div className="relative w-full h-full bg-surface-secondary/30 hover:bg-surface-secondary/50 rounded-lg border-2 border-dashed border-surface-secondary flex items-center justify-center transition-colors">
              <UserMediaUploader
                placeId={placeId}
                userId={currentUserId}
                trigger={
                  <div className="flex flex-col items-center gap-2 cursor-pointer text-secondary hover:text-brand transition-colors p-4">
                    <span className="text-2xl font-light">+</span>
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Add
                    </span>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>

      {currentUserId && placeId && displayImages.length >= 5 && (
        <div className="flex justify-end mt-2">
          <UserMediaUploader placeId={placeId} userId={currentUserId} />
        </div>
      )}

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        variant="popup"
        className="max-w-4xl p-0 bg-transparent shadow-none"
      >
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90">
          {selectedImage && (
            <ImageWithFallback
              src={selectedImage}
              fill
              alt="Gallery view"
              className="object-contain"
            />
          )}
        </div>
      </Modal>
    </>
  );
}
