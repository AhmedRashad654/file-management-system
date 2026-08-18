"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFile } from "@/hooks/files/use-file";
import {
  Download,
  Trash2,
  Calendar,
  HardDrive,
  FileType
} from "lucide-react";
import type { FileResult } from "@/lib/api-types";
import { formatDate, formatSize, getFileColor, getFileIcon, handleDownloadFile } from "@/utils";
import { FilePreview } from "./file-preview";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileResult | null;
  onDelete: (file: FileResult) => void;
}


export function FilePreviewDialog({
  open,
  onOpenChange,
  file,
  onDelete,
}: FilePreviewDialogProps) {
  const { data: fileDetails, isLoading } = useFile(file?.id ?? "");

  if (!file) return null;

  const Icon = getFileIcon(file.mimeType);
  const iconColor = getFileColor(file.mimeType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-8">
            {/* eslint-disable-next-line */}
            <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
            <DialogTitle className="truncate">{file.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-50 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ) : (
            <>
              <FilePreview mimeType={file.mimeType} name={file.name} url={file.url} />

              {fileDetails?.extractedContent && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Extracted Text
                  </span>
                  <div className="max-h-42 overflow-y-auto rounded-md bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap">
                    {fileDetails.extractedContent}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="h-3.5 w-3.5" />
                  <span>{formatSize(file.size)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileType className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{file.mimeType}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(file.updatedAt)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleDownloadFile(file.url, file.name)}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onDelete(file);
            }}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
