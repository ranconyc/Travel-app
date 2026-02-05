"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createMedia, getUserMedia } from "./media.service";
import { MediaCategory, MediaType } from "@prisma/client";

interface CreateMediaInput {
  url: string;
  publicId: string;
  category?: MediaCategory;
  type?: MediaType;
  metadata?: Record<string, string | number | boolean | null>;
}

interface CreatePlaceMediaInput extends CreateMediaInput {
  placeId?: string;
  cityId?: string;
  countryId?: string;
}

/**
 * Creates a Media record for a Place/City/Country uploaded by a user
 */
export async function createPlaceMediaAction(input: CreatePlaceMediaInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const { placeId, cityId, countryId, ...mediaInput } = input;

    const media = await createMedia({
      url: mediaInput.url,
      publicId: mediaInput.publicId,
      type: mediaInput.type || "IMAGE",
      category: mediaInput.category || "GALLERY",
      metadata: mediaInput.metadata,
      userId: session.user.id,
      placeId,
      cityId,
      countryId,
    });

    if (placeId) {
      // Optimistic updates handled by client, but good to know
    }

    revalidatePath(`/profile/${session.user.id}`);

    return { success: true, data: media };
  } catch (error) {
    console.error("[createPlaceMediaAction] Error:", error);
    return { success: false, error: "Failed to create media record" };
  }
}

/**
 * Creates a Media record for the authenticated user
 * Used after uploading to Cloudinary to persist media in the database
 */
export async function createUserMediaAction(input: CreateMediaInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const media = await createMedia({
      url: input.url,
      publicId: input.publicId,
      type: input.type,
      category: input.category,
      metadata: input.metadata,
      userId: session.user.id,
    });

    revalidatePath(`/profile/${session.user.id}`);

    return { success: true, data: media };
  } catch (error) {
    console.error("[createUserMediaAction] Error:", error);
    return { success: false, error: "Failed to create media record" };
  }
}

/**
 * Creates an avatar media record and returns the media ID
 * Convenience wrapper for avatar uploads
 */
export async function createAvatarMediaAction(input: {
  url: string;
  publicId: string;
}) {
  return createUserMediaAction({
    ...input,
    category: "AVATAR",
    type: "IMAGE",
  });
}

/**
 * Gets all media for a user by category
 */
export async function getUserMediaAction(options?: {
  category?: MediaCategory;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const media = await getUserMedia(session.user.id, options?.category);

    return { success: true, data: media };
  } catch (error) {
    console.error("[getUserMediaAction] Error:", error);
    return { success: false, error: "Failed to fetch media" };
  }
}
