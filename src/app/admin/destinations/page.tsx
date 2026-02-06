import { getAllCountriesAction } from "@/domain/country/country.actions";
import { getAllCitiesAction } from "@/domain/city/city.actions";
import { getAllPlacesAction } from "@/domain/place/place.actions";
import { getAllStatesAction } from "@/domain/state/state.actions";
import { getSession } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import DestinationsListClient from "./DestinationsListClient";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  // Check admin role
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const [countriesRes, citiesRes, placesRes, statesRes] = await Promise.all([
    getAllCountriesAction(undefined),
    getAllCitiesAction(undefined),
    getAllPlacesAction(undefined),
    getAllStatesAction({ limit: 1000 }), // Get all states (pagination TODO for later)
  ]);

  const countries = countriesRes.success ? (countriesRes.data ?? []) : [];
  const cities = citiesRes.success ? (citiesRes.data ?? []) : [];
  const places = placesRes.success ? (placesRes.data ?? []) : [];

  // Custom action returns { success: true, data: ... } or { success: false }
  let states: any[] = [];
  if (statesRes.success && "data" in statesRes) {
    states = statesRes.data ?? [];
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-sora">
        Destinations Management
      </h1>
      <DestinationsListClient
        countries={countries}
        states={states}
        cities={cities}
        places={places}
      />
    </div>
  );
}
