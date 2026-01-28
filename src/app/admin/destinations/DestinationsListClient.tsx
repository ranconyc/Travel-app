"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
      <div className="flex flex-col md:flex-row gap-md items-center justify-between">
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
            className="w-full pl-10 pr-md py-2 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-[2fr,1fr,1fr] px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider">
          <div>Name</div>
          <div>ID / Code</div>
          <div>Status</div>
        </div>

        {/* Items */}
        {filteredData.length > 0 ? (
          (filteredData as any[]).map((item) => (
            <Link
              key={item.id}
              href={`/admin/destinations/${item.id}`}
              className="group block bg-surface border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all p-md md:px-4 md:py-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-3 md:gap-0 items-start md:items-center">
                {/* Name */}
                <div className="flex items-center gap-3">
                  {item.imageHeroUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div className="relative w-10 h-10 md:w-8 md:h-8 rounded-lg overflow-hidden flex-shrink-0 bg-surface-secondary">
                      <img
                        src={item.imageHeroUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-xs font-bold text-secondary flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-txt-main group-hover:text-brand transition-colors text-p md:text-sm">
                    {item.name}
                  </span>
                </div>

                {/* ID / Code */}
                <div className="flex md:block items-center justify-between text-xs md:text-sm font-mono text-secondary">
                  <span className="md:hidden font-bold uppercase tracking-wider text-micro text-tertiary">
                    ID / Code
                  </span>
                  <span>
                    {activeTab === "countries"
                      ? item.cca3
                      : activeTab === "cities"
                        ? item.cityId
                        : item.id}
                  </span>
                </div>

                {/* Status */}
                <div className="flex md:block items-center justify-between">
                  <span className="md:hidden font-bold uppercase tracking-wider text-micro text-tertiary">
                    Status
                  </span>
                  <div>
                    {item.needsReview ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-micro font-bold bg-warning/10 text-warning">
                        NEEDS REVIEW
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-micro font-bold bg-success/10 text-success">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-surface rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-secondary italic">
              No items found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="text-right text-xs text-secondary mt-1">
        Showing {filteredData.length} items
      </div>
    </div>
  );
}
