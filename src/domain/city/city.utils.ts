import { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";

export type BuildCityMetaParams = {
  name: string;
  countryCode: string;
  lat: number;
  lng: number;
  state?: string | null;
  stateCode?: string | null;
  stateType?: string | null;
  boundingBox?: [number, number, number, number] | null;
  placeId?: string;
  provider?: string;
};

/**
 * Utility to build a standardized CityMeta (HomeBaseLocationMeta) object
 */
export function buildCityMeta(
  params: BuildCityMetaParams,
): HomeBaseLocationMeta {
  return {
    city: params.name,
    displayName: params.name,
    state: params.state || null,
    stateCode: params.stateCode || null,
    stateType: params.stateType || null,
    country: params.countryCode, // defaulting country name to code if not provided
    countryCode: params.countryCode,
    lat: params.lat,
    lon: params.lng,
    boundingBox: params.boundingBox || null,
    provider: params.provider || "internal",
    placeId: params.placeId || "unknown",
  };
}
