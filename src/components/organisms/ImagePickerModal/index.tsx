"use client";

import { useState, useCallback } from "react";
import { X, Search, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";

export interface ImageResult {
  id: string;
  previewUrl: string;
  fullUrl: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  source: "unsplash" | "pexels";
  attribution: string;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (cloudinaryUrl: string, attribution: ImageResult) => void;
  defaultQuery?: string;
  entityType?: "country" | "city" | "state";
  entityId?: string;
}

type ImageSource = "unsplash" | "pexels";

export default function ImagePickerModal({
  isOpen,
  onClose,
  onImageSelected,
  defaultQuery = "",
  entityType,
  entityId,
}: ImagePickerModalProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [activeSource, setActiveSource] = useState<ImageSource>("unsplash");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchImages = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await fetch(
        `/api/admin/images/search/${activeSource}?query=${encodeURIComponent(query)}&count=12`,
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setImages(data.images || []);
      }
    } catch (err) {
      setError("Failed to search images. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query, activeSource]);

  const handleSelectImage = async (image: ImageResult) => {
    setSelectedImage(image);
    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/images/upload-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: image.fullUrl,
          entityType,
          entityId,
          attribution: {
            photographer: image.photographer,
            photographerUrl: image.photographerUrl,
            source: image.source,
            originalUrl: image.fullUrl,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSelectedImage(null);
      } else {
        onImageSelected(data.cloudinaryUrl, image);
        onClose();
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      setSelectedImage(null);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-surface-secondary">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-secondary">
          <h2 className="text-xl font-bold font-sora">Choose Hero Image</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-surface-secondary">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchImages()}
                placeholder="Search for images..."
                className="w-full pl-10 pr-4 py-2 bg-surface-secondary rounded-lg border border-surface-tertiary focus:border-brand focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={searchImages}
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Source Tabs */}
          <div className="flex gap-2 mt-3">
            {(["unsplash", "pexels"] as const).map((source) => (
              <button
                key={source}
                onClick={() => {
                  setActiveSource(source);
                  if (query.trim()) searchImages();
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeSource === source
                    ? "bg-brand text-white"
                    : "bg-surface-secondary text-secondary hover:bg-surface-tertiary"
                }`}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="text-center py-8 text-red-400">{error}</div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-brand" size={32} />
            </div>
          )}

          {!isLoading && images.length === 0 && !error && (
            <div className="text-center py-12 text-secondary">
              {query
                ? "No images found. Try a different search."
                : "Enter a search term to find images."}
            </div>
          )}

          {!isLoading && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleSelectImage(image)}
                  disabled={isUploading}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.id === image.id
                      ? "border-brand ring-2 ring-brand/50"
                      : "border-transparent hover:border-brand/50"
                  } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Image
                    src={image.previewUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Selection overlay */}
                  {selectedImage?.id === image.id && isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs truncate">
                        {image.photographer}
                      </p>
                      <div className="flex items-center gap-1 text-white/70 text-xs">
                        <span className="capitalize">{image.source}</span>
                        <ExternalLink size={10} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Attribution Notice */}
        <div className="p-3 border-t border-surface-secondary bg-surface-secondary/50">
          <p className="text-xs text-secondary text-center">
            Images from Unsplash and Pexels. Attribution will be saved with the
            image.
          </p>
        </div>
      </div>
    </div>
  );
}
