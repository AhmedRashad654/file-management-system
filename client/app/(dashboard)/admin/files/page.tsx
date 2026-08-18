"use client";

import * as React from "react";
import { useAdminFiles } from "@/hooks/files/use-admin-files";
import { FileToolbar } from "@/components/files/file-toolbar";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FilePreview } from "@/components/files/file-preview";
import { User, Trash2, Download } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  formatSize,
  formatDate,
  handleDownloadFile,
  getFileIcon,
} from "@/utils";
import type {
  AdminFileResult,
  FileSortField,
  FileType,
  SortOrder,
} from "@/lib/api-types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_LIMIT = 10;

export default function AdminFilesPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sort, setSort] = React.useState<FileSortField>("createdAt");
  const [order, setOrder] = React.useState<SortOrder>("desc");
  const [typeFilter, setTypeFilter] = React.useState<FileType>("");
  const [page, setPage] = React.useState(1);

  const [previewFile, setPreviewFile] = React.useState<AdminFileResult | null>(
    null,
  );
  const [deleteItem, setDeleteItem] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading } = useAdminFiles({
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
  }, [debouncedSearch, sort, order, typeFilter]);

  const files = data?.data ?? [];
  const meta = data?.meta;
  const isEmpty = files.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Files</h1>

      <FileToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        order={order}
        onOrderChange={setOrder}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        adminView
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No files found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => {
                  const Icon = getFileIcon(file.mimeType);
                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="flex items-center gap-2 font-medium text-left hover:underline cursor-pointer"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          {file.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {file.user.name} / {file.user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatSize(file.size)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {file.mimeType}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {file.folder?.name || ""}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(file.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setDeleteItem({ id: file.id, name: file.name })
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!isLoading && !isEmpty && meta && meta.totalPages > 1 && (
        <Pagination className="mt-4">
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
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                const total = meta.totalPages;
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
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                aria-disabled={page === meta.totalPages}
                className={
                  page === meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="sm:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate">{previewFile?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {previewFile && (
              <FilePreview
                mimeType={previewFile.mimeType}
                name={previewFile.name}
                url={previewFile.url}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (previewFile)
                  handleDownloadFile(previewFile.url, previewFile.name);
              }}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AdminDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        fileId={deleteItem?.id ?? null}
        fileName={deleteItem?.name ?? null}
      />
    </div>
  );
}
