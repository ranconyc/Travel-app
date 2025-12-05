import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Nav from "./component/Nav";
import Link from "next/link";
import HomeLoggedIn from "./component/home/HomeLoggedIn";
import { getAllCities } from "@/lib/db/cityLocation.repo";
import { getAllActivities } from "@/lib/db/activity.repo";
import { getAllUsers, getUserById } from "@/lib/db/user.repo";

import { City } from "@/domain/city/city.schema";
import { Activity } from "@/domain/activity/activity.schema";
import { User } from "@/domain/user/user.schema";
import { getAllCountries } from "@/lib/db/country.repo";
import { Country } from "@/domain/country/country.schema";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const loggedUser = (await getUserById(session.user.id)) as User;
  if (!loggedUser) redirect("/signin");

  const cities = (await getAllCities()) as unknown as City[];
  const activities = (await getAllActivities()) as unknown as Activity[];
  const users = (await getAllUsers()) as unknown as User[];
  const countries = (await getAllCountries()) as unknown as Country[];

  return (
    <HomeLoggedIn
      countries={countries}
      cities={cities}
      activities={activities}
      users={users}
      loggedUser={loggedUser}
    />
  );
}
