"use client";

import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadFiles } from "@/hooks/files/use-upload-files";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatSize, getFileIcon } from "@/utils";

interface UploadDropzoneProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 20;

export function UploadDropzone({
  open,
  onOpenChange,
  parentId,
}: UploadDropzoneProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const uploadMutation = useUploadFiles();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    disabled: uploadMutation.isPending,
    onDrop: (acceptedFiles) => {
      setSelectedFiles((prev) => {
        const combined = [...prev, ...acceptedFiles];
        if (combined.length > MAX_FILES) {
          toast.error(
            `You can only upload up to ${MAX_FILES} files at a time.`,
          );
          return combined.slice(0, MAX_FILES);
        }
        return combined;
      });
    },
    onDropRejected: (fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        const isTooLarge = rejection.errors.some(
          (e) => e.code === "file-too-large",
        );
        if (isTooLarge) {
          toast.error(
            `file "${rejection.file.name}" too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB  `,
          );
        } else if (rejection.errors.some((e) => e.code === "too-many-files")) {
          toast.error(
            `You can only upload up to ${MAX_FILES} files at a time.`,
          );
        } else {
          toast.error(`  file "${rejection.file.name} is rejection"`);
        }
      });
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    setUploadProgress(0);

    uploadMutation.mutate(
      {
        files: selectedFiles,
        parentId,
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      },
      {
        onSuccess: () => {
          setSelectedFiles([]);
          setUploadProgress(0);
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && uploadMutation.isPending) {
      return;
    }
    if (!isOpen) {
      setSelectedFiles([]);
      setUploadProgress(0);
      uploadMutation.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
          )}
        >
          <input {...getInputProps()} />
          <Upload
            className={cn(
              "h-8 w-8 mb-3",
              isDragActive ? "text-primary" : "text-muted-foreground",
            )}
          />
          {isDragActive ? (
            <p className="text-sm font-medium text-primary">
              Drop files here...
            </p>
          ) : (
            <>
              <p className="text-sm font-medium mb-1">
                Drag & drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Any file type supported
              </p>
            </>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2 max-h-50 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 rounded-md border bg-card px-3 py-2"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFile(index)}
                    disabled={uploadMutation.isPending}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {uploadProgress < 100
                  ? "Uploading files..."
                  : "Processing & saving..."}
              </span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  uploadProgress === 100
                    ? "bg-primary animate-pulse"
                    : "bg-primary"
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
