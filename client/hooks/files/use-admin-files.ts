import { useQuery } from "@tanstack/react-query";
import { filesService, type ListAllFilesParams } from "@/services/files.service";

export const adminFilesKeys = {
  all: ["admin-files"] as const,
  list: (params: ListAllFilesParams) => [...adminFilesKeys.all, "list", params] as const,
};

export function useAdminFiles(params: ListAllFilesParams) {
  return useQuery({
    queryKey: adminFilesKeys.list(params),
    queryFn: () => filesService.listAll(params),
  });
}
