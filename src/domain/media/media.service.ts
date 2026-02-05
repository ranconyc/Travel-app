import { MediaCategory, MediaType } from "@prisma/client";
import {
  createMedia as createMediaRepo,
  getUserMedia as getUserMediaRepo,
} from "@/lib/db/media.repo";

export interface CreateMediaData {
  url: string;
  publicId: string;
  category?: MediaCategory;
  type?: MediaType;
  metadata?: Record<string, string | number | boolean | null>;
  userId: string;
  placeId?: string;
  cityId?: string;
  countryId?: string;
}

/**
 * Creates a Media record
 */
export async function createMedia(data: CreateMediaData) {
  return createMediaRepo({
    url: data.url,
    publicId: data.publicId,
    type: data.type ?? "IMAGE",
    category: data.category ?? "GALLERY",
    metadata: data.metadata ?? undefined,
    user: { connect: { id: data.userId } },
    place: data.placeId ? { connect: { id: data.placeId } } : undefined,
    city: data.cityId ? { connect: { id: data.cityId } } : undefined,
    country: data.countryId ? { connect: { id: data.countryId } } : undefined,
  });
}

/**
 * Gets all media for a user by category
 */
export async function getUserMedia(userId: string, category?: MediaCategory) {
  return getUserMediaRepo(userId, category);
}
