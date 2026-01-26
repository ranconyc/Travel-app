import { getUserById } from "@/lib/db/user.repo";
import TravelSection from "./components/Travel/TravelSection";
import { Users, Globe2, LanguagesIcon } from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/components/molecules/Stats";
import { getFriends } from "@/lib/db/friendship.repo";
import { InterestsSection } from "./components/sections/InterestsSection";
import { personaService } from "@/domain/persona/persona.service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserById(id, { strategy: "full" });

  if (!profileUser) return null; // Handled by layout, but for TS safety

  const friends = await getFriends(id);
  const persona = personaService.fromUser(profileUser);

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

  return (
    <Block className="max-w-2xl mx-auto px-lg flex flex-col gap-xxl mt-xl">
      <Stats stats={stats} />
      <TravelSection />
      <InterestsSection interests={persona.interests} />
    </Block>
  );
}
