"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Place } from "@/domain/place/place.schema";
import { prisma } from "@/lib/db/prisma";
import { useUser } from "@/app/providers/UserProvider";
import MoodSelector, {
  Mood,
  getMoodRelatedInterests,
} from "@/components/molecules/MoodSelector";
import PlaceCard from "@/components/molecules/PlaceCard";
import Typography from "@/components/atoms/Typography";
import {
  filterAndSortPlaces,
  EnhancedMatchResult,
  UserPersonaEnhanced,
  calculateDistance,
} from "@/services/discovery/enhanced-matching.service";

// Mock user persona for demo - in real app this would come from auth/user context
const DEMO_USER_PERSONA: UserPersonaEnhanced = {
  interests: ["rooftop_bars", "street_food_markets", "coworking_spaces"],
  budget: "moderate",
  travelStyle: ["solo", "remote"],
  mood: null,
};

// Bangkok coordinates for distance calculation
const BANGKOK_COORDS = {
  type: "Point" as const,
  coordinates: [100.5018, 13.7563] as [number, number],
};

export default function DiscoveryHome() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<
    typeof BANGKOK_COORDS | null
  >(null);
  const user = useUser();

  // Fetch places from database
  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);

        // Get Bangkok city ID
        const bangkok = await prisma.city.findUnique({
          where: { cityId: "bangkok-th" },
          select: { id: true },
        });

        if (!bangkok) {
          console.error("Bangkok not found");
          return;
        }

        // Fetch places for Bangkok
        const fetchedPlaces = await prisma.place.findMany({
          where: {
            cityRefId: bangkok.id,
            tags: { hasSome: DEMO_USER_PERSONA.interests },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });

        // Type cast to match Place schema
        setPlaces(fetchedPlaces as unknown as Place[]);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  // Get user's current location (mock for demo)
  useEffect(() => {
    // In real app, this would use browser geolocation
    setUserLocation(BANGKOK_COORDS);
  }, []);

  // Filter and sort places based on mood and search
  const filteredPlaces = useMemo(() => {
    let filtered = places;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply mood-based filtering and sorting
    const userPersonaWithMood: UserPersonaEnhanced = {
      ...DEMO_USER_PERSONA,
      mood: selectedMood,
    };

    const placesWithScores = filterAndSortPlaces(
      filtered,
      userPersonaWithMood,
      {
        maxDistance: 10, // 10km radius
        minScore: 20,
        limit: 50,
      },
    );

    return placesWithScores;
  }, [places, selectedMood, searchQuery]);

  // Calculate distance for each place
  const placesWithDistance = useMemo(() => {
    return filteredPlaces.map(({ place, matchResult }) => ({
      place,
      matchResult,
      distance:
        userLocation && place.coords
          ? calculateDistance(userLocation, place.coords)
          : undefined,
    }));
  }, [filteredPlaces, userLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Typography variant="p" className="text-gray-600 dark:text-gray-400">
            Discovering amazing places in Bangkok...
          </Typography>
        </div>
      </div>
    );
  }

  const discoveryContent = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Typography variant="h2" className="text-center mb-4">
            Discover Bangkok
          </Typography>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search places, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mood Selector */}
          <MoodSelector
            selectedMood={selectedMood}
            onMoodChange={setSelectedMood}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h3" className="mb-2">
              {selectedMood
                ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Vibes`
                : "All Places"}
            </Typography>
            <Typography
              variant="tiny"
              className="text-gray-600 dark:text-gray-400"
            >
              {placesWithDistance.length} places found
              {selectedMood && ` • Mood boost applied`}
            </Typography>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter size={16} />
            <Typography variant="tiny">Filters</Typography>
          </button>
        </div>

        {/* Places Grid */}
        {placesWithDistance.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <Typography variant="h3" className="mb-2">
              No places found
            </Typography>
            <Typography
              variant="tiny"
              className="text-gray-600 dark:text-gray-400"
            >
              Try adjusting your mood or search criteria
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesWithDistance.map(({ place, matchResult, distance }) => (
              <PlaceCard
                key={place.id}
                place={place}
                userPersona={DEMO_USER_PERSONA}
                distance={distance}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
