// src/app/components/HeaderWrapper/index.tsx
"use client";

import { Sun } from "lucide-react";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/form/Input";
import Link from "next/link";
import { useUser } from "@/app/providers/UserProvider";
import { Avatar } from "@/app/components/common/Avatar";
import { useUsers } from "@/app/_hooks/useUsers";
import { signOut } from "next-auth/react";
import { useCountries } from "@/app/_hooks/useCountries";
import { User } from "@/domain/user/user.schema";
import { useGeo } from "@/app/_hooks/useGeo";
import { redirect } from "next/navigation";
import Logo from "@/app/components/common/Logo";
import { Country } from "@/domain/country/country.schema";

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
    <div className="flex items-center gap-2 bg-surface rounded-full px-2 py-1.5">
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

const Header = () => {
  const user = useUser();
  const isUserAtHome = user?.currentCity?.id === user?.profile?.homeBaseCityId;
  return (
    <div className="p-4 pt-10 sticky top-0 left-0 right-0 z-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-md text-secondary capitalize">
            {isUserAtHome
              ? "there is no place like"
              : user?.currentCity
                ? `${user?.name?.split(" ")[0]} Explore`
                : "Explore the"}
          </p>
          <h1 className="text-4xl font-bold capitalize mb-6">
            {isUserAtHome ? "Home" : (user?.currentCity?.name ?? "World")}
          </h1>
        </div>
        <WeatherWidget />
      </div>
      <Input placeholder="Search destination" type="text" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

const CountryList = () => {
  const { data: countries, isLoading } = useCountries();

  if (isLoading)
    return (
      <div className="animate-pulse h-24 bg-surface rounded-lg w-full"></div>
    );

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Countries</h1>
        <Link href="/countries" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll pb-4 no-scrollbar">
        {countries?.map((country) => (
          <Link
            key={country.id}
            href={`/countries/${country.countryId}`}
            className="min-w-[140px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
          >
            {country.imageHeroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={country.imageHeroUrl}
                alt={country.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-secondary font-bold">
                {country.code}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <span className="text-white font-bold text-sm truncate w-full">
                {country.name}
              </span>
            </div>
          </Link>
        ))}
        {(!countries || countries.length === 0) && (
          <div className="text-sm text-secondary italic p-4">
            No countries found.
          </div>
        )}
      </div>
    </div>
  );
};

const UserList = ({ loggedUser }: { loggedUser: User }) => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Travelers</h1>
        <Link href="/mates" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll pb-2">
        {users &&
          users
            ?.filter((user: User) => loggedUser.id !== user.id)
            .map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="min-w-[80px]"
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar
                    image={user?.avatarUrl || ""}
                    name={user?.name || ""}
                    size={60}
                  />
                  <p className="text-xs text-center truncate w-full">
                    {user?.name?.split(" ")[0]}
                  </p>
                </div>
              </Link>
            ))}
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

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const loggedUser = useUser();
  const {
    coords,
    error,
    loading: locationLoading,
  } = useGeo({
    persistToDb: true,
    distanceThresholdKm: 1, // Save to DB if user moves more than 1km
    initialUser: loggedUser,
  });

  if (!loggedUser) return redirect("/signin");

  return (
    <div>
      <Header />
      <main className="p-4 overflow-y-scroll h-[calc(100vh-10rem)]">
        {locationLoading && <p>Loading location...</p>}
        {error && <p>Error: {error}</p>}

        <div className="flex flex-col gap-2">
          {loggedUser?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            href="/persona?step=1"
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

          {loggedUser ? (
            <Button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="bg-transparent hover:bg-gray-800"
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/signin"
              className="text-secondary border-2 border-surface px-2 py-1 rounded-lg hover:bg-brand hover:text-white transition-colors"
            >
              signin
            </Link>
          )}
        </div>
        <UserList loggedUser={loggedUser} />
        <CountryList />
        <ListThree />
      </main>
    </div>
  );
}
