import * as z from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]);
export type Gender = z.infer<typeof GenderEnum>;

export const RoleEnum = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

// You can replace these with real schemas later
const cityLiteSchema = z.any();
const accountSchema = z.any();
const sessionSchema = z.any();
const userInterestSchema = z.any();
const travelPersonaSchema = z.any();
const tripSchema = z.any(); // Replace with real Trip schema later

export const userSchema = z.object({
  // ---- identifiers ----
  id: z.string(), // ObjectId as string

  // ---- basic info ----
  role: RoleEnum.default("USER"),
  email: z.string().email().nullable().optional(),
  name: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  description: z.string().nullable().optional(),

  // ---- location / home base ----
  homeBaseCityId: z.string().nullable().optional(),
  homeBaseCity: cityLiteSchema.nullable().optional(),

  // ---- current location / city ----
  currentLocation: z.unknown().nullable().optional(),
  currentCityId: z.string().nullable().optional(),
  currentCity: cityLiteSchema.nullable().optional(),

  // ---- travel history & planning ----
  trips: z.array(tripSchema).optional(),

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

  // ---- languages (string[] from Prisma) ----
  languages: z.array(z.string().min(2)).optional(), // e.g. ["en", "he"]

  // ---- travel interests / persona ----
  interests: z.array(userInterestSchema).optional(),
  travelPersona: travelPersonaSchema.nullable().optional(),

  // ---- media ----
  images: z.array(z.any()).optional(),
});

export type User = z.infer<typeof userSchema>;
