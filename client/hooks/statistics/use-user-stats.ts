import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";

export const statisticsKeys = {
  all: ["statistics"] as const,
  userStats: () => [...statisticsKeys.all, "user"] as const,
};

export function useUserStats() {
  return useQuery({
    queryKey: statisticsKeys.userStats(),
    queryFn: () => statisticsService.getUserStats(),
  });
}
