import { getPlaceBySlug } from "@/lib/db/place.repo";
import PageNavigation from "@/components/molecules/PageNavigation";
import FavoriteButton from "@/components/atoms/FavoriteButton";
import { isFavoriteAction } from "@/domain/favorite/favorite.actions";
import { FavoriteType } from "@prisma/client";

export default async function PlaceSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = (await getPlaceBySlug(slug)) as {
    id: string;
    name: string;
    city?: { name?: string };
  } | null;

  if (!place) {
    return <>{children}</>;
  }

  // Check if user has favorited this place
  const favoriteResult = await isFavoriteAction({
    type: FavoriteType.PLACE,
    entityId: place.id,
  });
  const isFavorited = favoriteResult.success
    ? favoriteResult.data?.isFavorited
    : false;

  return (
    <>
      <PageNavigation
        title={place.name}
        locationName={place.city?.name || ""}
        rightContent={
          <FavoriteButton
            type={FavoriteType.PLACE}
            entityId={place.id}
            initialIsFavorited={isFavorited}
          />
        }
      />
      {children}
    </>
  );
}
