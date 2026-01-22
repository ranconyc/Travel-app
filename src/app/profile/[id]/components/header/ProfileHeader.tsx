"use client";
import { useProfileUser } from "../../store/useProfileStore";
import ProfileAvatar from "./ProfileAvatar";
import TopNav from "./TopNav";
import UserInfo from "./UserInfo";

export function ProfileHeader() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  return (
    <header>
      <TopNav />
      <div className="pt-4 flex flex-col gap-6 items-center">
        <ProfileAvatar />
        <UserInfo />
      </div>
    </header>
  );
}
