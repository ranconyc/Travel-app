"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  createPlace,
  getAllPlaces,
  updatePlace,
  deletePlace,
} from "@/lib/db/place.repo";
import { PlaceSchema, PlaceUpdateSchema } from "@/domain/place/place.schema";

export const createPlaceAction = createAdminAction(
  PlaceSchema,
  async (data) => {
    return await createPlace(data);
  },
);

export const getAllPlacesAction = createPublicAction(z.any(), async () => {
  return await getAllPlaces();
});

export const updatePlaceAction = createAdminAction(
  z.object({
    id: z.string(),
    data: PlaceUpdateSchema,
  }),
  async (input) => {
    return await updatePlace(input.id, input.data);
  },
);

export const deletePlaceAction = createAdminAction(
  z.object({ id: z.string() }),
  async (input) => {
    await deletePlace(input.id);
  },
);
