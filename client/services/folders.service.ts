import { apiClient } from "@/lib/axios";
import type { ApiResponse, FolderResult } from "@/lib/api-types";

export interface CreateFolderData {
  name: string;
  parentId?: string | null;
}

export const foldersService = {
  create: async (data: CreateFolderData) => {
    const res = await apiClient.post<ApiResponse<FolderResult>>("/folders", data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/folders/${id}`);
    return res.data;
  },
};
