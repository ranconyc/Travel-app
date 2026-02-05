import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOptimistic, useTransition } from "react";
import { FavoriteType } from "@prisma/client";
import {
  toggleFavoriteAction,
  isFavoriteAction,
  getFavoritesAction,
} from "./favorite.actions";

export const favoriteKeys = {
  isFavorited: (type: FavoriteType, entityId: string) =>
    ["favorites", type, entityId] as const,
  list: (type?: FavoriteType) => ["favorites", "list", type] as const,
};

// Query for initial/synced state
export function useIsFavorited(
  type: FavoriteType,
  entityId: string,
  initial = false,
) {
  return useQuery({
    queryKey: favoriteKeys.isFavorited(type, entityId),
    queryFn: async () => {
      const r = await isFavoriteAction({ type, entityId });
      return r.success ? (r.data?.isFavorited ?? false) : false;
    },
    initialData: initial,
    staleTime: 1000 * 60,
  });
}

// Combined hook: useOptimistic + React Query mutation
export function useFavoriteToggle(
  type: FavoriteType,
  entityId: string,
  initial = false,
) {
  const queryClient = useQueryClient();
  const { data: serverState } = useIsFavorited(type, entityId, initial);
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    serverState,
    (_: boolean, newState: boolean) => newState,
  );

  const toggle = () => {
    startTransition(async () => {
      const newState = !optimistic;
      setOptimistic(newState); // Instant UI

      const r = await toggleFavoriteAction({ type, entityId });
      if (r.success) {
        queryClient.setQueryData(
          favoriteKeys.isFavorited(type, entityId),
          r.data.isFavorited,
        );
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      } else {
        // Revert on failure (though Query will eventually sync)
        setOptimistic(!newState);
      }
    });
  };

  return { isFavorited: optimistic, toggle, isPending };
}

// Hook to get all favorites
export function useFavorites(type?: FavoriteType) {
  return useQuery({
    queryKey: favoriteKeys.list(type),
    queryFn: async () => {
      const result = await getFavoritesAction({ type });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
