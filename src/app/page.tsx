// src/app/component/HeaderWrapper/index.tsx
"use client";

import { Sun } from "lucide-react";
import Button from "./component/common/Button";
import Logo from "./component/common/Logo";
import Input from "./component/form/Input";
import Link from "next/link";

interface HeaderWrapperProps {
  backButton?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function HeaderWrapper({
  backButton,
  leftComponent,
  rightComponent,
  className = "",
  children,
}: HeaderWrapperProps) {
  return (
    <header className={`bg-app-bg text-app-text px-4 pb-4 pt-6 ${className} `}>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          {
            backButton ? (
              <Button variant="back" />
            ) : leftComponent ? (
              leftComponent
            ) : null
            // <div className="w-12" />
          }
          <Logo />
          {rightComponent ? rightComponent : <div className="w-12" />}
        </div>
      </div>
      {children}
    </header>
  );
}

const WeatherWidget = () => {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-full px-2 py-1">
      <Sun />
      <h1>25°C</h1>
    </div>
  );
};

const AttractionCard = () => {
  return (
    <div className="bg-surface rounded-lg p-4 w-40 h-40">
      <h1>Country </h1>
    </div>
  );
};

const ListOne = () => {
  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Nearby countries</h1>
        <Link href="/countries" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
      </div>
    </div>
  );
};

const ListTwo = () => {
  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Nearby Attractions</h1>
        <Link href="/attractions" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
      </div>
    </div>
  );
};

const ListThree = () => {
  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Nearby Attractions</h1>
        <Link href="/attractions" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
      </div>
    </div>
  );
};
import { useUser } from "./providers/UserProvider";
import { Avatar } from "./component/common/Avatar";

export default function Home() {
  const user = useUser();

  return (
    <div>
      <HeaderWrapper
        rightComponent={
          user ? (
            <Link href={`/profile/${user.id}`}>
              <Avatar
                image={user.avatarUrl ?? undefined}
                name={user.name ?? ""}
                size={40}
              />
            </Link>
          ) : (
            <WeatherWidget />
          )
        }
        className="sticky top-0 left-0 right-0 z-50"
      >
        <p className="text-md text-secondary capitalize">
          {user ? `Hello, ${user.name?.split(" ")[0]}` : "Explore"}
        </p>
        <h1 className="text-4xl font-bold capitalize mb-6">
          {user?.currentCity?.name ?? "Bangkok"}
        </h1>
        <Input placeholder="Search destination" type="text" />
      </HeaderWrapper>
      <main className="p-4 overflow-y-scroll h-[calc(100vh-10rem)]">
        <div className="flex flex-col gap-2">
          <Link
            href="/interests?step=1"
            className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
          >
            Select travel Interests
          </Link>

          <Link
            href="/travel"
            className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
          >
            Update travel history
          </Link>

          {!user && (
            <Link
              href="/signin"
              className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
            >
              signin
            </Link>
          )}

          {user && (
            <Link
              href={`/profile/${user.id}`}
              className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
            >
              View Profile
            </Link>
          )}
        </div>
        <ListOne />
        <ListTwo />
        <ListThree />
      </main>
    </div>
  );
}
