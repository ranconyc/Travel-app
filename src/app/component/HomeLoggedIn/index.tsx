"use client";

import { Activity } from "@/domain/activity/activity.schema";
import { useGeo } from "@/app/hooks/useGeo";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ActivityCard from "../ActivityCard";
import { City } from "@/domain/city/city.schema";
import { User } from "@/domain/user/user.schema";
import { getDistance } from "@/app/_utils/geo";
import MateCard from "../MateCard";
import Logo from "../Logo";
import Button from "../Button";
import { signOut } from "next-auth/react";
import CityCard from "../CityCard";

const Header = ({ user }: { user: User }) => (
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
        Hello {user?.name?.split(" ")[0] ?? "Traveler"}
      </h1>
      <h2 className="text-sm">
        Welcome to {user.currentCityId ?? "Bangkok, TH"}
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

const mates = [
  {
    id: 1,
    name: "Steven Lang",
    age: 32,
    location: "Bangkok, TH",
    interests: ["Foodie", "Early riser", "Spontaneous"],
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480",
  },
  {
    id: 2,
    name: "Chinaza Akachi",
    age: 23,
    location: "Bangkok, TH",
    interests: ["Foodie", "Early riser", "Spontaneous"],
    image:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1985",
  },
  {
    id: 3,
    name: "Joan O'Keefe",
    age: 27,
    location: "Bangkok, TH",
    interests: ["Spontaneous", "Foodie", "Early riser"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
  },
  {
    id: 4,
    name: "Sonia Schultz",
    age: 29,
    location: "Bangkok, TH",
    interests: ["Adventurous", "Culture lover"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1061",
  },
];

const bangkokActivities = [
  {
    id: "yaowarat-chinatown",
    name: "Chinatown Night Market (Yaowarat)",
    image:
      "https://images.unsplash.com/photo-1672934324111-b1a3df1c6fe4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8WWFvd2FyYXQlMjBSb2FkfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: "health-land-massage",
    name: "Health Land Spa",
    image:
      "https://plus.unsplash.com/premium_photo-1661682870922-2f011fca6ad5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGhhaSUyMG1hc3NhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: "tichuca-rooftop",
    name: "Tichuca Rooftop",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRG1EXDWs4IaY7o2LGZjx6fxV3huJyhQeUrg&s",
  },
  {
    id: "chatuchak-market",
    name: "Chatuchak Weekend Market",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2039",
  },
  {
    id: "longtail-boat",
    name: "Chao Phraya Boat Ride ",
    image: "",
  },
];

export default function HomeLoggedIn({ session, cities }) {
  const userLocation = useGeo();

  const fakeLocationInBkk = { lat: 13.7563, lng: 100.5018 };

  const sortedCities = useMemo(() => {
    if (!userLocation) return cities;

    return [...cities].sort((a, b) => {
      const distA = a.coords
        ? getDistance(
            fakeLocationInBkk.lat,
            fakeLocationInBkk.lng,
            a.coords.coordinates[1],
            a.coords.coordinates[0]
          )
        : Infinity;
      const distB = b.coords
        ? getDistance(
            fakeLocationInBkk.lat,
            fakeLocationInBkk.lng,
            b.coords.coordinates[1],
            b.coords.coordinates[0]
          )
        : Infinity;

      return distA - distB;
    });
  }, [cities, userLocation]);

  const [activities, setActivities] = useState<Activity[]>([]);

  // useEffect(() => {
  // console.log("user", session.user);
  // console.log("userLocation", userLocation);
  // console.log("mates  ", mates);
  // console.log("cities  ", cities);
  // });

  // useEffect(() => {
  //   //  get the activities based on the user location
  //   console.log("userLocation", userLocation);
  //   async function getActivities() {
  //     const data = await getAllActivities();
  //     setActivities(data);
  //   }
  //   const activities = getActivities();
  //   console.log("activities", activities);
  // });

  const NearbyAttractionsList = ({
    activities,
  }: {
    activities: Activity[];
  }) => (
    <>
      <h1 className="font-bold mb-2">Nearby Attractions</h1>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {activities.map((activity) => (
          <div className="snap-start" key={activity.id}>
            <ActivityCard activity={{ ...activity, mates: mates }} />
          </div>
        ))}
      </div>
    </>
  );

  const NextDestinationList = ({ destinations }: { destinations: City[] }) => (
    <>
      <div>
        <h1>Cities</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} userLocation={userLocation} />
          ))}
        </div>
      </div>
      <h1 className="font-bold my-4">Next destination ideas</h1>
      {/* TODO: calculate the distance */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {sortedCities
          .filter((city: City) => city.cityId !== "bangkok-th")
          .map((city: City) => (
            <div className="snap-start" key={city.id}>
              <CityCard city={city} userLocation={fakeLocationInBkk} />
            </div>
          ))}
      </div>
    </>
  );

  const NearbyMateList = ({ mates }: { mates: User[] }) => (
    <>
      <h1 className="font-bold my-4">Next destination ideas</h1>
      {/* TODO: calculate the distance */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {mates.map((mate: User) => (
          <div className="snap-start" key={mate.name}>
            <MateCard mate={mate} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div>
      <Header user={session.user} />
      <main className="p-4">
        <NearbyAttractionsList activities={bangkokActivities} />
        <NextDestinationList destinations={sortedCities} />
        <NearbyMateList
          mates={[
            {
              ...session.user,
              location: "Bangkok, TH",
              isLocal: true,
              dob: "1991-09-06",
              isOnline: true,
            },
            {
              ...session.user,
              image:
                "https://images.unsplash.com/photo-1563127830-b94f0c127c52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
              name: "Alex Johnson",
              location: "Pattaya, TH",
              isLocal: false,
              dob: "1996-09-06",
              isOnline: false,
            },
          ]}
        />
      </main>
    </div>
  );
}
