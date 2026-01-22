import { getCurrentUser } from "@/lib/auth/get-current-user";
import { ProfileHeader } from "@/app/profile/[id]/components/header/ProfileHeader";
import {
  getFriendRequestsAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import { FriendStatus } from "@prisma/client";

import { getUserProfile } from "@/domain/user/user.queries";
import { User } from "@/domain/user/user.schema";

import { Footer } from "./Footer";
import TravelSection from "./components/Travel/TravelSection";
import { Users, Globe2, LanguagesIcon } from "lucide-react";
import { StatItem } from "@/domain/common.schema";
import Stats from "@/app/components/common/Stats";

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

import StoreInitializer from "./components/StoreInitializer";
import { InterestsSection } from "./components/sections/InterestsSection";

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
    friendship = friendshipResult.success
      ? (friendshipResult.data as {
          status: string;
          requesterId: string;
        } | null)
      : null;
  }

  const isMyProfile = loggedUser?.id === profileUser?.id;

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
    <>
      <StoreInitializer
        profileUser={profileUser as User}
        loggedUser={loggedUser as User | null}
        isMyProfile={isMyProfile}
        friendship={friendship}
      />
      <div className="min-h-screen bg-app-bg text-app-fg pb-20">
        <ProfileHeader />
        <main className="max-w-2xl mx-auto px-4 flex flex-col gap-12 mt-4">
          <Stats stats={stats} />
          <TravelSection />
          <InterestsSection interests={persona?.interests || []} />
        </main>
        <Footer profileUser={profileUser as User} />
      </div>
    </>
  );
}
