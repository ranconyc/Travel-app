"use client";

import { useState, useMemo } from "react";
import { FavoriteType } from "@prisma/client";
import { Search, MapPin, Building2, Landmark, Heart } from "lucide-react";
import Link from "next/link";
import type { FavoriteWithDetails } from "@/lib/db/favorite.repo";
import { useFavoriteToggle } from "@/domain/favorite/favorite.hooks";

type TabType = "ALL" | FavoriteType;

const TABS: { value: TabType; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "All", icon: <Heart size={16} /> },
  { value: "COUNTRY", label: "Countries", icon: <MapPin size={16} /> },
  { value: "CITY", label: "Cities", icon: <Building2 size={16} /> },
  { value: "PLACE", label: "Places", icon: <Landmark size={16} /> },
];

interface Props {
  initialFavorites: FavoriteWithDetails[];
}

export default function FavoritesClient({ initialFavorites }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorites = useMemo(() => {
    let filtered = initialFavorites;

    // Filter by tab
    if (activeTab !== "ALL") {
      filtered = filtered.filter((f) => f.type === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.subtitle?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [initialFavorites, activeTab, searchQuery]);

  // Grouping logic for Cities (by Country) and Places (by City)
  const groupedFavorites = useMemo(() => {
    if (activeTab === "CITY") {
      const groups: Record<string, FavoriteWithDetails[]> = {};
      filteredFavorites.forEach((fav) => {
        // Use parentName for grouping, fallback to "Other"
        const groupName = fav.parentName || "Other";
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(fav);
      });
      return groups;
    }

    if (activeTab === "PLACE") {
      const groups: Record<string, FavoriteWithDetails[]> = {};
      filteredFavorites.forEach((fav) => {
        const groupName = fav.parentName || "Other";
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(fav);
      });
      return groups;
    }

    return null;
  }, [filteredFavorites, activeTab]);

  const getEntityUrl = (fav: FavoriteWithDetails) => {
    switch (fav.type) {
      case "COUNTRY":
        return `/countries/${fav.slug}`;
      case "CITY":
        return `/cities/${fav.slug}`;
      case "PLACE":
        return `/place/${fav.slug}`;
      default:
        return "#";
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <h1 className="mb-6 text-2xl font-bold text-txt-main">
          Saved Destinations
        </h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted"
          />
          <input
            type="text"
            placeholder="Search saved destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-light bg-bg-secondary py-3 pl-10 pr-4 text-txt-main placeholder:text-txt-muted focus:border-primary focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-white"
                  : "bg-bg-secondary text-txt-muted hover:bg-bg-tertiary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart size={48} className="mb-4 text-txt-muted" />
            <p className="text-lg font-medium text-txt-main">
              No saved destinations
            </p>
            <p className="mt-1 text-sm text-txt-muted">
              {searchQuery
                ? "Try a different search term"
                : "Start exploring and save destinations you love!"}
            </p>
          </div>
        ) : groupedFavorites ? (
          // Grouped View
          <div className="space-y-8">
            {Object.entries(groupedFavorites).map(([groupName, favorites]) => (
              <div key={groupName}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-txt-main">
                  {activeTab === "CITY" ? (
                    <MapPin size={20} />
                  ) : (
                    <Building2 size={20} />
                  )}
                  {groupName}
                  <span className="text-sm font-normal text-txt-muted">
                    ({favorites.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((fav) => (
                    <FavoriteCard
                      key={fav.id}
                      favorite={fav}
                      url={getEntityUrl(fav)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat Grid View (All & Countries)
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFavorites.map((fav) => (
              <FavoriteCard
                key={fav.id}
                favorite={fav}
                url={getEntityUrl(fav)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({
  favorite,
  url,
}: {
  favorite: FavoriteWithDetails;
  url: string;
}) {
  const { toggle, isPending } = useFavoriteToggle(
    favorite.type,
    favorite.entityId,
    true,
  );

  return (
    <Link
      href={url}
      className="group relative overflow-hidden rounded-2xl bg-bg-secondary transition-transform hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="aspect-4/3 w-full bg-bg-tertiary">
        {favorite.imageHeroUrl ? (
          <img
            src={favorite.imageHeroUrl}
            alt={favorite.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {favorite.type === "COUNTRY" && (
              <MapPin size={32} className="text-txt-muted" />
            )}
            {favorite.type === "CITY" && (
              <Building2 size={32} className="text-txt-muted" />
            )}
            {favorite.type === "PLACE" && (
              <Landmark size={32} className="text-txt-muted" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-txt-main">{favorite.name}</h3>
        {favorite.subtitle && (
          <p className="mt-0.5 text-sm text-txt-muted">{favorite.subtitle}</p>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        disabled={isPending}
        className="absolute right-3 top-3 rounded-full bg-bg-primary/80 p-2 text-error opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        aria-label="Remove from favorites"
      >
        <Heart size={18} className="fill-error" />
      </button>
    </Link>
  );
}
