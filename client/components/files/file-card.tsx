"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Eye, MoreVertical, Trash2 } from "lucide-react";
import type { FileResult } from "@/lib/api-types";
import { formatDate, formatSize, getFileColor, getFileIcon, handleDownloadFile } from "@/utils";

type ViewMode = "grid" | "list";

interface FileCardProps {
  file: FileResult;
  viewMode: ViewMode;
  onPreview: (file: FileResult) => void;
  onDelete: (file: FileResult) => void;
}

export function FileCard({
  file,
  viewMode,
  onPreview,
  onDelete,
}: FileCardProps) {
  const Icon = getFileIcon(file.mimeType);
  const iconColor = getFileColor(file.mimeType);

  const ActionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onPreview(file);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadFile(file.url, file.name);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (viewMode === "grid") {
    return (
      <div
        className="group relative flex flex-col items-center rounded-lg border bg-card p-4 transition-colors hover:bg-accent cursor-pointer"
        onClick={() => onPreview(file)}
      >
        <div className="absolute top-2 right-2">{ActionMenu}</div>

        <div className="mb-2">
          {/* eslint-disable-next-line */}
          <Icon className={cn("h-10 w-10", iconColor)} />
        </div>
        <span className="text-sm font-medium text-center truncate w-full px-2">
          {file.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatSize(file.size)}
        </span>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center gap-3 rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent cursor-pointer"
      onClick={() => onPreview(file)}
    >
      {/* eslint-disable-next-line */}
      <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
      <span className="text-sm font-medium truncate flex-1">{file.name}</span>
      <span className="text-xs text-muted-foreground hidden sm:inline">
        {formatDate(file.createdAt)}
      </span>
      <span className="text-xs text-muted-foreground w-16 text-right mr-1">
        {formatSize(file.size)}
      </span>

      {ActionMenu}
    </div>
  );
}
