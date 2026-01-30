import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import { City } from "@/domain/city/city.schema";
import StoreInitializer from "./components/StoreInitializer";
import PageNavigation from "@/components/molecules/PageNavigation";
import FavoriteButton from "@/components/atoms/FavoriteButton";
import { isFavoriteAction } from "@/domain/favorite/favorite.actions";
import { FavoriteType } from "@prisma/client";

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

  // Check if user has favorited this city
  const favoriteResult = await isFavoriteAction({
    type: FavoriteType.CITY,
    entityId: city.id || "",
  });
  const isFavorited = favoriteResult.success
    ? favoriteResult.data?.isFavorited
    : false;

  return (
    <>
      <PageNavigation
        title={city.name}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locationName={
          (city as unknown as { country?: { name?: string } }).country?.name ||
          ""
        }
        rightContent={
          <FavoriteButton
            type={FavoriteType.CITY}
            entityId={city.id || ""}
            initialIsFavorited={isFavorited}
          />
        }
      />
      <StoreInitializer city={city} />
      {children}
    </>
  );
}
