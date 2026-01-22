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
import SplitFlapText from "@/app/components/common/SplitFlapText";

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
    <div className="min-w-fit flex items-center gap-2 bg-surface rounded-full px-2 py-1.5">
      <Sun />
      <h1>25°C</h1>
    </div>
  );
};

const Header = () => {
  const user = useUser();
  const isUserAtHome = user?.currentCity?.id === user?.profile?.homeBaseCityId;
  return (
    <div className="bg-app-bg p-4 pt-10 sticky top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <p className="text-xl text-secondary capitalize">
          {isUserAtHome
            ? "there is no place like"
            : user?.currentCity
              ? `${user?.profile?.firstName || ""} Explore`
              : "Explore the"}
        </p>
        <WeatherWidget />
      </div>
      <h1 className="text-4xl font-bold capitalize mb-6 min-h-[40px] flex items-center">
        {isUserAtHome ? (
          "Home"
        ) : (
          <SplitFlapText
            text={user?.currentCity?.name ?? "World"}
            className="text-4xl font-bold"
          />
        )}
      </h1>

      <Input placeholder="Search destination" type="text" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

const CountryList = () => {
  const { data: countries, isLoading } = useCountries<Country[]>();

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
            key={country.cca3}
            href={`/countries/${country.cca3}`}
            className="min-w-[140px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
          >
            <div className="bg-white">
              {country.imageHeroUrl ? (
                <Image
                  src={country.imageHeroUrl}
                  alt={country.name}
                  fill
                  className="object-cover group-hover:scale-105 z-10"
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

import { useCities } from "@/app/_hooks/useCities";
import React from "react";
import Image from "next/image";

const CityList = () => {
  const { data: cities, isLoading } = useCities();

  if (isLoading)
    return (
      <div className="animate-pulse h-24 bg-surface rounded-lg w-full"></div>
    );

  return (
    <div>
      <div className="my-2 flex items-center justify-between">
        <h1>Cities</h1>
        <Link href="/cities" className="text-xs text-secondary">
          see all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-scroll pb-4 no-scrollbar">
        {cities?.map((city) => (
          <Link
            key={city.id}
            href={`/cities/${city.cityId}`}
            className="min-w-[140px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
          >
            {city.imageHeroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={city.imageHeroUrl}
                alt={city.name}
                className=" w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-secondary flex flex-col items-center justify-center text-secondary p-2 text-center">
                <span className="font-bold text-lg">
                  {city.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-[10px] mt-1 line-clamp-1">
                  {city.country?.code}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <span className="text-white font-bold text-sm truncate w-full">
                {city.name}
              </span>
            </div>
          </Link>
        ))}
        {(!cities || cities.length === 0) && (
          <div className="text-sm text-secondary italic p-4">
            No cities found.
          </div>
        )}
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
    refreshOnUpdate: true,
  });

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="h-full border-b border-surface relative">
      <Header />
      <main className="p-4 overflow-y-scroll">
        {locationLoading && <p>Loading location...</p>}
        {error && <p>Error: {error}</p>}
        <div className="flex flex-col gap-2">
          <UserList loggedUser={loggedUser} />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
