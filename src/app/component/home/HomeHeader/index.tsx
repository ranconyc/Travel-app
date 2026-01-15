"use client";

import { signOut } from "next-auth/react";
import Button from "../../common/Button";
import Logo from "../../common/Logo";
import { User } from "@/domain/user/user.schema";
import SearchAutocomplete from "../SearchAutocomplete";

type Props = { user: User };
export default function HomeHeader({ user }: Props) {
  return (
    <header className="bg-black p-4 text-white">
      <div className="flex items-center justify-between">
        <Logo />
        <Button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="bg-transparent hover:bg-gray-800"
        >
          Logout
        </Button>
      </div>
      <div className="mt-8">
        {/* check if user is at home */}
        {user.currentCityId === user.profile?.homeBaseCityId ? (
          <>
            <h1 className="text-xl mb-2">There is no place like</h1>
            <h2 className="text-4xl font-bold">Home</h2>
          </>
        ) : (
          <>
            <h1 className="text-xl mb-2">
              Hello{" "}
              {user.profile?.firstName
                ? user.profile.firstName
                : user?.name?.split(" ")[0] ?? "Traveler"}
              , Welcome to
            </h1>
            <h2 className="text-4xl font-bold">
              {user.currentCity
                ? `${user.currentCity.name}, ${
                    user.currentCity.country?.name ===
                    "United States of America"
                      ? "USA"
                      : user.currentCity.country?.name || ""
                  }`
                : "Nowhere"}
            </h2>
          </>
        )}
      </div>
      <SearchAutocomplete userId={user.id} className="mt-6" />
    </header>
  );
}
