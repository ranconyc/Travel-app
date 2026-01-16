import {
  getAllCities,
  getCityById,
  getCitiesWithCountry,
  findNearbyCities,
  findNearestCity,
  isCityExists,
  reverseGeocodeLocationIQ,
} from "@/lib/db/cityLocation.repo";

export async function getAllCitiesQuery() {
  const cities = await getAllCities();
  return cities;
}

export async function getCityByIdQuery(cityId: string) {
  const city = await getCityById(cityId);
  return city;
}

export async function getCityWithCountryQuery(slug: string) {
  const city = await getCitiesWithCountry(slug);
  return city;
}

export async function findNearbyCitiesQuery(
  lng: number,
  lat: number,
  km?: number,
  limit?: number
) {
  const cities = await findNearbyCities(lng, lat, km, limit);
  return cities;
}

export async function findNearestCityQuery(
  lng: number,
  lat: number,
  km?: number
) {
  const city = await findNearestCity(lng, lat, km);
  return city;
}

export async function isCityExistsQuery(cityId: string) {
  const exists = await isCityExists(cityId);
  return exists;
}

export async function reverseGeocodeQuery(lat: number, lng: number) {
  const result = await reverseGeocodeLocationIQ(lat, lng);
  return result;
}
