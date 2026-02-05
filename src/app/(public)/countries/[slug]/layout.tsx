import { getCountryWithCities } from "@/lib/db/country.repo";
import { Country } from "@/domain/country/country.schema";
import StoreInitializer from "./components/StoreInitializer";
import { notFound } from "next/navigation";
import PageNavigation from "@/components/molecules/PageNavigation";
import FavoriteButton from "@/components/atoms/FavoriteButton";
import { isFavoriteAction } from "@/domain/favorite/favorite.actions";
import { FavoriteType } from "@prisma/client";

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryWithCities(slug);

  if (!country) {
    notFound();
  }

  // Check if user has favorited this country
  const favoriteResult = await isFavoriteAction({
    type: FavoriteType.COUNTRY,
    entityId: country.id,
  });
  const isFavorited = favoriteResult.success
    ? favoriteResult.data?.isFavorited
    : false;

  return (
    <>
      <PageNavigation
        title={country.name}
        type="country"
        locationName={country.subRegion || country.region || ""}
        rightContent={
          <FavoriteButton
            type={FavoriteType.COUNTRY}
            entityId={country.id}
            initialIsFavorited={isFavorited}
          />
        }
      />
      <StoreInitializer country={country as unknown as Country} />
      {children}
    </>
  );
}
