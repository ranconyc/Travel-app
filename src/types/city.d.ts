/**
 * City and location-related type definitions
 */

/**
 * Geographic coordinates (latitude/longitude)
 * @deprecated Use Coordinates from types/user.d.ts instead
 */
export type Coords = {
  lat: number;
  lng: number;
};

/**
 * Result from nearest city search
 */
export type NearestCityResult = {
  id: string | null;
  cityId: string | null;
  name: string | null;
  countryCode: string | null;
  imageHeroUrl?: string | null;
  radiusKm?: number | null;
  distanceKm: number | null;
};

/**
 * Result from reverse geocoding (coordinates to city name)
 */
export type ReverseGeocodeResult = {
  city: string | null;
  countryCode: string | null;
  label: string | null;
  boundingbox?: [number, number, number, number]; // @deprecated use boundingBox
  boundingBox?: [number, number, number, number];
};

/**
 * Detected city from user's location
 */
export type DetectedCity = {
  id: string | null;
  cityId: string | null;
  cityName: string | null;
  countryCode: string | null;
  label: string | null;
  source: "db" | "db-bbox" | "locationiq" | "api-created" | "unknown";
  distanceKm: number | null;
  radiusKm: number | null;
};
