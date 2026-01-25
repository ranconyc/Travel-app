import { getCurrentUser } from "@/lib/auth/get-current-user";
import { ProfileHeader } from "@/app/profile/[id]/components/header/ProfileHeader";
import { getFriendshipStatusAction } from "@/domain/friendship/friendship.actions";
import { getUserById } from "@/lib/db/user.repo";
import { User } from "@/domain/user/user.schema";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";

import { Footer } from "./Footer";
import StoreInitializer from "./components/StoreInitializer";
import ProfileModal from "./components/modal/ProfileModal";
import QRCodeModal from "./components/compatibility/QRCodeModal";
import FriendRequestBanner from "./components/FriendRequestBanner";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profileUser = await getUserById(id, { strategy: "full" });

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-md">
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
        addresseeId: string;
      } | null)
    : null;

  const isMyProfile = loggedUser?.id === profileUser?.id;

  // Calculate match score on the server
  let matchResult = null;
  if (loggedUser && !isMyProfile) {
    matchResult = calculateMatchScoreBatch(loggedUser, profileUser);
  }

  return (
    <>
      <StoreInitializer
        profileUser={profileUser as User}
        loggedUser={loggedUser as User | null}
        matchResult={matchResult}
        isMyProfile={isMyProfile}
        friendship={friendship}
      />
      <ProfileModal />
      <QRCodeModal />
      <div className="min-h-screen bg-main text-app-fg pb-20">
        {loggedUser && (
          <FriendRequestBanner
            friendship={friendship}
            profileUser={profileUser as User}
            loggedUserId={loggedUser.id}
          />
        )}
        <ProfileHeader />
        {children}
        <Footer profileUser={profileUser as User} />
      </div>
    </>
  );
}
