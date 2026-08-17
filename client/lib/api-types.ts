export type Role = "USER" | "ADMIN";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

export interface FolderResult {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileResult {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileWithContent extends FileResult {
  extractedContent: string | null;
}

export interface AdminFileResult extends FileResult {
  userId: string;
  user: { name: string; email: string };
  folder: { name: string } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}

export interface ListFilesResponse {
  folders: FolderResult[];
  files: FileResult[];
}

export interface FileTypeDistribution {
  type: string;
  count: number;
}

export interface UploadHistoryEntry {
  date: string;
  count: number;
}

export interface UserStats {
  totalFiles: number;
  totalFolders: number;
  storageUsed: number;
  fileTypeDistribution: FileTypeDistribution[];
  uploadHistory: UploadHistoryEntry[];
}

export interface RecentUpload {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  createdAt: string;
  user: { name: string; email: string };
}

export interface AdminStats {
  totalUsers: number;
  totalFiles: number;
  storageUsed: number;
  fileTypeDistribution: FileTypeDistribution[];
  recentUploads: RecentUpload[];
}

export type FileType = "image" | "pdf" | "doc" | "text" | "video" | "audio" | "other";

export type FileSortField = "name" | "createdAt" | "size";
export type SortOrder = "asc" | "desc";
