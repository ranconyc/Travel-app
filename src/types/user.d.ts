/**
 * User-related type definitions
 * Based on domain/user/user.schema.ts
 */

import { User } from "@/domain/user/user.schema";

/**
 * Language representation with code, name, and optional metadata
 */
export type Language = {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
};

/**
 * Geographic coordinates (latitude/longitude)
 */
export type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * Alias for Coordinates (used in some legacy code)
 */
export type Coords = Coordinates;

/**
 * Form values for completing user profile
 */
export type CompleteProfileFormValues = {
  image: string | null;
  firstName: string;
  lastName?: string;
  birthday: string; // ISO string
  gender: "MALE" | "FEMALE" | "NON_BINARY" | "";
  homeBase: string; // cityId
  occupation?: string;
  languages: Language[];
};

/**
 * User result from nearby search with distance
 */
export type NearbyUserResult = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  birthday: Date | null;
  gender: string | null;
  occupation: string | null;
  description: string | null;
  languages: unknown;
  homeBaseCityId: string | null;
  homeBaseCity?: {
    id: string | null;
    name: string | null;
    country?: {
      id: string | null;
      name: string | null;
    } | null;
  } | null;
  distanceKm: number | null;
};

/**
 * Extended user type with additional profile data
 */
export type ProfileUser = User & {
  homeBaseCity?: {
    id: string;
    name: string;
    country?: {
      id: string;
      name: string;
    } | null;
  } | null;
};

/**
 * Language item for UI display
 */
export type LanguageItem = {
  code: string;
  name: string;
  nativeName?: string;
};
