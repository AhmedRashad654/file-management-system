import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  FileResult,
  FileWithContent,
  AdminFileResult,
  ListFilesResponse,
  PaginationMeta,
  FileType,
  FileSortField,
  SortOrder,
} from "@/lib/api-types";

export interface ListFilesParams {
  folderId?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: FileSortField;
  order?: SortOrder;
  type?: FileType;
}

export interface ListAllFilesParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: FileSortField;
  order?: SortOrder;
  type?: FileType;
}

export interface ListFilesApiResult {
  data: ListFilesResponse;
  meta: PaginationMeta;
}

export interface ListAllFilesApiResult {
  data: AdminFileResult[];
  meta: PaginationMeta;
}

export const filesService = {
  list: async (params: ListFilesParams): Promise<ListFilesApiResult> => {
    const res = await apiClient.get<ApiResponse<ListFilesResponse>>("/files", {
      params,
    });
    return { data: res.data.data, meta: res.data.meta! };
  },

  get: async (id: string): Promise<FileWithContent> => {
    const res = await apiClient.get<ApiResponse<FileWithContent>>(`/files/${id}`);
    return res.data.data;
  },

  upload: async (files: File[], parentId?: string): Promise<FileResult[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (parentId) formData.append("parentId", parentId);

    const res = await apiClient.post<ApiResponse<FileResult[]>>("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/files/${id}`);
    return res.data;
  },

  listAll: async (params: ListAllFilesParams): Promise<ListAllFilesApiResult> => {
    const res = await apiClient.get<ApiResponse<AdminFileResult[]>>("/files/admin", {
      params,
    });
    return { data: res.data.data, meta: res.data.meta! };
  },

  removeAny: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/files/admin/${id}`);
    return res.data;
  },
};
