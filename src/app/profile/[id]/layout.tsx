import { getCurrentUser } from "@/lib/auth/get-current-user";
import { ProfileHeader } from "@/app/profile/[id]/components/header/ProfileHeader";
import { getFriendshipStatusAction } from "@/domain/friendship/friendship.actions";
import { getUserProfile } from "@/domain/user/user.queries";
import { User } from "@/domain/user/user.schema";

import { Footer } from "./Footer";
import StoreInitializer from "./components/StoreInitializer";
import { ProfileModals } from "./components/ProfileModals";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserProfile(id);

  if (!profileUser) {
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
  }

  const loggedUser = await getCurrentUser();

  const friendshipResult = await getFriendshipStatusAction({
    targetUserId: id,
  });
  const friendship = friendshipResult.success
    ? (friendshipResult.data as {
        status: string;
        requesterId: string;
      } | null)
    : null;

  const isMyProfile = loggedUser?.id === profileUser?.id;

  return (
    <>
      <StoreInitializer
        profileUser={profileUser as User}
        loggedUser={loggedUser as User | null}
        isMyProfile={isMyProfile}
        friendship={friendship}
      />
      <ProfileModals />
      <div className="min-h-screen bg-app-bg text-app-fg pb-20">
        <ProfileHeader />
        {children}
        <Footer profileUser={profileUser as User} />
      </div>
    </>
  );
}
