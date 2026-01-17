import { useQuery } from "@tanstack/react-query";
import { getAllCitiesAction } from "@/domain/city/city.actions";
import { City } from "@/domain/city/city.schema";

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getAllCitiesAction();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.error);
    },
  });
}
