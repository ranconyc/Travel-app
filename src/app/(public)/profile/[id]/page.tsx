import { getUserById } from "@/lib/db/user.repo";
import { getUnifiedTravelHistory } from "@/domain/user/travel-history.service";
import { auth } from "@/auth";
import TravelSection from "./components/Travel/TravelSection";
import { Users, Globe2, LanguagesIcon } from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/components/molecules/Stats";
import { getFriends } from "@/lib/db/friendship.repo";
import { InterestsSection } from "./components/sections/InterestsSection";
import { personaService } from "@/domain/persona/persona.service";
import { User } from "@/domain/user/user.schema";

import { getInterestLabel } from "@/domain/interests/interests.service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserById(id, { strategy: "full" });

  if (!profileUser) return null; // Handled by layout, but for TS safety

  const friends = await getFriends(id);
  const fullProfileUser = profileUser as User;
  const persona = personaService.fromUser(fullProfileUser);

  // Format interests on the server
  const formattedInterests = persona.interests.map(getInterestLabel);

  // Calculate stats
  const visitedCountriesCodes = fullProfileUser.visitedCountries || [];

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
      value: fullProfileUser?.profile?.languages?.length || 0,
      label: !fullProfileUser?.profile?.languages
        ? ""
        : fullProfileUser?.profile?.languages?.length > 1
          ? "Languages"
          : "Language",
      icon: LanguagesIcon,
    },
  ];

  // Fetch travel history on the server
  // We pass the already fetched user to avoid a double DB call
  const travelHistory = await getUnifiedTravelHistory(
    id,
    fullProfileUser as any,
  );

  // Check if viewing own profile
  const session = await auth();
  const isMyProfile = session?.user?.id === id;

  return (
    <div className="max-w-2xl mx-auto px-lg flex flex-col gap-xxl mt-xl">
      <Stats stats={stats} />
      <TravelSection travelHistory={travelHistory} isMyProfile={isMyProfile} />
      <InterestsSection
        interests={formattedInterests}
        isMyProfile={isMyProfile}
      />
    </div>
  );
}
