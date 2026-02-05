import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { ActionResponse } from "@/types/actions";

export type MutationHookOptions<TData, TVariables> = {
  invalidateKeys?: QueryKey[];
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error) => void;
};

/**
 * Factory to create standardized mutation hooks for Server Actions
 */
export function createMutationHook<TData, TVariables>(
  actionFn: (variables: TVariables) => Promise<ActionResponse<TData>>,
  options: MutationHookOptions<TData, TVariables> = {},
) {
  return function useMutationHook() {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
      mutationFn: async (variables) => {
        const res = await actionFn(variables);
        if (!res.success) {
          throw new Error(res.error);
        }
        return res.data as TData;
      },
      onSuccess: async (data, variables) => {
        if (options.invalidateKeys) {
          await Promise.all(
            options.invalidateKeys.map((key) =>
              queryClient.invalidateQueries({ queryKey: key }),
            ),
          );
        }
        if (options.onSuccess) {
          await options.onSuccess(data, variables);
        }
      },
      onError: options.onError,
    });
  };
}
