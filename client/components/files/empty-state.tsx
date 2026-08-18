"use client";

import { FolderOpen, Search } from "lucide-react";

interface EmptyStateProps {
  hasSearch: boolean;
}

export function EmptyState({ hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {hasSearch ? (
          <Search className="h-8 w-8 text-muted-foreground" />
        ) : (
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasSearch ? "No results found" : "No files or folders yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {hasSearch
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Upload files or create a folder to get started."}
      </p>
    </div>
  );
}
