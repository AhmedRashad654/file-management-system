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
import { useDeleteAdminFile } from "@/hooks/files/use-delete-admin-file";
import { Trash2 } from "lucide-react";

interface AdminDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string | null;
  fileName: string | null;
}

export function AdminDeleteDialog({
  open,
  onOpenChange,
  fileId,
  fileName,
}: AdminDeleteDialogProps) {
  const deleteMutation = useDeleteAdminFile();

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fileId) return;

    deleteMutation.mutate(fileId, {
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
          <AlertDialogTitle>Delete file?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{fileName}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
