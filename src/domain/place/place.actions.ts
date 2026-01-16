"use server";

import { createPlace } from "@/lib/db/place.repo";

export async function createPlaceAction(data: any) {
  const place = await createPlace(data);
  return place;
}
