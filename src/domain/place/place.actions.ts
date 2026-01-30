"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  handleCreatePlace,
  handleUpdatePlace,
  handleDeletePlace,
  handleGetAllPlaces,
} from "@/domain/place/place.service";
import { PlaceSchema, PlaceUpdateSchema } from "@/domain/place/place.schema";

export const createPlaceAction = createAdminAction(
  PlaceSchema,
  async (data) => {
    return await handleCreatePlace(data);
  },
);

export const getAllPlacesAction = createPublicAction(
  z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
  async (input) => {
    return await handleGetAllPlaces(input?.limit, input?.offset);
  },
);

export const updatePlaceAction = createAdminAction(
  z.object({
    id: z.string(),
    data: PlaceUpdateSchema,
  }),
  async (input) => {
    return await handleUpdatePlace(input.id, input.data);
  },
);

export const deletePlaceAction = createAdminAction(
  z.object({ id: z.string() }),
  async (input) => {
    await handleDeletePlace(input.id);
  },
);
