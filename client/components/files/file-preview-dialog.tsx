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
  FileAudio,
  Calendar,
  HardDrive,
  FileType,
  Loader2,
} from "lucide-react";
import type { FileResult } from "@/lib/api-types";
import Image from "next/image";
import { formatDate, formatSize, getFileColor, getFileIcon } from "@/utils";
import { createElement, useEffect, useState } from "react";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileResult | null;
  onDownload: (file: FileResult) => void;
  onDelete: (file: FileResult) => void;
}


function PdfViewer({ url, title }: { url: string; title: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let currentBlobUrl: string | null = null;
    let isMounted = true;

    async function fetchPdfBlob() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        currentBlobUrl = URL.createObjectURL(pdfBlob);

        if (isMounted) {
          setBlobUrl(currentBlobUrl);
        }
      } catch (err) {
        console.error("Error loading PDF preview:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPdfBlob();
    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [url]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 h-125 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading PDF...</span>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 h-125 gap-2">
        <span className="text-sm text-destructive">
          Failed to load PDF preview
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted/50 overflow-hidden h-125 w-full">
      <object
        data={blobUrl}
        type="application/pdf"
        className="w-full h-full border-0"
      >
        <p className="p-4 text-center text-sm text-muted-foreground">
          Your browser does not support PDF inline preview. {title}
        </p>
      </object>
    </div>
  );
}

function FilePreview({ file, url }: { file: FileResult; url: string }) {
  const mimeType = file.mimeType;

  if (mimeType.startsWith("image/")) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-2 min-h-50 max-h-100 overflow-hidden">
        <Image
          src={url}
          alt={file.name}
          width={200}
          height={200}
          className=" rounded-md"
        />
      </div>
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-2 min-h-50">
        <video src={url} controls className="max-h-95 max-w-full rounded-md" />
      </div>
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-8 min-h-37.5 gap-4">
        <FileAudio className="h-16 w-16 text-green-500" />
        <audio src={url} controls className="w-full max-w-sm" />
      </div>
    );
  }

  if (mimeType === "application/pdf") {
    return <PdfViewer url={url} title={file.name} />;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-6 min-h-20 gap-3">
      {createElement(getFileIcon(mimeType), {
        className: `h-12 w-16 ${getFileColor(mimeType)}`,
      })}
      <span className="text-sm text-muted-foreground">
        Preview not available for this file type
      </span>
    </div>
  );
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  file,
  onDownload,
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
              <FilePreview file={file} url={file.url} />

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
          <Button variant="outline" size="sm" onClick={() => onDownload(file)}>
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
