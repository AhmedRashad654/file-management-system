export interface FolderResult {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileResult {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListFilesResult {
  folders: FolderResult[];
  files: FileResult[];
  pagination: PaginationMeta;
}

export interface AdminFileResult extends FileResult {
  userId: string;
  user: { name: string; email: string };
  folder: { name: string } | null;
}

export interface ListAllFilesResult {
  files: AdminFileResult[];
  pagination: PaginationMeta;
}
