import { apiClient } from "@/lib/axios";
import type { ApiResponse, UserStats, AdminStats } from "@/lib/api-types";

export const statisticsService = {
  getUserStats: async (): Promise<UserStats> => {
    const res = await apiClient.get<ApiResponse<UserStats>>("/statistics/me");
    return res.data.data;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<ApiResponse<AdminStats>>("/statistics/admin");
    return res.data.data;
  },
};
