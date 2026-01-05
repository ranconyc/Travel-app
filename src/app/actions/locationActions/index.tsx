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

  // console.log(`updateUserLocationWithCityAction coords ${userId}:`, coords);

  try {
    const detected = await findNearestCityFromCoords(coords.lat, coords.lng, {
      createIfMissing: true,
    });

    // console.log("findNearestCityFromCoords detected", detected);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentLocation: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
        currentCityId: detected.id ?? undefined,
      },
    });

    // --- Travel History Logic ---
    if (detected.id) {
      // Get the *latest* visit to see if we need to add a new timeline entry
      // Note: We cast to any because TS client isn't generated yet with new fields
      const lastVisit = await prisma.userVisitedCity.findFirst({
        where: { userId },
        orderBy: { arrivalDate: "desc" } as any,
      });

      // If never visited any city OR the last recorded city is different -> add new entry
      if (!lastVisit || lastVisit.cityId !== detected.id) {
        // console.log("Adding new city to travel history:", detected.cityName);

        // a) Close the previous visit if it exists and is still "open"
        if (lastVisit && !(lastVisit as any).departureDate) {
          await prisma.userVisitedCity.update({
            where: { id: lastVisit.id },
            data: {
              departureDate: new Date(),
            } as any,
          });
        }

        // b) Open the new visit
        await prisma.userVisitedCity.create({
          data: {
            userId,
            cityId: detected.id,
            // arrivalDate defaults to now()
          },
        });
      }
    }

    return { success: true, detected };
  } catch (error) {
    console.error("updateUserLocationWithCityAction error:", error);
    return { success: false, error: "Failed to update user location" };
  }
}
