import Image from "next/image";

import Button from "@/app/component/common/Button";
import { Activity } from "@/domain/activity/activity.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getActivityById } from "@/lib/db/activity.repo";
import Link from "next/link";

const Header = ({ activity }: { activity: Activity }) => {
  return (
    <header className="bg-black p-4 text-white pt-28">
      <div className="pt-4 px-4 bg-black fixed left-0 right-0 top-0">
        <div className="flex items-center justify-between">
          <Button variant="back" />
          <div>add to wishlist</div>
        </div>

        <div className="flex flex-col items-center gap-1 mb-6">
          {/* <h2 className="text-sm">{activity?.country.name}</h2> */}
          <h1 className="text-2xl max-w-60 text-center">{activity?.name}</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl my-4">
        {activity?.images?.heroUrl ? (
          <Image
            src={activity.images.heroUrl}
            alt="activity image"
            width={500}
            height={500}
          />
        ) : (
          <div className="w-[500px] h-[500px] bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      {/* <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">Best Season</h1>
          <p>{activity.bestSeason || "NO DATA"}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">safety</h1>{" "}
          <p className="max-w-40">{activity?.safety || "NO DATA"}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">ideal duration</h1>
          <p> {activity?.idealDuration || "NO DATA"}</p>
        </div>
      </div> */}
    </header>
  );
};
``;

const TravelerCard = ({ session }: { session: any }) => {
  return (
    <Link href={`/profile/690bb3c6686edc10b979584f`}>
      <div className="rounded-full overflow-hidden w-fit">
        <Image src={session?.user?.image} alt="avatar" width={45} height={45} />
      </div>
      {/* <h1>{session?.user?.name}</h1> */}
    </Link>
  );
};

export default async function ActivityPage({ params }: any) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const activity = (await getActivityById(slug)) as unknown as Activity;
  if (!activity) return <div>Activity not found</div>;

  console.log("activity", activity);
  return (
    <div>
      <Header activity={activity} />
      <main className="p-4 bg-gray-100">
        <div className="bg-white p-4 grid gap-4 rounded-xl mb-4">
          {" "}
          Meet Travelers that planned to visit
          <div>
            <TravelerCard session={session} />
          </div>
          <Button>Join to find mates</Button>
        </div>
        <h1>{activity?.address} </h1>
        <p>{activity?.bestTimeToVisit}</p>
        <div>
          <h1>Amenities</h1>
          {activity?.amenities.map((a) => (
            <div key={a}>{a} </div>
          ))}
        </div>
      </main>
    </div>
  );
}
