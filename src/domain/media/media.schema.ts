import { z } from "zod";

export const MediaTypeEnum = z.enum(["IMAGE", "VIDEO", "VR_360"]);
export type MediaType = z.infer<typeof MediaTypeEnum>;

export const MediaCategoryEnum = z.enum([
  "AVATAR",
  "COVER",
  "GALLERY",
  "REVIEW_PHOTO",
  "OFFICIAL",
]);
export type MediaCategory = z.infer<typeof MediaCategoryEnum>;

export const mediaSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  publicId: z.string(),
  type: MediaTypeEnum.default("IMAGE"),
  category: MediaCategoryEnum.default("GALLERY"),
  metadata: z.any().nullable(),
  userId: z.string().nullable().optional(),
  placeId: z.string().nullable().optional(),
  cityId: z.string().nullable().optional(),
  countryId: z.string().nullable().optional(),
  reviewId: z.string().nullable().optional(),
  createdAt: z.date(),
});

export type Media = z.infer<typeof mediaSchema>;
