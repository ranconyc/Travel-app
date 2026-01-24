import React from "react";
import {
  getDashboardStats,
  getTopCities,
  getLatestUsers,
} from "@/domain/admin/admin.actions";
import { StatsCard } from "@/app/admin/_components/StatsCard";
import { Users, MapPin, Globe, Activity } from "lucide-react";
import { Avatar } from "@/components/molecules/Avatar";

export default async function AdminDashboardPage() {
  const [statsRes, topCitiesRes, latestUsersRes] = await Promise.all([
    getDashboardStats(undefined),
    getTopCities(undefined),
    getLatestUsers(undefined),
  ]);

  const stats = statsRes.success ? statsRes.data : null;
  const topCities = topCitiesRes.success ? topCitiesRes.data : [];
  const latestUsers = latestUsersRes.success ? latestUsersRes.data : [];

  if (!stats) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading dashboard stats. Please check your permissions.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-secondary">Welcome back, Admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
        />
        <StatsCard
          title="Active Users (7d)"
          value={stats.activeUsers}
          icon={<Activity size={24} />}
          trend={`${Math.round(
            (stats.activeUsers / stats.totalUsers) * 100,
          )}% Engagement`}
          trendUp={true}
        />
        <StatsCard
          title="Cities Covered"
          value={stats.totalCities}
          icon={<MapPin size={24} />}
        />
        <StatsCard
          title="Countries"
          value={stats.totalCountries}
          icon={<Globe size={24} />}
        />
      </div>

      {/* Forms Directory */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Forms Directory</h2>
          <p className="text-sm text-secondary mt-1">
            Quick access to all forms in the application
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md p-6">
          <a
            href="/signin"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Sign In</div>
            <div className="text-sm text-secondary mt-1">
              Authentication form
            </div>
          </a>
          <a
            href="/profile/edit"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Complete Profile</div>
            <div className="text-sm text-secondary mt-1">
              User profile completion
            </div>
          </a>
          <a
            href="/profile/persona"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Persona Setup</div>
            <div className="text-sm text-secondary mt-1">
              Travel style & interests
            </div>
          </a>
          <a
            href="/profile/travel"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Travel History</div>
            <div className="text-sm text-secondary mt-1">
              Visited countries selection
            </div>
          </a>
          <a
            href="/profile/travel-persona"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Travel Persona</div>
            <div className="text-sm text-secondary mt-1">
              Combined persona form
            </div>
          </a>
          <a
            href="/profile/travel-preferences"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Travel Preferences</div>
            <div className="text-sm text-secondary mt-1">
              Preferences & settings
            </div>
          </a>
          <a
            href="/admin/generator"
            className="p-md border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">City Generator</div>
            <div className="text-sm text-secondary mt-1">
              Admin city creation form
            </div>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Destinations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Trending Cities</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topCities.map((city) => (
              <div
                key={city.cityId}
                className="p-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600 font-bold">
                    {city.countryCode}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-secondary">{city.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{city.visitors}</div>
                  <div className="text-xs text-secondary">Visitors</div>
                </div>
              </div>
            ))}
            {topCities.length === 0 && (
              <div className="p-6 text-center text-secondary">
                No data available
              </div>
            )}
          </div>
        </div>
        {/* Latest Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Newest Members</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {latestUsers.map((user) => (
              <div key={user.id} className="p-md flex items-center gap-3">
                <Avatar image={user.avatarUrl || undefined} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-sm text-secondary truncate">
                    {user.email}
                  </div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
