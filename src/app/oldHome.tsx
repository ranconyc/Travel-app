import { getCurrentUser } from "@/lib/auth/get-current-user";
import HomeLoggedIn from "./component/home/HomeLoggedIn";
import { getAllCities } from "@/lib/db/cityLocation.repo";
import { getAllActivities } from "@/lib/db/activity.repo";
import { getAllUsers } from "@/lib/db/user.repo";

import { City } from "@/domain/city/city.schema";
import { Activity } from "@/domain/activity/activity.schema";

import { User } from "@/domain/user/user.schema";
import { getAllCountries } from "@/lib/db/country.repo";
import { Country } from "@/domain/country/country.schema";
import { getAllTrips } from "@/lib/db/trip.repo";
import { Trip } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const loggedUser = (await getCurrentUser()) as User | null;
  if (!loggedUser) {
    redirect("/signin");
  }
  const cities = (await getAllCities()) as City[];
  const activities = (await getAllActivities()) as Activity[];
  const users = (await getAllUsers()) as User[];
  const countries = (await getAllCountries()) as Country[];
  const trips = (await getAllTrips()) as Trip[];

  // DO I WANT TO SHOW HOME FOR NOT LOGGED IN USER?

  return (
    <HomeLoggedIn
      countries={countries}
      cities={cities}
      activities={activities}
      users={users}
      loggedUser={loggedUser}
      trips={trips}
    />
  );
}
