import { useQuery } from "@tanstack/react-query";
import { filesService } from "@/services/files.service";
import { filesKeys } from "./use-files";

export function useFile(id: string) {
  return useQuery({
    queryKey: filesKeys.detail(id),
    queryFn: () => filesService.get(id),
    enabled: !!id,
  });
}
