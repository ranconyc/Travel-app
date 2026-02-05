import { getSession } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import {
  handleGetAdminStats,
  handleGetItemsNeedingReview,
  handleGetTopSearches,
} from "@/domain/admin/admin.service";
import { Timeframe } from "@/domain/admin/admin.types";
import StatCard from "@/features/admin/StatCard";
import ReviewItemsList from "@/features/admin/ReviewItemsList";
import TopSearchesList from "@/features/admin/TopSearchesList";
import { Users, Globe, Building2 } from "lucide-react";
import Typography from "@/components/atoms/Typography";

interface AdminDashboardProps {
  searchParams: Promise<{
    timeframe?: string;
  }>;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardProps) {
  const session = await getSession();
  const user = session?.user;

  // 1. Access Control
  if (!user) {
    redirect("/signin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const { timeframe: rawTimeframe } = await searchParams;
  const timeframe = (rawTimeframe as Timeframe) || "all";

  // 2. Fetch Data
  const [stats, reviewItems, topSearches] = await Promise.all([
    handleGetAdminStats(),
    handleGetItemsNeedingReview(),
    handleGetTopSearches(5, timeframe),
  ]);

  return (
    <div className="p-md pb-20 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <Typography variant="h1">Admin Dashboard</Typography>
        <Typography variant="body" color="sec">
          Overview of platform statistics and content moderation
        </Typography>
      </header>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-info"
        />
        <StatCard
          label="Total Countries"
          value={stats.totalCountries}
          icon={Globe}
          color="text-success"
        />
        <StatCard
          label="Total Cities"
          value={stats.totalCities}
          icon={Building2}
          color="text-brand-alt"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Area (2/3 width on large screens) */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Content Review
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <ReviewItemsList
              title="Countries Needing Review"
              items={reviewItems.countries.map((c: any) => ({
                id: c.id,
                name: c.name,
                type: "country",
                entityId: c.countryId,
                subtitle: c.code,
                autoCreated: c.autoCreated,
                createdAt: c.createdAt,
              }))}
            />

            <ReviewItemsList
              title="Cities Needing Review"
              items={reviewItems.cities.map((c: any) => ({
                id: c.id,
                name: c.name,
                type: "city",
                entityId: c.cityId,
                subtitle: c.country?.name,
                autoCreated: c.autoCreated,
                createdAt: undefined, // City doesn't have createdAt yet
              }))}
            />

            <ReviewItemsList
              title="Places Needing Review"
              items={reviewItems.places.map((a: any) => ({
                id: a.id,
                name: a.name,
                type: "place",
                slug: a.slug,
                subtitle: a.city?.name,
                autoCreated: a.autoCreated,
                createdAt: a.createdAt,
              }))}
            />
          </div>
        </div>

        {/* Sidebar Area (1/3 width on large screens) */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Analytics
          </h2>
          <TopSearchesList
            searches={topSearches}
            currentTimeframe={timeframe}
          />
        </div>
      </div>
    </div>
  );
}
