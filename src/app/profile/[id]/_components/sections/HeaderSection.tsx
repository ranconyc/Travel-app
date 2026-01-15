import Link from "next/link";
import Image from "next/image";
import Button from "@/app/component/common/Button";
import { MatchSection } from "../MatchSection";
import { User } from "@/domain/user/user.schema";
import { ProfileUser } from "@/types/user";
import { MessageCircle } from "lucide-react";
import { UserRoundPen } from "lucide-react";

import StatusIndector from "../StatusIndector";

type HeaderSectionProps = {
  profileUser: ProfileUser;
  loggedUser: User;
  isYourProfile: boolean;
};

export const HeaderSection = ({
  profileUser,
  loggedUser,
  isYourProfile,
}: HeaderSectionProps) => {
  return (
    <header className="bg-black p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <Button variant="back" />
        {isYourProfile ? (
          <Link href={`/profile/complete`}>
            <UserRoundPen size={24} />
          </Link>
        ) : (
          <MessageCircle />
        )}
      </div>

      <div className="flex flex-col items-center gap-1 mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {(profileUser.profile?.firstName || "") +
            " " +
            (profileUser.profile?.lastName || "")}
        </h1>
        <div className="flex items-center gap-2">
          <StatusIndector userId={profileUser.id} />
          <h2 className="text-base">
            {profileUser?.currentCity?.name
              ? profileUser.currentCity.name +
                (profileUser.currentCity.country
                  ? ", " + profileUser.currentCity.country.name
                  : "")
              : "Unknown location"}
          </h2>
        </div>
      </div>

      {isYourProfile ? (
        <div className="bg-gray-800 p-4 rounded-xl my-4">
          <h1 className="text-lg mb-1">Your profile is 60% complete</h1>
          <Button className="underline text-sm">
            Tell us more about yourself
          </Button>
        </div>
      ) : (
        <MatchSection profileUser={profileUser} loggedUser={loggedUser} />
      )}

      <div className="rounded-xl overflow-hidden mt-4">
        {(() => {
          const mainImage =
            profileUser.images?.find((img: any) => img.isMain)?.url ||
            profileUser.image;
          return mainImage ? (
            <Image
              src={mainImage}
              alt="user image"
              width={500}
              height={500}
              priority
            />
          ) : null;
        })()}
      </div>
    </header>
  );
};
