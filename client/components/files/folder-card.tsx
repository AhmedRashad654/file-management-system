"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Folder, FolderOpen, MoreVertical, Trash2 } from "lucide-react";
import type { FolderResult } from "@/lib/api-types";
import { formatDate } from "@/utils";

type ViewMode = "grid" | "list";

interface FolderCardProps {
  folder: FolderResult;
  viewMode: ViewMode;
  onOpen: (folder: FolderResult) => void;
  onDelete: (folder: FolderResult) => void;
}

export function FolderCard({
  folder,
  viewMode,
  onOpen,
  onDelete,
}: FolderCardProps) {
  const ActionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
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
            onOpen(folder);
          }}
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Open
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder);
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
        onClick={() => onOpen(folder)}
      >
        <div className="absolute top-2 right-2">{ActionMenu}</div>

        <div className="mb-2 text-primary">
          <Folder className="h-10 w-10" />
        </div>
        <span className="text-sm font-medium text-center truncate w-full px-2">
          {folder.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center gap-3 rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent cursor-pointer"
      onClick={() => onOpen(folder)}
    >
      <Folder className="h-5 w-5 shrink-0 text-primary" />
      <span className="text-sm font-medium truncate flex-1">{folder.name}</span>
      <span className="text-xs text-muted-foreground hidden sm:inline mr-2">
        {formatDate(folder.createdAt)}
      </span>
      {ActionMenu}
    </div>
  );
}
