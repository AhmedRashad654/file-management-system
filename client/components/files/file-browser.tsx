"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { useFiles } from "@/hooks/files/use-files";
import { FileToolbar } from "./file-toolbar";
import { EmptyState } from "./empty-state";
import { FileCard } from "./file-card";
import { FolderCard } from "./folder-card";
import { FilePreviewDialog } from "./file-preview-dialog";
import { CreateFolderDialog } from "./create-folder-dialog";
import { UploadDropzone } from "./upload-dropzone";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { FileResult, FolderResult } from "@/lib/api-types";
import { FileBrowserSkeleton } from "./file-browser-skeleton";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SortField = "name" | "createdAt" | "size";
type SortOrder = "asc" | "desc";
type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "text"
  | "video"
  | "audio"
  | "other"
  | "";
type ViewMode = "grid" | "list";

const PAGE_LIMIT = 10;

export function FileBrowser({ folderId }: { folderId?: string }) {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [sort, setSort] = React.useState<SortField>("createdAt");
  const [order, setOrder] = React.useState<SortOrder>("desc");
  const [typeFilter, setTypeFilter] = React.useState<FileType>("");
  const [page, setPage] = React.useState(1);

  // Dialog states
  const [previewFile, setPreviewFile] = React.useState<FileResult | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<{
    item: FileResult | FolderResult;
    type: "file" | "folder";
  } | null>(null);

  const { data, isLoading } = useFiles({
    folderId,
    search: debouncedSearch || undefined,
    sort,
    order,
    type: typeFilter || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setPage(1);
    }, 0);
  }, [debouncedSearch, sort, order, typeFilter, folderId]);

  const folders = data?.data?.folders ?? [];
  const files = data?.data?.files ?? [];
  const isEmpty = folders.length === 0 && files.length === 0;
  const hasSearch = debouncedSearch.length > 0 || typeFilter.length > 0;

  const handleNavigate = (folderId: string | null) => {
    if (folderId === null) {
      router.push("/files");
    } else {
      router.push(`/files/${folderId}`);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        {folderId && (
          <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        )}
        <h1 className="text-2xl font-bold">Files</h1>
      </div>

      <FileToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        order={order}
        onOrderChange={setOrder}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUpload={() => setUploadOpen(true)}
        onNewFolder={() => setCreateFolderOpen(true)}
      />

      {isLoading ? (
        <FileBrowserSkeleton />
      ) : isEmpty ? (
        <EmptyState hasSearch={hasSearch} />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              : "flex flex-col gap-1"
          }
        >
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              viewMode={viewMode}
              onOpen={(f) => handleNavigate(f.id)}
              onDelete={(f) => setDeleteItem({ item: f, type: "folder" })}
            />
          ))}
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              viewMode={viewMode}
              onPreview={setPreviewFile}
              onDelete={(f) => setDeleteItem({ item: f, type: "file" })}
            />
          ))}
        </div>
      )}

      {!isLoading && !isEmpty && data?.meta && data.meta.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                const total = data.meta.totalPages;
                if (total <= 5) return true;
                if (p === 1 || p === total) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={page === item}
                      onClick={() => setPage(item)}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((p) => Math.min(data.meta.totalPages, p + 1))
                }
                aria-disabled={page === data.meta.totalPages}
                className={
                  page === data.meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialogs */}
      <FilePreviewDialog
        open={!!previewFile}
        onOpenChange={(open) => {
          if (!open) setPreviewFile(null);
        }}
        file={previewFile}
        onDelete={(f) => {
          setPreviewFile(null);
          setDeleteItem({ item: f, type: "file" });
        }}
      />

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        parentId={folderId}
      />

      <UploadDropzone
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        parentId={folderId}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        item={deleteItem?.item ?? null}
        itemType={deleteItem?.type ?? "file"}
      />
    </div>
  );
}
