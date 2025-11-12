import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import { User } from "@prisma/client";
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
import Button from "@/app/component/Button";

const Avatar = ({ image, size = 32 }: { image: string; size?: number }) => (
  <div
    className="rounded-full overflow-hidden bg-gray-200"
    style={{ width: size, height: size }}
  >
    <Image src={image} alt="avatar" width={size} height={size} />
  </div>
);

const UserLink = ({ user }: any) => {
  return (
    <a
      href={`/profile/${user.id}`}
      className="bg-gray-200 flex items-center gap-2 p-4 rounded-md"
    >
      {user.image && <Avatar image={user.image} />}
      {user.name}
    </a>
  );
};

const MatchSection = (user: User) => {
  return (
    <div className="p-4 rounded-md bg-gray-900">
      <h1>You and {user.name?.split(" ")[0]} both...</h1>
    </div>
  );
};

const Block = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-md flex flex-col gap-2  min-h-32">
    {children}
  </div>
);

const Title = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const title = (
    <h1 className="text-base font-bold w-fit capitalize">{children}</h1>
  );
  return icon ? (
    <div className="flex items-center gap-2">
      {icon}
      {title}
    </div>
  ) : (
    title
  );
};

const Header = ({ user, isYou }: { user: User; isYou: boolean }) => (
  <header className="bg-black p-4 text-white">
    <div className="flex items-center justify-between">
      <Button variant="back">back</Button>
      {isYou ? <div>edit</div> : <div>follow</div>}
    </div>

    <div className="flex flex-col items-center gap-1 mb-6">
      <h1 className="text-2xl">{user.name}</h1>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-green-400 rounded-full" />
        <h2 className="text-sm">San Francisco, CA</h2>
      </div>
    </div>

    {/* match section */}

    {isYou ? (
      <div className="bg-gray-800 p-4 rounded-xl my-4">
        <h1>your profile is 80% complete</h1>
        <button>tell us more about yourself</button>
      </div>
    ) : (
      <MatchSection user={user} />
    )}
    <div className="rounded-xl overflow-hidden">
      <Image src={user.image} alt="user image" width={500} height={500} />
    </div>
  </header>
);

export default async function ProfilePage({ params }: any) {
  const session = await getServerSession(authOptions);
  console.log("session  ", session);
  const { id } = await params;

  const user = await getUserById(id);

  const isYou = session?.user?.id === user.id;

  return (
    <div>
      <Header user={user} isYou={isYou} />
      <main className=" bg-gray-100 p-4 flex gap-4 flex-wrap items-stretch ">
        <Block>
          <Title>
            {user.name}, {getAge(user.birthday) || "34"}
          </Title>
          <div className="flex items-center gap-2 w-fit ">
            <MapPinHouse size={18} />
            <h2 className="text-sm">{user.hometown || "New York, NY"}</h2>
          </div>

          <p className="max-w-1/2">
            {user.description ||
              "Market hopper, temple lover, island-weekend enthusiast."}
          </p>
        </Block>
        <Block>
          <Title icon={<Languages size={16} />}>Languages</Title>
          {[
            { name: "English", flag: "🇬🇧" },
            { name: "Hebrew", flag: "🇮🇱" },
          ].map((lang: any) => (
            <div key={lang.name} className="flex items-center gap-2">
              <div>{lang.flag}</div>
              <div>{lang.name}</div>
            </div>
          ))}
        </Block>
        <Block>
          <Title icon={<Users size={16} />}>Travel Partners</Title>
          <UserLink user={user} />
        </Block>
        <Block>
          <Title icon={<MessageCircleHeart size={16} />}>Interests</Title>
          <div className="flex gap-2">
            {["Travel", "Food", "Music"].map((interest: string) => (
              <div
                key={interest}
                className="border border-gray-300 p-2 rounded-lg"
              >
                {interest}
              </div>
            ))}
          </div>{" "}
        </Block>
        <Block>
          <Title icon={<BriefcaseBusiness size={16} />}>Work</Title>
          <p>{user.occupation || "Software Engineer"}</p>
        </Block>
        <Block>
          <Title icon={<Heart size={16} />}>favorite destinations</Title>
          <p>New York, USA</p>
          <p> San Francisco, USA</p>
          <p> Bangkok, Thailand</p>
        </Block>
        <Block>
          <Title icon={<PlaneTakeoff size={16} />}>next destinations</Title>
          <div>
            <h1 className="font-bold">New York, USA</h1>
            <p>Des 17-12, 2025</p>
          </div>
        </Block>
      </main>
    </div>
  );
}
