"use client";

import { signOut } from "next-auth/react";
import Button from "../../common/Button";
import Logo from "../../common/Logo";
import { User } from "@/domain/user/user.schema";
import { Search } from "lucide-react";
import { useLocationStore } from "@/store/locationStore";

type Props = { user: User };
export default function HomeHeader({ user }: Props) {
  const { coords } = useLocationStore();
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
        <h1 className="text-2xl">
          Hello{" "}
          {user.firstName
            ? user.firstName
            : user?.name?.split(" ")[0] ?? "Traveler"}
        </h1>
        <h2 className="text-sm">
          Welcome to {user.currentCityId && coords && "Bangkok, TH"}
        </h2>
      </div>
      <div className="flex items-center p-2 bg-gray-800  rounded-xl mb-4 mt-6">
        <input
          type="text"
          className="  border-0 p-0"
          placeholder="Search destination..."
        />
        <div className="p-1 bg-black rounded-lg ">
          <Search size={32} />
        </div>
      </div>
    </header>
  );
}
