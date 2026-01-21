"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { prisma } from "@/lib/db/prisma";
import {
  getActiveVisit,
  createCityVisit,
  closeCityVisit,
} from "@/lib/db/cityVisit.repo";
import { revalidatePath } from "next/cache";

export const updateUserLocationAction = createSafeAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  async ({ lat, lng }, userId) => {
    // 1. Resolve city from coordinates (DB or API)
    const detectedCity = await findNearestCityFromCoords(lat, lng, {
      createIfMissing: true,
      searchRadiusKm: 120, // Reasonable radius for "Nearby"
    });

    if (!detectedCity || !detectedCity.id) {
      throw new Error("Could not identify city");
    }

    // 2. Get user's active city visit
    const activeVisit = await getActiveVisit(userId);

    // 3. Handle city visit tracking
    if (!activeVisit) {
      // First visit or no active visit - create new one
      await createCityVisit(userId, detectedCity.id, { lat, lng });
    } else if (activeVisit.cityId !== detectedCity.id) {
      // Changed cities - close current visit and create new one
      await closeCityVisit(activeVisit.id, { lat, lng });
      await createCityVisit(userId, detectedCity.id, { lat, lng });
    }
    // else: Same city - do nothing (visit remains open)

    // 4. Update user's current location
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentCityId: detectedCity.id,
        currentLocation: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    });

    // 5. Revalidate profile
    revalidatePath(`/profile/${userId}`);

    return detectedCity;
  },
);
