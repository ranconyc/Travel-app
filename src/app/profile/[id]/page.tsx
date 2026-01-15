import { getUserById } from "@/lib/db/user.repo";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Button from "../../component/common/Button";
import { Linkedin, ShieldUser, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { User } from "../../../domain/user/user.schema";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const loggedUser = (await getUserById(
    session?.user?.id as string
  )) as unknown as User;
  const profileUser = (await getUserById(id)) as unknown as User;

  if (!profileUser) {
    // you might want a proper 404 here
    return <div>User not found</div>;
  }

  const isYourProfile = loggedUser?.id === profileUser?.id;

  const linkedinUsername = "rancodesign";
  return (
    <div>
      <div className="p-4 flex items-center justify-between gap-2">
        <Button variant="back" />
        <div className="flex items-center justify-between gap-2">
          <div className="p-2 bg-surface rounded-full  cursor-pointer">
            <Link href={`www.linkedin.com/in/${linkedinUsername}`}>
              <Linkedin />
            </Link>
          </div>
          <div className="p-2 bg-surface rounded-full  cursor-pointer">
            <ShieldUser />
          </div>
          <div className="p-2 bg-surface rounded-full  cursor-pointer">
            <UserRoundPlus />
          </div>
        </div>
      </div>
      <main className="p-4">
        <div className="py-4 flex flex-col gap-6 items-center">
          <div className="w-32 h-32 relative">
            <Image
              src={
                profileUser.media?.find((img: any) => img.category === "AVATAR")
                  ?.url ||
                profileUser.avatarUrl ||
                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              }
              alt={profileUser.name || "User"}
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="px-2 py-1 bg-surface border border-brand font-bold  text-brand rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2">
              Visitor
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {profileUser.profile?.firstName
                ? `${profileUser.profile.firstName} ${
                    profileUser.profile.lastName || ""
                  }`.trim()
                : profileUser.name}
            </h1>
            <p className="text-xs">
              {profileUser.currentCity?.name},
              {profileUser.currentCity?.country?.name ===
              "United States of America"
                ? "USA"
                : profileUser.currentCity?.country?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold">2</h1>
            <h2 className="text-xs font-bold text-secondary uppercase">
              meetups
            </h2>
          </div>
          <div>
            <h1 className="text-lg font-bold">30</h1>
            <h2 className="text-xs font-bold text-secondary uppercase">
              cities
            </h2>
          </div>
          <div>
            <h1 className="text-lg font-bold">12</h1>
            <h2 className="text-xs font-bold text-secondary uppercase">
              countries
            </h2>
          </div>
        </div>
        <p className="text-xs">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}
