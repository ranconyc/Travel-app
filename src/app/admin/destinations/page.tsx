import { getAllCountriesAction } from "@/domain/country/country.actions";
import { getAllCitiesAction } from "@/domain/city/city.actions";
import { getAllPlacesAction } from "@/domain/place/place.actions";
import DestinationsListClient from "./DestinationsListClient";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const [countriesRes, citiesRes, placesRes] = await Promise.all([
    getAllCountriesAction(undefined),
    getAllCitiesAction(undefined),
    getAllPlacesAction(undefined),
  ]);

  const countries = countriesRes.success ? (countriesRes.data ?? []) : [];
  const cities = citiesRes.success ? (citiesRes.data ?? []) : [];
  const places = placesRes.success ? (placesRes.data ?? []) : [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-sora">
        Destinations Management
      </h1>
      <DestinationsListClient
        countries={countries}
        cities={cities}
        places={places}
      />
    </div>
  );
}
