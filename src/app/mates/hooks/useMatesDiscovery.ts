import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/domain/shared/utils/useDebounce";

export type MatesDiscoveryFilters = {
  minAge: number;
  maxAge: number;
  maxDistance: number;
};

export function useMatesDiscovery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [maxDistance, setMaxDistance] = useState(100);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize from URL
  useState(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("minAge")) setMinAge(Number(params.get("minAge")));
    if (params.get("maxAge")) setMaxAge(Number(params.get("maxAge")));
    if (params.get("maxDistance"))
      setMaxDistance(Number(params.get("maxDistance")));
  });

  // Debouncing
  const debouncedMinAge = useDebounce(minAge, 500);
  const debouncedMaxAge = useDebounce(maxAge, 500);
  const debouncedMaxDistance = useDebounce(maxDistance, 500);

  // URL Sync Effect
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Set params
    params.set("minAge", String(debouncedMinAge));
    params.set("maxAge", String(debouncedMaxAge));
    params.set("maxDistance", String(debouncedMaxDistance));

    // Check against current URL to avoid redundant pushes
    const currentMinAge = Number(searchParams.get("minAge")) || 18;
    const currentMaxAge = Number(searchParams.get("maxAge")) || 60;
    const currentMaxDist = Number(searchParams.get("maxDistance")) || 100;

    if (
      debouncedMinAge !== currentMinAge ||
      debouncedMaxAge !== currentMaxAge ||
      debouncedMaxDistance !== currentMaxDist
    ) {
      router.replace(`/mates?${params.toString()}`);
    }
  }, [
    debouncedMinAge,
    debouncedMaxAge,
    debouncedMaxDistance,
    router,
    searchParams,
  ]);

  // Handlers
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/mates?${params.toString()}`);
  };

  const loadMore = async (nextPage: number) => {
    setIsLoadingMore(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/mates?${params.toString()}`);
    // Loading state reset happens naturally via navigation/re-render or can be explicit if needed,
    // but usually with router.push it's async.
    // For simplicity keeping it just 'true' until unmount or prop change usually works in Next.js Soft Navs.
  };

  const clearAllFilters = () => {
    setMinAge(18);
    setMaxAge(60);
    setMaxDistance(100);
  };

  const clearAgeFilter = () => {
    setMinAge(18);
    setMaxAge(60);
  };

  const clearDistanceFilter = () => {
    setMaxDistance(100);
  };

  return {
    filters: { minAge, maxAge, maxDistance },
    setters: { setMinAge, setMaxAge, setMaxDistance },
    loading: { isLoadingMore, setIsLoadingMore },
    actions: {
      handlePageChange,
      loadMore,
      clearAllFilters,
      clearAgeFilter,
      clearDistanceFilter,
    },
  };
}
