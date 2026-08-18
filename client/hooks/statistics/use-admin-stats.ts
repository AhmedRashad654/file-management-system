import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";

export const statisticsKeys = {
  all: ["statistics"] as const,
  adminStats: () => [...statisticsKeys.all, "admin"] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: statisticsKeys.adminStats(),
    queryFn: () => statisticsService.getAdminStats(),
  });
}
