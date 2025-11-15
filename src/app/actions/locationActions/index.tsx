// app/actions/locationActions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { detectCityFromCoords } from "@/lib/db/city";

type Coords = {
  lat: number;
  lng: number;
};

// Server action to update user's location + city
export async function updateUserLocationWithCityAction(
  userId: string,
  coords: Coords
) {
  if (!userId) return;

  // 1) detect city from coordinates (DB + LocationIQ fallback)
  const detected = await detectCityFromCoords(coords.lat, coords.lng);

  // 2) update user document – adjust field names to your schema
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentLat: coords.lat,
      currentLng: coords.lng,
      currentCityId: detected.cityId ?? undefined,
      currentCityLabel: detected.label ?? undefined,
      // you can also store "lastLocationSource" if you want:
      // locationSource: detected.source,
    },
  });

  return detected;
}
