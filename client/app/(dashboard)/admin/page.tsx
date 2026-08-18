"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Files, Users, HardDrive, Upload } from "lucide-react";
import { formatSize, getFileIcon, formatDate } from "@/utils";
import { useAdminStats } from "@/hooks/statistics/use-admin-stats";
import { FileTypeChart } from "@/components/statistics/file-type-chart";
import { RecentUpload } from "@/lib/api-types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilePreview } from "@/components/files/file-preview";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();
  const [previewFile, setPreviewFile] = useState<RecentUpload | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Files
            </CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFiles ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSize(stats?.storageUsed ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              File Types
            </CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.fileTypeDistribution?.length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats?.fileTypeDistribution &&
      stats?.fileTypeDistribution?.length > 0 ? (
        <FileTypeChart data={stats.fileTypeDistribution} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>File Types</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No file data available.
            </p>
          </CardContent>
        </Card>
      )}

      {stats?.recentUploads && stats.recentUploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads ( last 5 Files)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUploads.map((upload) => {
                const Icon = getFileIcon(upload.mimeType);
                return (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between rounded-md border px-4 py-2 flex-wrap gap-y-1 cursor-pointer"
                    onClick={() => setPreviewFile(upload)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{upload.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>{upload.user.email}</span> /
                      <span>{formatSize(upload.size)}</span> /
                      <span>{formatDate(upload.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={previewFile !== null}
        onOpenChange={() => setPreviewFile(null)}
      >
        <DialogContent className="sm:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 pr-8">
              <DialogTitle className="truncate">
                {previewFile?.name}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {previewFile ? (
              <FilePreview
                mimeType={previewFile?.mimeType}
                name={previewFile?.name}
                url={previewFile?.url}
              />
            ) : (
              ""
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
