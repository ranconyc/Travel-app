import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getFavoritesWithDetails } from "@/lib/db/favorite.repo";
import FavoritesClient from "./FavoritesClient";

export const metadata = {
  title: "Saved Destinations | Travel App",
  description: "View your saved countries, cities, and places",
};

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/favorites");
  }

  const favorites = await getFavoritesWithDetails(session.user.id);

  return <FavoritesClient initialFavorites={favorites} />;
}
