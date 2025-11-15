import * as z from "zod";

export const languageSchema = z.object({
  id: z.string(), // ObjectId as string
  code: z.string().min(2), // e.g. "en"
  name: z.string().min(1), // "English"
  nativeName: z.string().nullable().optional(), // "עברית", "日本語"
  flag: z.string().nullable().optional(), // "🇮🇱" | "🇺🇸" | "🌐"
});

// TypeScript type
export type Language = z.infer<typeof languageSchema>;

export const userLanguageSchema = z.object({
  id: z.string(), // join row id
  userId: z.string(), // User.id (ObjectId as string)
  languageId: z.string(), // Language.id
  proficiency: z.string().nullable().optional(), // "native" | "fluent" | ...
  // include nested language if loaded via include: { language: true }
  language: languageSchema.optional(),
});

// TypeScript type
export type UserLanguage = z.infer<typeof userLanguageSchema>;

export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]);
export type Gender = z.infer<typeof GenderEnum>;

const cityLiteSchema = z.any(); // TODO: replace with real city schema
const accountSchema = z.any(); // TODO: replace with real account schema
const sessionSchema = z.any(); // TODO: replace with real session schema
const userInterestSchema = z.any(); // TODO: replace with real user interest schema
const travelPersonaSchema = z.any(); // TODO: replace with real travel persona schema
const userVisitedCitySchema = z.any(); // TODO: replace with real visited city schema
const userWishlistCitySchema = z.any(); // TODO: replace with real wishlist city schema

export const userSchema = z.object({
  // ---- identifiers ----
  id: z.string(), // ObjectId as string

  // ---- basic info ----
  email: z.string().email().nullable().optional(),
  name: z.string().nullable().optional(), // full name if you use it
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  description: z.string().nullable().optional(),

  // ---- location / home base ----
  homeBaseCityId: z.string().nullable().optional(),
  homeBaseCity: cityLiteSchema.nullable().optional(), // populated if included

  // ---- dates & status ----
  birthday: z.date().nullable().optional(),
  emailVerified: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),

  // ---- profile meta ----
  gender: GenderEnum.nullable().optional(),
  image: z.string().url().nullable().optional(),
  passwordHash: z.string().nullable().optional(),
  profileCompleted: z.boolean().optional(),

  // ---- auth relations ----
  accounts: z.array(accountSchema).optional(),
  sessions: z.array(sessionSchema).optional(),

  // ---- current location / city ----
  currentLocation: z.unknown().nullable().optional(), // Json { type: "Point", coordinates: [lng, lat] }
  currentCityId: z.string().nullable().optional(),
  currentCity: cityLiteSchema.nullable().optional(),

  // ---- languages (explicit join) ----
  languages: z.array(userLanguageSchema).optional(),

  // ---- travel interests / persona ----
  interests: z.array(userInterestSchema).optional(),
  travelPersona: travelPersonaSchema.nullable().optional(),

  // ---- travel history ----
  visitedCities: z.array(userVisitedCitySchema).optional(),
  wishListCities: z.array(userWishlistCitySchema).optional(),
});

// TypeScript type for the *full* user (domain)
export type User = z.infer<typeof userSchema>;
