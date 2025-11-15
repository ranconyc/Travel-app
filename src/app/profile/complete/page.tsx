// src/app/(profile)/complete/page.tsx
import { getAllLanguages } from "@/lib/db/languages";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getUserById } from "@/lib/db/user";
import { redirect } from "next/navigation";
import { Session } from "inspector/promises";
import { User } from "@/domain/user/user.schema";
import { CompleteProfileForm } from "./sections/CompleteProfileForm";

export default async function CompleteProfilePage() {
  // 1) get session
  const session =
    ((await getServerSession(authOptions)) as Session & { user: User }) || null;

  if (!session?.user?.id) {
    // user not logged in → redirect to signin
    redirect("/api/auth/signin");
  }

  // 2) load user + languages from DB
  const [loggedUser, languages] = await Promise.all([
    getUserById(session?.user?.id as string),
    getAllLanguages(),
  ]);

  if (!loggedUser) {
    // optional: could redirect or show error
    redirect("/");
  }

  // 3) render client form with data
  return <CompleteProfileForm loggedUser={loggedUser} />;
}
