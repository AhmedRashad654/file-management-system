"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileSortField, SortOrder, FileType } from "@/lib/api-types";
import {
  FolderPlus,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Upload,
  ArrowUpDown,
} from "lucide-react";

type ViewMode = "grid" | "list";

interface FileToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: FileSortField;
  onSortChange: (value: FileSortField) => void;
  order: SortOrder;
  onOrderChange: (value: SortOrder) => void;
  typeFilter: FileType;
  onTypeFilterChange: (value: FileType) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (value: ViewMode) => void;
  onUpload?: () => void;
  onNewFolder?: () => void;
  adminView?: boolean;
}

const SORT_LABELS: Record<FileSortField, string> = {
  name: "Name",
  createdAt: "Date",
  size: "Size",
};

const TYPE_LABELS: Record<FileType, string> = {
  "": "All Types",
  image: "Images",
  pdf: "PDFs",
  doc: "Documents",
  text: "Text",
  video: "Videos",
  audio: "Audio",
  other: "Other",
};

export function FileToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
  typeFilter,
  onTypeFilterChange,
  viewMode,
  onViewModeChange,
  onUpload,
  onNewFolder,
  adminView = false,
}: FileToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              adminView
                ? "Search by name files or email user..."
                : "Search files..."
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
              {SORT_LABELS[sort]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onSortChange(value as FileSortField)}
              >
                {label}
                {sort === value && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {order === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
            <Separator />
            <DropdownMenuItem
              onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
            >
              {order === "asc" ? "Ascending" : "Descending"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              {TYPE_LABELS[typeFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onTypeFilterChange(value as FileType)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!adminView && (
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onNewFolder}>
            <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
            New Folder
          </Button>
          <Button size="sm" onClick={onUpload}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      )}
    </div>
  );
}
