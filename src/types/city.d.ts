export type NearestCityResult = {
  cityId: string | null;
  name: string | null;
  countryCode: string | null;
  imageHeroUrl?: string | null;
  radiusKm?: number | null;
  distanceKm: number | null;
};

export type ReverseGeocodeResult = {
  city: string | null;
  countryCode: string | null;
  label: string | null;
};

export type DetectedCity = {
  cityId: string | null;
  cityName: string | null;
  countryCode: string | null;
  label: string | null;
  source: "db" | "locationiq" | "api-created" | "unknown";
  distanceKm: number | null;
  radiusKm: number | null;
};
