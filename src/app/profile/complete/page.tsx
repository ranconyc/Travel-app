import { getAllLanguages } from "@/lib/db/languages";
import CompleteForm from "./sections/CompleteForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getUserById } from "@/lib/db/user";

export default async function CompleteProfilePage() {
  const languages = await getAllLanguages();
  const session = await getServerSession(authOptions);
  const loggedUser = await getUserById(session?.user?.id);
  console.log("sessipn", loggedUser);

  return <CompleteForm languages={languages ?? []} loggedUser={loggedUser} />;
}
