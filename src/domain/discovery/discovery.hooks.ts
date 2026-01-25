"use client";

import { useState, useMemo, useCallback } from "react";
import { User } from "@/domain/user/user.schema";
import { discoveryService, MateFilters } from "./discovery.service";

/**
 * useDiscovery - Encapsulates filtering logic and state for the Mates discovery view.
 * Strictly separates domain state from the UI presentation layer.
 */
export function useDiscovery(initialMates: User[]) {
  const [filters, setFilters] = useState<MateFilters>(
    discoveryService.getDefaultFilters(),
  );

  const filteredMates = useMemo(() => {
    return discoveryService.filterMates(initialMates, filters);
  }, [initialMates, filters]);

  const updateFilters = useCallback((update: Partial<MateFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(discoveryService.getDefaultFilters());
  }, []);

  return {
    filters,
    filteredMates,
    updateFilters,
    resetFilters,
  };
}
