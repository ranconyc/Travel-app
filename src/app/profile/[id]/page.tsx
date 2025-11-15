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
import { getUserById } from "@/lib/db/user";
import Button from "@/app/component/common/Button";
import languagesData from "../../../data/languages.json";
import { Avatar } from "@/app/component/common/Avatar";
import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";

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
  return (
    <a
      href={`/profile/${user.id}`}
      className="bg-gray-200 flex items-center gap-2 p-4 rounded-md"
    >
      {user.image && <Avatar size={36} image={user.image} />}
      {user.name}
    </a>
  );
};

const MatchSection = ({ user }: { user: ProfileUser }) => {
  const firstName = user.name?.split(" ")[0] ?? "You";
  return (
    <div className="p-4 rounded-md bg-gray-900">
      <h1 className="text-white">You and {firstName} both...</h1>
    </div>
  );
};

const HeaderSection = ({
  user,
  isYou,
}: {
  user: ProfileUser;
  isYou: boolean;
}) => (
  <header className="bg-black p-4 text-white">
    <div className="flex items-center justify-between mb-4">
      <Button variant="back">back</Button>
      {isYou ? <div>edit</div> : <div>follow</div>}
    </div>

    <div className="flex flex-col items-center gap-1 mb-6">
      <h1 className="text-2xl">{user.name}</h1>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-green-400 rounded-full" />
        {/* TODO: replace with real location from user */}
        <h2 className="text-sm">San Francisco, CA</h2>
      </div>
    </div>

    {isYou ? (
      <div className="bg-gray-800 p-4 rounded-xl my-4">
        <h1 className="text-lg mb-1">Your profile is 80% complete</h1>
        <button className="underline text-sm">
          Tell us more about yourself
        </button>
      </div>
    ) : (
      <MatchSection user={user} />
    )}

    <div className="rounded-xl overflow-hidden mt-4">
      {user.image && (
        <Image src={user.image} alt="user image" width={500} height={500} />
      )}
    </div>
  </header>
);

const InfoSection = ({ user }: { user: ProfileUser }) => {
  return (
    <Block>
      <Title>
        {user.name}, {getAge(user.birthday) || "No Data"}
      </Title>
      <div className="flex items-center gap-2 w-fit mb-2">
        <MapPinHouse size={18} />
        <h2 className="text-sm">{user.homeBase || "No Data"}</h2>
      </div>

      <p className="max-w-[50ch]">
        {user.description ||
          "Market hopper, temple lover, island-weekend enthusiast."}
      </p>
    </Block>
  );
};

const LanguagesSection = ({ user }: { user: ProfileUser }) => {
  const langs = (languagesData as LanguageItem[]).filter((lang) =>
    user.languages?.includes(lang.code)
  );

  return (
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

const WorkSection = ({ user }: { user: ProfileUser }) => (
  <Block>
    <Title icon={<BriefcaseBusiness size={16} />}>Work</Title>
    <p>{user.occupation || "no data"}</p>
  </Block>
);

const FavoriteDestinationsSection = () => (
  <Block>
    <Title icon={<Heart size={16} />}>Favorite destinations</Title>
    <p>New York, USA</p>
    <p>San Francisco, USA</p>
    <p>Bangkok, Thailand</p>
  </Block>
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

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const user = (await getUserById(id)) as ProfileUser;

  if (!user) {
    // you might want a proper 404 here
    return <div>User not found</div>;
  }

  const isYou = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection user={user} isYou={isYou} />

      <main className="bg-gray-100 p-4 flex gap-4 flex-wrap items-stretch">
        <InfoSection user={user} />
        <LanguagesSection user={user} />
        <TravelPartnersSection user={user} />
        <InterestsSection />
        <WorkSection user={user} />
        <FavoriteDestinationsSection />
        <NextDestinationsSection />
      </main>
    </div>
  );
}
