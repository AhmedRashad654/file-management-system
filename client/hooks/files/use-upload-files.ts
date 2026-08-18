import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "@/services/files.service";
import { filesKeys } from "./use-files";

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      files,
      parentId,
      onUploadProgress,
    }: {
      files: File[];
      parentId?: string;
      onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void;
    }) => filesService.upload(files, parentId, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesKeys.all });
    },
  });
}
