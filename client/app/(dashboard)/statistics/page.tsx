"use client";

import * as React from "react";
import { FileText, Folder, HardDrive } from "lucide-react";
import { useUserStats } from "@/hooks/statistics/use-user-stats";
import { StatCard } from "@/components/statistics/stat-card";
import { UploadHistoryChart } from "@/components/statistics/upload-history-chart";
import { FileTypeChart } from "@/components/statistics/file-type-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSize } from "@/utils";

export default function StatisticsPage() {
  const { data: stats, isLoading } = useUserStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-26 rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            icon={FileText}
          />
          <StatCard
            title="Total Folders"
            value={stats.totalFolders}
            icon={Folder}
          />
          <StatCard
            title="Storage Used"
            value={formatSize(stats.storageUsed)}
            icon={HardDrive}
          />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-87.5 rounded-xl" />
            <Skeleton className="h-87.5 rounded-xl" />
          </>
        ) : stats ? (
          <>
            {stats.uploadHistory.length > 0 ? (
              <UploadHistoryChart data={stats.uploadHistory} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upload History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No upload data available.</p>
                </CardContent>
              </Card>
            )}
            {stats.fileTypeDistribution.length > 0 ? (
              <FileTypeChart data={stats.fileTypeDistribution} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>File Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No file data available.</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
