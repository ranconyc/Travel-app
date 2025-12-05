// src/hooks/useCountries.ts
import { useQuery } from "@tanstack/react-query";
import { getAllCountriesAction } from "@/app/actions/locationActions";

// Mock function for user interests
async function getUserInterests(userId: string) {
  return [];
}

// React Query hook to fetch user interests
export function useUserInterests(userId: string) {
  return useQuery({
    queryKey: ["user-interests", userId],
    queryFn: () => getUserInterests(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Mock function - replace with actual API call
async function getTravelPartners(userId: string): Promise<any[]> {
  // TODO: Replace with actual database call
  // For now, return mock data
  return [
    {
      id: userId,
      firstName: "John",
      lastName: "Doe",
      profilePicture: "/api/placeholder/100/100",
      homeBaseCity: { name: "San Francisco", country: { name: "USA" } },
    },
  ];
}

// React Query hook to fetch travel partners
export function useTravelPartners(userId: string) {
  return useQuery({
    queryKey: ["travel-partners", userId],
    queryFn: () => getTravelPartners(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getAllCountriesAction(),
  });
}
