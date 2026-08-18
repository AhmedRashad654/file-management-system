"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteFile } from "@/hooks/files/use-delete-file";
import { useDeleteFolder } from "@/hooks/files/use-delete-folder";
import { Trash2 } from "lucide-react";
import type { FileResult, FolderResult } from "@/lib/api-types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FileResult | FolderResult | null;
  itemType: "file" | "folder";
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  item,
  itemType,
}: DeleteConfirmDialogProps) {
  const deleteFile = useDeleteFile();
  const deleteFolder = useDeleteFolder();

  const isPending = deleteFile.isPending || deleteFolder.isPending;

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!item) return;

    const mutation = itemType === "file" ? deleteFile : deleteFolder;
    mutation.mutate(item.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Delete {itemType === "file" ? "file" : "folder"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{item?.name}</span>
            {itemType === "folder" && " and all its contents"}. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
