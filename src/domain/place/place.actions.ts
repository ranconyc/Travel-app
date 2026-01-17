"use server";

import { createPlace } from "@/lib/db/place.repo";

export async function createPlaceAction(data: any) {
  const place = await createPlace(data);
  return place;
}

export async function getAllPlacesAction() {
  try {
    const { getAllPlaces } = await import("@/lib/db/place.repo");
    const places = await getAllPlaces();
    return { success: true, data: places };
  } catch (error) {
    console.error("getAllPlacesAction error:", error);
    return { success: false, error: "Failed to fetch places" };
  }
}

export async function updatePlaceAction(
  id: string,
  data: any,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Auth check
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Validate with Zod
    const { PlaceUpdateSchema } = await import("@/domain/place/place.schema");
    const validation = PlaceUpdateSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.error.issues.map((e: any) => e.message).join(", ")}`,
      };
    }

    const { updatePlace } = await import("@/lib/db/place.repo");
    const updated = await updatePlace(id, validation.data);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updatePlaceAction error:", error);
    return { success: false, error: error.message || "Failed to update place" };
  }
}

export async function deletePlaceAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Auth check
    const { deletePlace } = await import("@/lib/db/place.repo");
    await deletePlace(id);
    return { success: true };
  } catch (error: any) {
    console.error("deletePlaceAction error:", error);
    return { success: false, error: error.message || "Failed to delete place" };
  }
}
