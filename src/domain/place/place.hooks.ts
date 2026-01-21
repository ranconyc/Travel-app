import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaceAction } from "@/domain/place/place.actions";
import { Place } from "@prisma/client";

export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation<Place, Error, any>({
    mutationFn: async (data) => {
      // Data type is 'any' in action currently, likely TPlaceInput or similar
      const res = await createPlaceAction(data);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: (place) => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      // Invalidate country/city if needed
      if ((place as any).cityId) {
        queryClient.invalidateQueries({
          queryKey: ["city", (place as any).cityId],
        });
      }
      if ((place as any).countryId) {
        queryClient.invalidateQueries({
          queryKey: ["country", (place as any).countryId],
        });
      }
    },
  });
}
