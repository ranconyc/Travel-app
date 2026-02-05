import { getSession } from "@/lib/auth/get-current-user";
import { getPlaceBySlug } from "@/lib/db/place.repo";
import PlaceDetailView from "@/features/place/components/PlaceDetailView";
import Typography from "@/components/atoms/Typography";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = (await getPlaceBySlug(slug)) as any;

  if (!activity) {
    return {
      title: "Place Not Found",
    };
  }

  return {
    title: `${activity.name} - ${activity.city?.name || "Travel App"}`,
    description: `Visit ${activity.name} in ${
      activity.city?.name || "Unknown City"
    }. Rating: ${activity.rating || "N/A"} stars. ${activity.summary || ""}`,
    openGraph: {
      title: `${activity.name} - ${activity.city?.name || "Travel App"}`,
      description: `Visit ${activity.name} in ${
        activity.city?.name || "Unknown City"
      }.`,
      images: [activity.imageHeroUrl].filter(Boolean),
    },
  };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const activity = (await getPlaceBySlug(slug)) as any;
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h1">Place Not Found</Typography>
          <Typography variant="p" className="text-gray-600">
            The place with slug &quot;{slug}&quot; could not be found.
          </Typography>
          <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Get session for user-specific features
  const session = await getSession();
  const user = session?.user as any;

  // Check for Google Sync freshness (30 days)
  if (activity && activity.googlePlaceId) {
    const lastSync = activity.lastGoogleSync
      ? new Date(activity.lastGoogleSync).getTime()
      : 0;
    const daysSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60 * 24);

    if (daysSinceSync > 30) {
      // Refresh in background
      const { refreshPlaceData } =
        await import("@/domain/place/google-place.actions");
      // Fire and forget - using void to avoid lint expectations
      void refreshPlaceData(activity.id, activity.googlePlaceId);
    }
  }

  return <PlaceDetailView activity={activity} user={user} />;
}
