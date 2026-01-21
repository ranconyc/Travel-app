// src/domain/user/completeProfile.schema.ts
import * as z from "zod";

// 1. Define allowed platforms based on our JSON metadata
import {
  GenderEnum,
  PlatformEnum,
  socialLinkSchema as SocialLinkSchema,
} from "@/domain/common.schema";

// SocialLinkSchema is now imported and aliased if needed, or we just use it directly.
// The array schema remains here as it's specific to this domain.
export const UserSocialLinksSchema = z.array(SocialLinkSchema);

// 4. Extract the TypeScript type from the schema for frontend use
export type UserSocialLinks = z.infer<typeof UserSocialLinksSchema>;

const languageSchema = z.string().min(2);
/**
 * Gender enum used in the profile.
 * Adjust values if your Prisma enum uses different casing.
 */
// GenderEnum now imported from common.schema via the block above

/**
 * Gender enum used in the profile.
 * Adjust values if your Prisma enum uses different casing.
 */
// export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]); // Use imported

/**
 * Form version allows also "" (no selection yet).
 */
export const GenderFormValue = GenderEnum.or(z.literal(""));

/**
 * Helper: validate that birthday is a valid ISO date in the past.
 * Expected format from the form: "YYYY-MM-DD".
 */
const birthdaySchema = z
  .string()
  .min(1, "Birthday is required")
  .refine((val) => {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    return d <= now;
  }, "Please enter a valid date in the past");

/**
 * Meta from external provider (LocationIQ) when the city does not yet exist
 * in your DB and will be created on submit.
 */
export const homeBaseLocationMetaSchema = z.object({
  provider: z.string().optional(),
  placeId: z.string(),
  lat: z.number(),
  lon: z.number(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  countryCode: z.string().min(2),
  displayName: z.string().nullable().optional(),
  boundingBox: z
    .tuple([z.number(), z.number(), z.number(), z.number()])
    .nullable()
    .optional(),
});

export type HomeBaseLocationMeta = z.infer<typeof homeBaseLocationMetaSchema>;

/**
 * Main complete profile schema.
 * This should match the fields used in CompleteProfileForm + updateProfile.
 */
export const completeProfileSchema = z.object({
  image: z.string().url().nullable().optional(),
  imagePublicId: z.string().nullable().optional(),

  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .max(100, "Last name is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  birthday: birthdaySchema,

  gender: GenderFormValue,

  /**
   * UI label we show in the input ("Tel Aviv, Israel").
   * This is never stored directly in Prisma.
   */
  homeBase: z.string().optional(),

  /**
   * DB City.id (ObjectId as string).
   * Optional here because for external cities we only have meta and create
   * the City on submit.
   */
  homeBaseCityId: z.string().nullable().optional(),

  occupation: z
    .string()
    .max(200, "Occupation is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  /**
   * Languages as codes, e.g. ["en", "he"].
   * languageSchema comes from user.schema.ts and is simply z.string().min(2).
   */
  languages: z
    .array(languageSchema)
    .min(1, "Please select at least one language"),

  /**
   * External location meta (LocationIQ) used when the city is not in DB yet.
   * We will use this on the server to call ensureCountryAndCityFromLocation().
   */
  homeBaseLocation: homeBaseLocationMetaSchema.nullable().optional(),
  socialLinks: UserSocialLinksSchema,
});
/**
 * At least one of homeBaseCityId or homeBaseLocation must be present.
 * We attach the error to "homeBase" so RHF will show it on the correct field.
 */
// .refine((val) => !!val.homeBaseCityId || !!val.homeBaseLocation, {
//   message: "Home base must be resolved to a city",
//   path: ["homeBase"],
// });

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
