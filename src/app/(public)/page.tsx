import {
  getAllCountriesAction,
  getNearbyCountriesAction,
} from "@/domain/country/country.actions";
import {
  getNearbyCitiesAction,
  getAllCitiesAction,
} from "@/domain/city/city.actions";
import { getAllPlacesAction } from "@/domain/place/place.actions";
import HomeClient from "./HomeClient";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchWeather } from "@/components/molecules/WeatherWidget/weather.service";
import { GeoPoint } from "@/domain/common.schema";

export default async function Home() {
  const queryClient = new QueryClient();
  // GET THE CURRENT USER
  const user = await getCurrentUser();
  // Get location as GeoPoint
  const location = user?.currentLocation as GeoPoint;
  // Check if location is valid
  const hasLocation =
    location?.coordinates &&
    location.coordinates[0] !== 0 &&
    location.coordinates[1] !== 0;

  // Get coordinates
  const coords = hasLocation
    ? { lng: location.coordinates[0], lat: location.coordinates[1] }
    : undefined;

  // Prefetch weather
  if (coords) {
    await queryClient.prefetchQuery({
      queryKey: ["weather", coords.lat, coords.lng],
      queryFn: () => fetchWeather(coords.lat, coords.lng),
    });
  }

  // Prefetch countries
  await queryClient.prefetchQuery({
    queryKey: ["countries", coords],
    queryFn: async () => {
      const result = coords
        ? await getNearbyCountriesAction({ ...coords, limit: 20 })
        : await getAllCountriesAction({ limit: 20 });
      return result.success ? result.data : [];
    },
  });

  // Prefetch cities
  await queryClient.prefetchQuery({
    queryKey: ["cities", coords],
    queryFn: async () => {
      let result;
      if (coords) {
        result = await getNearbyCitiesAction({
          ...coords,
          km: 3000,
          limit: 20,
        });

        // Fallback to global if nearby is empty (Resilient SSR)
        if (result.success && (!result.data || result.data.length === 0)) {
          result = await getAllCitiesAction({ limit: 20 });
        }
      } else {
        result = await getAllCitiesAction({ limit: 20 });
      }
      return result.success ? result.data : [];
    },
  });

  // Fetch places server-side
  const placesResult = await getAllPlacesAction({});
  const initialPlaces = placesResult.success ? placesResult.data : [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient
        dbLocation={coords ? { lat: coords.lat, lng: coords.lng } : undefined}
        initialPlaces={initialPlaces as any}
      />
    </HydrationBoundary>
  );
}
