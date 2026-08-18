import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersService } from "@/services/folders.service";
import { filesKeys } from "./use-files";

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foldersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesKeys.all });
    },
  });
}
