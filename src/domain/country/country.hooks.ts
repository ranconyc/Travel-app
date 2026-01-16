import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateCountryAction } from "./country.actions";

export function useGenerateCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await generateCountryAction(name);
      if (!res.success) {
        throw new Error(res.error || "Unknown error");
      }
      return res;
    },
    onSuccess: (data) => {
      if (data.created) {
        console.log(`Generated ${data.name}`);
      } else {
        console.log(`${data.name} already exists`);
      }
      // Invalidate country lists so UI updates
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      // Also maybe specific country query if needed
      if (data.countryId) {
        queryClient.invalidateQueries({
          queryKey: ["country", data.countryId],
        });
      }
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
}
