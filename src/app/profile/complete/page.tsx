import { getAllLanguages } from "@/lib/db/languages";
import CompleteForm from "./sections/CompleteForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getUserById } from "@/lib/db/user";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const languages = await getAllLanguages();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const loggedUser = await getUserById(session.user.id as string);

  if (!loggedUser) {
    redirect("/api/auth/signin");
  }

  console.log("languages", languages);
  console.log("sessipn", loggedUser);

  return <CompleteForm languages={languages ?? []} loggedUser={loggedUser} />;
}
