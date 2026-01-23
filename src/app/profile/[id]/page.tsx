import { getUserProfile } from "@/domain/user/user.queries";
import TravelSection from "./components/Travel/TravelSection";
import { Users, Globe2, LanguagesIcon } from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/app/components/common/Stats";
import { InterestsSection } from "./components/sections/InterestsSection";
import { getFriends } from "@/lib/db/friendship.repo";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserProfile(id);

  if (!profileUser) return null; // Handled by layout, but for TS safety

  const friends = await getFriends(id);

  // Calculate stats
  const visitedCountriesCodes = profileUser.visitedCountries || [];

  const stats: StatItem[] = [
    {
      value: visitedCountriesCodes.length,
      label: visitedCountriesCodes.length > 1 ? "Countries" : "Country",
      icon: Globe2,
    },
    {
      value: friends.length,
      label: friends.length > 1 ? "Friendships" : "Friendship",
      icon: Users,
    },
    {
      value: profileUser?.profile?.languages?.length || 0,
      label: !profileUser?.profile?.languages
        ? ""
        : profileUser?.profile?.languages?.length > 1
          ? "Languages"
          : "Language",
      icon: LanguagesIcon,
    },
  ];

  const persona = profileUser?.profile?.persona as {
    interests?: string[];
  } | null;

  return (
    <main className="max-w-2xl mx-auto px-4 flex flex-col gap-12 mt-4">
      <Stats stats={stats} />
      <TravelSection />
      <InterestsSection interests={persona?.interests || []} />
    </main>
  );
}
