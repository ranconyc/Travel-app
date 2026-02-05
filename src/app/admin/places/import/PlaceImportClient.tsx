"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, MapPin, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import {
  searchGooglePlaceAction,
  fetchGooglePlaceDetailsAction,
  resolveLocationAction,
} from "@/domain/place/google-place.actions";
import { createPlaceAction } from "@/domain/place/place.actions";
import Button from "@/components/atoms/Button";

type SearchResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  photos?: any[];
};

export default function PlaceImportClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await searchGooglePlaceAction({ query });
      if (res.success) {
        setResults(res.data);
      } else {
        toast.error(res.error || "Search failed");
      }
    } catch (err) {
      toast.error("Failed to search places");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (place: SearchResult) => {
    setImportingId(place.place_id);
    try {
      // 1. Fetch full details
      const detailsRes = await fetchGooglePlaceDetailsAction({
        placeId: place.place_id,
      });

      if (!detailsRes.success) {
        throw new Error(detailsRes.error || "Failed to fetch details");
      }

      if (!detailsRes.data) {
        throw new Error("No details returned from Google");
      }

      const details = detailsRes.data;

      // 2. Resolve City
      const { lat, lng } = details.geometry.location;
      const locationRes = await resolveLocationAction({ lat, lng });

      let cityRefId = "";
      let countryRefId = "";

      if (locationRes.success && locationRes.data) {
        cityRefId = locationRes.data.id || "";
        countryRefId = locationRes.data.country?.id || "";
        toast.success(`Linked to city: ${locationRes.data.name}`);
      } else {
        toast.error("No nearby city found in database. Cannot associate.");
        throw new Error("No nearby city found. Import cancelled.");
      }

      if (!cityRefId) {
        throw new Error("Found city has no valid ID. Import cancelled.");
      }

      // 3. Map Data
      const placeData: any = {
        name: details.name,
        slug:
          details.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          Math.random().toString(36).substring(2, 7),
        cityRefId,
        countryRefId,
        type: "PLACE",
        address: details.formatted_address,
        coords: {
          type: "Point",
          coordinates: [lng, lat],
        },
        googlePlaceId: details.place_id,
        websiteUrl: details.website || null,
        phoneNumber: details.international_phone_number || null,
        priceLevel: details.price_level || null,
        rating: details.rating || 0,
        reviewCount: details.user_ratings_total || 0,
        categories: details.types || [],
        autoCreated: false,
        lastGoogleSync: new Date(),
        needsReview: true,
      };

      // 4. Create Place
      const createRes = await createPlaceAction(placeData);

      if (!createRes.success) {
        throw new Error(createRes.error || "Failed to create place");
      }

      if (createRes.data) {
        toast.success("Place imported successfully!");
        router.push(`/admin/destinations/${createRes.data.id}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-4">Import from Google Maps</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              size={20}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name (e.g. 'Eiffel Tower') or paste Google Maps URL..."
              className="w-full pl-10 pr-4 py-3 bg-surface-secondary rounded-lg focus:ring-2 focus:ring-brand outline-none transition-all"
            />
          </div>
          <Button type="submit" disabled={loading} className="px-6">
            {loading ? <Loader2 className="animate-spin" /> : "Search"}
          </Button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {results.map((place) => (
            <div
              key={place.place_id}
              className="bg-surface rounded-xl p-4 shadow-sm border border-border flex items-center justify-between group hover:border-brand/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{place.name}</h3>
                <div className="flex items-center gap-1 text-secondary text-sm mt-1">
                  <MapPin size={14} />
                  <span>{place.formatted_address}</span>
                </div>
                {place.types && (
                  <div className="flex gap-2 mt-2">
                    {place.types.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-surface-secondary px-2 py-1 rounded text-secondary"
                      >
                        {t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleImport(place)}
                disabled={!!importingId}
                variant={importingId === place.place_id ? "outline" : "primary"}
                className={`ml-4 min-w-[120px] ${importingId === place.place_id ? "opacity-70" : ""}`}
              >
                {importingId === place.place_id ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Import</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center text-secondary py-12">
          No results found. Try a different query.
        </div>
      )}
    </div>
  );
}
