import {
  getAllCountries,
  getCountryWithCities,
  findBorderCountries,
} from "@/lib/db/country.repo";

export async function getAllCountriesQuery() {
  const countries = await getAllCountries();
  return countries;
}

export async function getCountryWithCitiesQuery(slug: string) {
  const country = await getCountryWithCities(slug);
  return country;
}

export async function findBorderCountriesQuery(bordersCCA3: string[]) {
  const countries = await findBorderCountries(bordersCCA3);
  return countries;
}
