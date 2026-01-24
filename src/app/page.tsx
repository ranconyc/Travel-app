import {
  getAllCountriesAction,
  getNearbyCountriesAction,
} from "@/domain/country/country.actions";
import {
  getNearbyCitiesAction,
  getAllCitiesAction,
} from "@/domain/city/city.actions";
import HomeClient from "./HomeClient";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchWeather } from "@/components/molecules/WeatherWidget/weather.service";

export default async function Home() {
  const queryClient = new QueryClient();
  const user = await getCurrentUser();
  console.log("user", user);
  const location = user?.currentLocation as {
    type: string;
    coordinates: [number, number];
  } | null;
  console.log("location", location);

  const hasLocation =
    location?.coordinates &&
    location.coordinates[0] !== 0 &&
    location.coordinates[1] !== 0;

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
      const result = coords
        ? await getNearbyCitiesAction({ ...coords, km: 500, limit: 20 })
        : await getAllCitiesAction({ limit: 20 });
      return result.success ? result.data : [];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient
        dbLocation={coords ? { lat: coords.lat, lng: coords.lng } : undefined}
      />
    </HydrationBoundary>
  );
}
