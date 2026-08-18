import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "@/services/files.service";
import { adminFilesKeys } from "./use-admin-files";

export function useDeleteAdminFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => filesService.removeAny(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFilesKeys.all });
    },
  });
}
