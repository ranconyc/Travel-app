import { getAllPlaces, getPlaceBySlug } from "@/lib/db/place.repo";

export async function getAllPlacesQuery() {
  const places = await getAllPlaces();
  return places;
}

export async function getPlaceBySlugQuery(slug: string) {
  const place = await getPlaceBySlug(slug);
  return place;
}
