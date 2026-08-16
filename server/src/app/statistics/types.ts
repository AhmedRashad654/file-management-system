export interface FileTypeDistribution {
  type: string;
  count: number;
}

export interface UploadHistoryEntry {
  date: string;
  count: number;
}

export interface RecentUpload {
  id: string;
  name: string;
  size: number;
  url: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

export interface UserStats {
  totalFiles: number;
  totalFolders: number;
  storageUsed: number;
  fileTypeDistribution: FileTypeDistribution[];
  uploadHistory: UploadHistoryEntry[];
}

export interface AdminStats {
  totalUsers: number;
  totalFiles: number;
  storageUsed: number;
  fileTypeDistribution: FileTypeDistribution[];
  recentUploads: RecentUpload[];
}
