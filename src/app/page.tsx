import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Nav from "./component/Nav";
import Link from "next/link";
import HomeLoggedIn from "./component/HomeLoggedIn";
import { getAllCities } from "@/lib/db/city";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  // if (session.user?.emailVerified) redirect("/profile/complete");
  const cities = await getAllCities();

  if (session) return <HomeLoggedIn session={session} cities={cities} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {session && (
          <div>
            <Nav />
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Welcome, {(session.user as any).name}!
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              You have successfully signed in to the TravelMate application.
            </p>
            {/* link to complete profile */}
            <Link
              href="/profile/complete"
              className="bg-cyan-600 text-white font-bold px-4 py-2 my-2 rounded-md"
            >
              Complete your profile
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
