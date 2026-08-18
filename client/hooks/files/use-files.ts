import { useQuery } from "@tanstack/react-query";
import { filesService, type ListFilesParams } from "@/services/files.service";

export const filesKeys = {
  all: ["files"] as const,
  list: (params: ListFilesParams) => [...filesKeys.all, "list", params] as const,
  detail: (id: string) => [...filesKeys.all, "detail", id] as const,
};

export function useFiles(params: ListFilesParams) {
  return useQuery({
    queryKey: filesKeys.list(params),
    queryFn: () => filesService.list(params),
  });
}
