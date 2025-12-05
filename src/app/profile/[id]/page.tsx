import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { User } from "@prisma/client";
import Image from "next/image";
import { getAge } from "@/app/_utils/age";
import {
  MapPinHouse,
  Languages,
  Users,
  BriefcaseBusiness,
  MessageCircleHeart,
  Heart,
  PlaneTakeoff,
} from "lucide-react";
import { getUserById } from "@/lib/db/user.repo";
import Button from "@/app/component/common/Button";
import { Avatar } from "@/app/component/common/Avatar";
import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import languages from "../../../data/languages.json";
import Link from "next/link";
import { sendFriendRequest } from "@/lib/db/friendship.repo";
import { log } from "console";
import FriendReqButton from "./_componentes/FreindReqButton";

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const loggedUser = (await getUserById(session?.user?.id as string)) as User;
  const { id } = await params;

  // Validate id parameter
  if (!id || id === "undefined" || id === "null") {
    return <div>Invalid user ID</div>;
  }

  const profileUser = (await getUserById(id)) as ProfileUser;
  console.log("id", profileUser);

  if (!profileUser) {
    // you might want a proper 404 here
    return <div>User not found</div>;
  }

  const isYourProfile = loggedUser?.id === profileUser?.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection
        profileUser={profileUser}
        isYourProfile={isYourProfile}
        loggedUser={loggedUser}
      />
      <div className="p-4 space-y-4">
        <InfoSection user={profileUser} />
        <LanguagesSection user={profileUser} />
        <TravelPartnersSection user={profileUser} />
        <InterestsSection />
        <VisitedDestinationsSection />
        <NextDestinationsSection />
      </div>
    </div>
  );
}

type ProfilePageProps = {
  params: {
    id: string;
  };
};

type LanguageItem = {
  code: string;
  name: string;
  flag?: string;
};

type ProfileUser = User & {
  // adjust if `languages` is stored differently
  languages: string[];
};

const UserLink = ({ user }: { user: ProfileUser }) => {
  const fullName = user.firstName + " " + user.lastName;
  return (
    <a
      href={`/profile/${user.id}`}
      className="bg-gray-200 flex items-center gap-2 p-4 rounded-md"
    >
      {user.image && <Avatar size={36} image={user.image} />}
      {fullName}
    </a>
  );
};

const MatchSection = ({ profileUser }: { profileUser: ProfileUser }) => {
  const firstName = profileUser.firstName ?? "Traveler";
  return (
    <div className="p-4 rounded-md bg-gray-900">
      <h1 className="text-white">You and {firstName} both...</h1>
    </div>
  );
};

const HeaderSection = ({
  profileUser,
  loggedUser,
  isYourProfile,
}: {
  profileUser: ProfileUser;
  isYourProfile: boolean;
  loggedUser: User;
}) => (
  <header className="bg-black p-4 text-white">
    <div className="flex items-center justify-between mb-4">
      <Button variant="back" />
      {isYourProfile ? (
        <Link href={`/profile/complete`}>edit</Link>
      ) : (
        <FriendReqButton profileUser={profileUser} loggedUser={loggedUser} />
      )}
    </div>

    <div className="flex flex-col items-center gap-1 mb-6">
      <h1 className="text-2xl capitalize">
        {profileUser.firstName + " " + profileUser.lastName}
      </h1>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-green-400 rounded-full" />
        {/* TODO: replace with real location from user */}
        <h2 className="text-sm">San Francisco, CA</h2>
      </div>
    </div>

    {isYourProfile ? (
      <div className="bg-gray-800 p-4 rounded-xl my-4">
        <h1 className="text-lg mb-1">Your profile is 60% complete</h1>
        <button className="underline text-sm">
          Tell us more about yourself
        </button>
      </div>
    ) : (
      <MatchSection profileUser={profileUser} />
    )}

    <div className="rounded-xl overflow-hidden mt-4">
      {profileUser.image && (
        <Image
          src={profileUser.image}
          alt="user image"
          width={500}
          height={500}
        />
      )}
    </div>
  </header>
);

function formatHomeBase(user) {
  const city = user.homeBaseCity;
  const country = city?.country;

  if (!city) return "No location set";

  const normalized =
    country?.name === "United States of America" ? "USA" : country?.name;

  return normalized ? `${city.name}, ${normalized}` : city.name;
}

const InfoSection = ({ user }: { user: ProfileUser }) => {
  return (
    <Block>
      <Title>
        {user.firstName + " " + user.lastName},{" "}
        {getAge(user.birthday) || "No Data"}
      </Title>
      <div className="flex items-center gap-2 w-fit mb-2">
        <MapPinHouse size={18} />
        <h2 className="text-sm">{formatHomeBase(user)}</h2>
      </div>

      <p className="max-w-[50ch]">
        {user.description ||
          "Market hopper, temple lover, island-weekend enthusiast."}
      </p>
    </Block>
  );
};

const LanguagesSection = ({
  user,
  isLoading,
}: {
  user: ProfileUser;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Block>
        <Title icon={<Languages size={16} />}>Languages</Title>
        <p className="text-sm text-gray-500">Loading...</p>
      </Block>
    );
  }

  const langs =
    languages?.filter((lang) => user.languages?.includes(lang.code)) || [];

  console.log("langs", langs);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Block>
        <Title icon={<Languages size={16} />}>Languages</Title>
        {langs.length === 0 && (
          <p className="text-sm text-gray-500">No languages yet</p>
        )}
        {langs.map((lang) => (
          <div key={lang.code} className="flex items-center gap-2">
            <div>{lang.flag}</div>
            <div>{lang.name}</div>
          </div>
        ))}
      </Block>
      <Block>
        <Title icon={<BriefcaseBusiness size={16} />}>Work</Title>
        <p>{user.occupation || "no data"}</p>
      </Block>
    </div>
  );
};

const TravelPartnersSection = ({ user }: { user: ProfileUser }) => (
  <Block>
    <Title icon={<Users size={16} />}>Travel Partners</Title>
    {/* later you can pass a real list of mates instead of the same user */}
    <UserLink user={user} />
  </Block>
);

const InterestsSection = () => (
  <Block>
    <Title icon={<MessageCircleHeart size={16} />}>Interests</Title>
    <div className="flex gap-2 flex-wrap">
      {["Travel", "Food", "Music"].map((interest) => (
        <div
          key={interest}
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
        >
          {interest}
        </div>
      ))}
    </div>
  </Block>
);

const VisitedDestinationsSection = () => (
  <div className="grid grid-cols-2 gap-4">
    <Block>
      <Title>visited</Title>
      <h1 className="text-2xl">10</h1>
      <h2 className="uppercase text-xs font-bold">cities</h2>
      <h1 className="text-2xl">3</h1>
      <h2 className="uppercase text-xs font-bold">counties</h2>
    </Block>
    <Block>
      <Title icon={<Heart size={16} />}>Favorite</Title>
      <p>New York, USA</p>
      <p>San Francisco, USA</p>
      <p>Bangkok, Thailand</p>
    </Block>
  </div>
);

const NextDestinationsSection = () => (
  <Block>
    <Title icon={<PlaneTakeoff size={16} />}>Next destinations</Title>
    <div>
      <h1 className="font-bold">New York, USA</h1>
      <p>Dec 17–21, 2025</p>
    </div>
  </Block>
);
