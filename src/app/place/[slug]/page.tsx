import Image from "next/image";

import Button from "@/app/component/common/Button";
import { Activity } from "@/domain/activity/activity.schema";

// Extend Activity type to include cityName

interface ExtendedActivity extends Activity {
  cityName: string;
  countryName: string;
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActivityById } from "@/lib/db/activity.repo";
import Link from "next/link";
import HeaderWrapper from "@/app/component/common/Header";
import { CalendarPlus, Users } from "lucide-react";
import Title from "@/app/component/Title";

const Header = ({
  activity,
}: {
  activity: Activity & { city: { name: string; country: { name: string } } };
}) => {
  return (
    <HeaderWrapper backButton rightComponent={<CalendarPlus size={22} />}>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-sm">
          {activity?.city.name}, {activity?.city.country.name}
        </h2>
        <h1
          className={`${
            activity?.name.length > 40 ? "text-lg" : "text-2xl"
          } font-bold text-center`}
        >
          {activity?.name}
        </h1>
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

      <div className="flex gap-2 flex-wrap w-full">
        {activity?.highlights?.map((a) => (
          <div
            key={a}
            className="bg-gray-800 px-4 py-2 rounded-xl capitalize text-xs"
          >
            {a}{" "}
          </div>
        ))}
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
    </HeaderWrapper>
  );
};

const TravelerCard = ({ session }: { session: any }) => {
  return (
    <Link href={`/profile/690bb3c6686edc10b979584f`}>
      <div className="rounded-2xl overflow-hidden w-fit">
        <Image src={session?.user?.image} alt="avatar" width={80} height={80} />
      </div>
      {/* <h1>{session?.user?.name}</h1> */}
    </Link>
  );
};

export default async function ActivityPage({ params }: any) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;
  console.log("slug", slug);

  const activity = (await getActivityById(slug)) as unknown as ExtendedActivity;
  if (!activity) return <div>Activity not found</div>;

  console.log("activity", activity);

  return (
    <div>
      <Header activity={{ ...activity, city: { name: activity.cityName, country: { name: activity.countryName } } }} />
      <main className="p-4 bg-gray-100">
        <div className="bg-white p-4 grid gap-4 rounded-xl mb-4">
          <div className="flex items-start justify-between">
            <Title icon={<Users />}>Looking for partners</Title>
            <p className="text-xs">Jan 12 - 15, 2024</p>
          </div>
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
