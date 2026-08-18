import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "@/services/files.service";
import { filesKeys } from "./use-files";

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => filesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesKeys.all });
    },
  });
}
