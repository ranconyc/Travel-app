// app/actions/locationActions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import {
  findNearestCityFromCoords,
  getAllCities,
} from "@/lib/db/cityLocation.repo";
import { getAllCountries } from "@/lib/db/country.repo";

type Coords = {
  lat: number;
  lng: number;
};

export async function getAllCitiesAction() {
  return await getAllCities();
}

export async function getAllCountriesAction() {
  return await getAllCountries();
}

export async function updateUserLocationWithCityAction(
  userId: string,
  coords: Coords
): Promise<
  | {
      success: true;
      detected: Awaited<ReturnType<typeof findNearestCityFromCoords>>;
    }
  | { success: false; error: string }
> {
  if (!userId) {
    return { success: false, error: "Missing userId" };
  }

  if (
    typeof coords.lat !== "number" ||
    typeof coords.lng !== "number" ||
    Number.isNaN(coords.lat) ||
    Number.isNaN(coords.lng)
  ) {
    return { success: false, error: "Invalid coordinates" };
  }

  try {
    const detected = await findNearestCityFromCoords(coords.lat, coords.lng, {
      createIfMissing: true,
    });

    console.log("findNearestCityFromCoords detected", detected);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentLocation: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
        currentCityId: detected.cityId ?? undefined,
      },
    });

    return { success: true, detected };
  } catch (error) {
    console.error("updateUserLocationWithCityAction error:", error);
    return { success: false, error: "Failed to update user location" };
  }
}
