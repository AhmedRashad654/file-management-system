import { apiClient } from "@/lib/axios";
import type { ApiResponse, SafeUser, PaginationMeta, Role } from "@/lib/api-types";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

export interface ListUsersResult {
  data: SafeUser[];
  meta: PaginationMeta;
}

export const usersService = {
  list: async (params: ListUsersParams): Promise<ListUsersResult> => {
    const res = await apiClient.get<ApiResponse<SafeUser[]>>("/users", { params });
    return { data: res.data.data, meta: res.data.meta! };
  },

  updateRole: async (id: string, role: Role): Promise<SafeUser> => {
    const res = await apiClient.patch<ApiResponse<SafeUser>>(`/users/${id}/role`, { role });
    return res.data.data;
  },

  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return res.data;
  },
};
