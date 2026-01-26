import { getSession } from "@/lib/auth/get-current-user";
import { getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import NearbyMatesClient from "./components/NearbyMatesClient";
import { getMatesPageData } from "@/domain/mates/mates.service";
import Block from "@/components/atoms/Block";
import { hasLocation } from "@/domain/user/user.types";

export default async function NearbyMatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  const loggedUser = await getUserById(session?.user?.id || "", {
    strategy: "full",
  });

  if (!loggedUser) {
    redirect("/signin");
  }

  if (!hasLocation(loggedUser)) {
    redirect("/");
  }

 
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  const { matesWithMatch, pagination } = await getMatesPageData(
    loggedUser,
    currentPage,
  );

  return (
    <Block>
      <NearbyMatesClient
        mates={matesWithMatch}
        loggedUser={loggedUser}
        pagination={pagination}
      />
    </Block>
  );
}