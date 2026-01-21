import { getCurrentUser } from "@/lib/auth/get-current-user";
import { ProfileHeader } from "@/app/profile/[id]/_components/ProfileHeader";
import {
  getFriendRequestsAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import { getCountriesByCodes } from "@/lib/db/country.repo";

import world from "@/data/world.json";
import StatsSection from "./_components/StatsSection";
import { getUserProfile } from "@/domain/user/user.queries";

import { InterestsSection } from "./_components/sections/InterestsSection";
import { Footer } from "./_components/sections/Footer";
import TravelSection from "./_components/sections/TravelSection";
import {
  Clock,
  Calendar,
  Users,
  Globe2,
  Globe,
  LanguagesIcon,
} from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/app/components/common/Stats";
import { TravelPartnersSection } from "./_components/TravelPartners";

const NoProfilePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="text-secondary">
          The profile you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserProfile(id);

  if (!profileUser) {
    return <NoProfilePage />;
  }

  const friendRequests = await getFriendRequestsAction(id);
  const requests = friendRequests.success ? friendRequests.data : [];
  const loggedUser = await getCurrentUser();

  let friendship = null;
  if (profileUser?.id) {
    const friendshipResult = await getFriendshipStatusAction({
      targetUserId: id,
    });
    friendship = friendshipResult.success ? friendshipResult.data : null;
  }

  const isMyProfile = loggedUser?.id === profileUser?.id;

  // Calculate stats
  const visitedCountriesCodes = profileUser.visitedCountries || [];
  const visitedCountriesData = await getCountriesByCodes(visitedCountriesCodes);
  const visitedCountryNames = visitedCountriesData.map((c) => c.name);

  const ApprovedRequestsCount = requests.filter(
    (r) => r.status === "APPROVED",
  ).length;

  const stats: StatItem[] = [
    { value: visitedCountriesCodes.length, label: "Countries", icon: Globe2 },
    { value: ApprovedRequestsCount, label: "Friendship", icon: Users },
    {
      value: profileUser?.profile?.languages?.length || 0,
      label: "Languages",
      icon: LanguagesIcon,
    },
  ];

  interface WorldCountry {
    name: { common: string };
    region: string;
  }

  function getContinentStats(visitedCountries: string[]) {
    const visitedContinents = new Set<string>();
    visitedCountries.forEach((countryName) => {
      const country = (world as unknown as WorldCountry[]).find(
        (c) => c.name.common === countryName,
      );
      if (country?.region) {
        visitedContinents.add(country.region);
      }
    });

    return {
      count: visitedContinents.size,
      continents: Array.from(visitedContinents),
    };
  }
  const continentStats = getContinentStats(visitedCountryNames);

  const persona = profileUser?.profile?.persona as {
    interests?: string[];
  } | null;

  return (
    <div className="min-h-screen bg-app-bg text-app-fg pb-20">
      <ProfileHeader
        isYourProfile={isMyProfile}
        loggedUser={loggedUser}
        friendship={friendship}
        profileUser={profileUser}
      />
      <main className="max-w-2xl mx-auto px-4 flex flex-col gap-12 mt-4">
        <Stats stats={stats} />
        <TravelSection
          userId={profileUser.id}
          visitedCountries={visitedCountriesData}
          currentCity={profileUser.currentCity}
          isOwnProfile={isMyProfile}
        />
        <InterestsSection interests={persona?.interests || []} />
      </main>
      <Footer profileUser={profileUser} />
    </div>
  );
}
