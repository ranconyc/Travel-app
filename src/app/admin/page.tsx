import React from "react";
import {
  getDashboardStats,
  getTopCities,
  getLatestUsers,
} from "@/domain/admin/admin.actions";
import { StatsCard } from "./_components/StatsCard";
import { Users, MapPin, Globe, Activity } from "lucide-react";
import { Avatar } from "@/app/component/common/Avatar";

export default async function AdminDashboardPage() {
  const [stats, topCities, latestUsers] = await Promise.all([
    getDashboardStats(),
    getTopCities(),
    getLatestUsers(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin.</p>
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
            (stats.activeUsers / stats.totalUsers) * 100
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
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600 font-bold">
                    {city.countryCode}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{city.visitors}</div>
                  <div className="text-xs text-gray-500">Visitors</div>
                </div>
              </div>
            ))}
            {topCities.length === 0 && (
              <div className="p-6 text-center text-gray-500">
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
              <div key={user.id} className="p-4 flex items-center gap-3">
                <Avatar image={user.avatarUrl || undefined} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
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
