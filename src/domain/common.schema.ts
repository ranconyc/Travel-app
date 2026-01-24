import * as z from "zod";

// --- Enums ---

export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]);
export type Gender = z.infer<typeof GenderEnum>;

export const RoleEnum = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

export const PlatformEnum = z.enum([
  "whatsapp",
  "facebook",
  "instagram",
  "tiktok",
  "reddit",
  "linkedin",
]);
export type Platform = z.infer<typeof PlatformEnum>;

/** Language representation with code and name */
export const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
  nativeName: z.string().optional(),
  flag: z.string().optional(),
});
export type Language = z.infer<typeof languageSchema>;

// --- Common Schemas ---

/** GeoJSON Point schema */
export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
});
export type GeoPoint = z.infer<typeof geoPointSchema>;

/** Simple latitude/longitude coordinates */
export const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
export type Coordinates = z.infer<typeof coordinatesSchema>;

/** Social link object with strict validation */
export const socialLinkSchema = z
  .object({
    platform: PlatformEnum,
    url: z.string().url({ message: "Invalid URL format" }),
  })
  .refine(
    (data) => {
      const domainMap: Record<string, string> = {
        whatsapp: "wa.me",
        facebook: "facebook.com",
        instagram: "instagram.com",
        tiktok: "tiktok.com",
        reddit: "reddit.com",
        linkedin: "linkedin.com",
      };

      return data.url.includes(domainMap[data.platform]);
    },
    {
      message: "URL does not match the selected platform",
      path: ["url"],
    },
  );

export type SocialLink = z.infer<typeof socialLinkSchema>;

export interface StatItem {
  value: string | number;
  label: string;
  icon?: React.ElementType;
  iconSize?: number;
}
