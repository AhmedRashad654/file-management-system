import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { toApiError } from "./api-helper";
import type { ApiResponse } from "./api-types";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const meta = query.meta as { silent?: boolean } | undefined;
      if (meta?.silent) return;
      const apiError = toApiError(error);
      toast.error(apiError.message);
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta as {
        disableSuccessToast?: boolean;
        successMessage?: string;
      } | undefined;

      if (meta?.disableSuccessToast) return;

      if (meta?.successMessage) {
        toast.success(meta.successMessage);
        return;
      }

      const data = _data as ApiResponse<unknown> | undefined;
      if (data?.message) {
        toast.success(data.message);
        return;
      }

      toast.success("Operation completed successfully!");
    },

    onError: (error, _variables, _context, mutation) => {
      const meta = mutation.meta as { silent?: boolean } | undefined;
      if (meta?.silent) return;
      const apiError = toApiError(error);
      toast.error(apiError.message);
    },
  }),

  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});
