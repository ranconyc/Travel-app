import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import { City } from "@/domain/city/city.schema";
import StoreInitializer from "./components/StoreInitializer";

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = (await getCitiesWithCountry(slug)) as unknown as City;

  if (!city) {
    return <div>City not found</div>;
  }

  return (
    <>
      <StoreInitializer city={city} />
      {children}
    </>
  );
}
