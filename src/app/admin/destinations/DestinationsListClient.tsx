"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Input from "@/app/components/form/Input";

type Props = {
  countries: any[];
  cities: any[];
  places: any[];
};

export default function DestinationsListClient({
  countries,
  cities,
  places,
}: Props) {
  const [activeTab, setActiveTab] = useState<"countries" | "cities" | "places">(
    "countries",
  );
  const [search, setSearch] = useState("");

  const filteredData = (
    activeTab === "countries"
      ? countries
      : activeTab === "cities"
        ? cities
        : places
  ).filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.countryId || item.cityId || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="bg-surface rounded-full p-1 flex items-center border border-border">
          {(["countries", "cities", "places"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full capitalize text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-brand text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface-secondary text-secondary uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">ID / Code</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-hover transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-app-text">
                      <div className="flex items-center gap-3">
                        {item.imageHeroUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageHeroUrl}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary font-mono text-xs">
                      {activeTab === "countries"
                        ? item.countryId
                        : activeTab === "cities"
                          ? item.cityId
                          : item.id}
                    </td>
                    <td className="px-6 py-4">
                      {item.needsReview ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          NEEDS REVIEW
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Simplified routing: we can check type to know which sub-route, or just [id] if unified */}
                      {/* User asked for /admin/destinations/[id] */}
                      <Link
                        href={`/admin/destinations/${item.id}`}
                        className="text-brand hover:underline font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-secondary italic"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-right text-xs text-secondary mt-2">
        Showing {filteredData.length} items
      </div>
    </div>
  );
}
