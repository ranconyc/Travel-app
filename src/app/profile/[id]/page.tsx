import { getFriendRequestsAction } from "@/domain/friendship/friendship.actions";
import { FriendStatus } from "@prisma/client";
import { getUserProfile } from "@/domain/user/user.queries";
import TravelSection from "./components/Travel/TravelSection";
import { Users, Globe2, LanguagesIcon } from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/app/components/common/Stats";
import { InterestsSection } from "./components/sections/InterestsSection";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserProfile(id);

  if (!profileUser) return null; // Handled by layout, but for TS safety

  const friendRequests = await getFriendRequestsAction(id);
  const requests = friendRequests.success ? friendRequests.data : [];

  // Calculate stats
  const visitedCountriesCodes = profileUser.visitedCountries || [];

  const ApprovedRequestsCount = requests.filter(
    (r) => r.status === FriendStatus.ACCEPTED,
  ).length;

  const stats: StatItem[] = [
    {
      value: visitedCountriesCodes.length,
      label: "Countries",
      icon: Globe2,
    },
    {
      value: ApprovedRequestsCount,
      label: "Friendship",
      icon: Users,
    },
    {
      value: profileUser?.profile?.languages?.length || 0,
      label: "Languages",
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
