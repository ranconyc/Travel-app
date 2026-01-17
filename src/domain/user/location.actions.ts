"use server";

import { authOptions } from "@/lib/auth";
import { findNearestCityFromCoords } from "@/lib/db/cityLocation.repo";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateUserLocationAction(lat: number, lng: number) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Resolve city from coordinates (DB or API)
    const detectedCity = await findNearestCityFromCoords(lat, lng, {
      createIfMissing: true,
      searchRadiusKm: 120, // Reasonable radius for "Nearby"
    });

    if (!detectedCity || !detectedCity.id) {
      return { success: false, error: "Could not identify city" };
    }

    // 2. Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentCityId: detectedCity.id,
        currentLocation: [lng, lat],
      },
    });

    // 3. Revalidate profile
    revalidatePath(`/profile/${user.id}`);

    return { success: true, city: detectedCity };
  } catch (error) {
    console.error("updateUserLocationAction error:", error);
    return { success: false, error: "Failed to update location" };
  }
}
