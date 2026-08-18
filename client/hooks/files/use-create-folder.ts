import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersService, type CreateFolderData } from "@/services/folders.service";
import { filesKeys } from "./use-files";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderData) => foldersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesKeys.all });
    },
  });
}
