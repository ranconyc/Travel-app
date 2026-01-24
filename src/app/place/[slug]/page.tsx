import Image from "next/image";

import Button from "@/components/atoms/Button";
import { Place } from "@/domain/place/place.schema";

interface ExtendedPlace extends Place {
  city: { name: string; country: { name: string } };
}
import { getSession } from "@/lib/auth/get-current-user";
import { getPlaceBySlug } from "@/lib/db/place.repo";
import Link from "next/link";
import { CalendarPlus, Users } from "lucide-react";
import Title from "@/components/atoms/Title";
import PageHeader from "@/components/molecules/PageHeader";
import Typography from "@/components/atoms/Typography";

const Header = ({ activity }: { activity: ExtendedPlace }) => {
  return (
    <PageHeader
      backButton
      rightContent={<CalendarPlus size={22} />}
      subtitle={`${activity?.city.name}, ${activity?.city.country.name}`}
      title={activity?.name}
      bottomContent={
        <div className="flex flex-col gap-md">
          <div className="overflow-hidden rounded-card">
            {activity?.imageHeroUrl ? (
              <Image
                src={activity.imageHeroUrl}
                alt="activity image"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          <div className="flex gap-sm flex-wrap w-full">
            {activity?.highlights?.map((a) => (
              <div
                key={a}
                className="bg-surface-secondary px-md py-sm rounded-pill capitalize text-xs font-medium text-txt-sec"
              >
                {a}{" "}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
};

const TravelerCard = ({ session }: { session: any }) => {
  return (
    <Link href={`/profile/690bb3c6686edc10b979584f`}>
      <div className="rounded-2xl overflow-hidden w-fit">
        <Image
          src={session?.user?.avatarUrl || session?.user?.image}
          alt="avatar"
          width={80}
          height={80}
        />
      </div>
      {/* <h1>{session?.user?.name}</h1> */}
    </Link>
  );
};

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();

  const { slug } = await params;
  console.log("slug", slug);

  const activity = (await getPlaceBySlug(slug)) as unknown as ExtendedPlace;
  if (!activity) return <div>Place not found</div>;

  console.log("activity", activity);

  return (
    <div>
      <Header activity={activity} />
      <main className="p-lg bg-bg-main min-h-screen">
        <div className="bg-surface p-md grid gap-md rounded-card border border-stroke shadow-soft mb-lg">
          <div className="flex items-start justify-between">
            <Title icon={<Users />}>Looking for partners</Title>
            <Typography variant="tiny" className="text-txt-muted">
              Jan 12 - 15, 2024
            </Typography>
          </div>
          <div>
            <TravelerCard session={session} />
          </div>
          <Button variant="brand" fullWidth>
            Join to find mates
          </Button>
        </div>
        <Typography variant="h3" className="mb-sm">
          {activity?.address}
        </Typography>
        <Typography variant="p" className="mb-lg">
          {activity?.bestTimeToVisit}
        </Typography>
        <div>
          <Typography variant="h3" className="mb-md">
            Amenities
          </Typography>
          {activity?.amenities.map((a) => (
            <div key={a} className="mb-xs text-txt-sec">
              {a}{" "}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
