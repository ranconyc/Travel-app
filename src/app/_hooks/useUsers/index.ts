import { useQuery } from "@tanstack/react-query";
import { getAllUsersAction } from "@/domain/user/user.actions";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getAllUsersAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
