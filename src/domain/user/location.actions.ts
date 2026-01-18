"use server";

import { authOptions } from "@/lib/auth";
import { findNearestCityFromCoords } from "@/lib/db/cityLocation.repo";
import { prisma } from "@/lib/db/prisma";
import {
  getActiveVisit,
  createCityVisit,
  closeCityVisit,
} from "@/lib/db/cityVisit.repo";
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

    // 2. Get user's active city visit
    const activeVisit = await getActiveVisit(user.id);

    // 3. Handle city visit tracking
    if (!activeVisit) {
      // First visit or no active visit - create new one
      await createCityVisit(user.id, detectedCity.id, { lat, lng });
    } else if (activeVisit.cityId !== detectedCity.id) {
      // Changed cities - close current visit and create new one
      await closeCityVisit(activeVisit.id, { lat, lng });
      await createCityVisit(user.id, detectedCity.id, { lat, lng });
    }
    // else: Same city - do nothing (visit remains open)

    // 4. Update user's current location
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentCityId: detectedCity.id,
        currentLocation: [lng, lat],
      },
    });

    // 5. Revalidate profile
    revalidatePath(`/profile/${user.id}`);

    return { success: true, city: detectedCity };
  } catch (error) {
    console.error("updateUserLocationAction error:", error);
    return { success: false, error: "Failed to update location" };
  }
}
