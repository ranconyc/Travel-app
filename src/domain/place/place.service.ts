import {
  createPlace,
  updatePlace,
  deletePlace,
  getAllPlaces,
} from "@/lib/db/place.repo";
import { PlaceSchema, PlaceUpdateSchema } from "@/domain/place/place.schema";
import { z } from "zod";

export async function handleCreatePlace(data: z.infer<typeof PlaceSchema>) {
  return await createPlace(data);
}

export async function handleUpdatePlace(
  id: string,
  data: z.infer<typeof PlaceUpdateSchema>,
) {
  return await updatePlace(id, data);
}

export async function handleDeletePlace(id: string) {
  return await deletePlace(id);
}

export async function handleGetAllPlaces(limit?: number, offset?: number) {
  return await getAllPlaces(limit, offset);
}
