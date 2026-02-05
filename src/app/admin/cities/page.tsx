"use client";

import React, { useState } from "react";
import { searchCities, type CitySearchResult } from "./actions";
import { Search, Loader2 } from "lucide-react";

export default function AdminCitiesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchCities(query);

      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      // Ideally show a toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">City Database</h1>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-4xl mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for a city or coordinates (lat, lng)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Search"
            )}
          </button>
        </form>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Searching text database...
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      ID
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      City
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      State
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      Country
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      Info
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-600">
                      Coordinates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((city) => (
                    <tr
                      key={city.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        #{city.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {city.name}
                        <div className="text-xs text-gray-500 font-normal">
                          {city.timezone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {city.stateName} ({city.stateCode})
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {city.countryName} ({city.countryCode})
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs font-mono max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        TZ: {city.timezone}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm font-mono">
                        {city.latitude}, {city.longitude}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-gray-500 text-right">
                Showing {results.length} results
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12 bg-surface-secondary rounded-md">
              No cities found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-secondary rounded-md">
              Enter a city name to search the global database
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
