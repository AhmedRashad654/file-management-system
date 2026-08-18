"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUserRole } from "@/hooks/users/use-update-user-role";
import { useState } from "react";
import type { Role } from "@/lib/api-types";

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userName: string | null;
  currentRole: Role | null;
}

export function UserRoleDialog({
  open,
  onOpenChange,
  userId,
  userName,
  currentRole,
}: UserRoleDialogProps) {
  const updateMutation = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole ?? "USER");

  const handleConfirm = () => {
    if (!userId || !selectedRole) return;

    updateMutation.mutate(
      { id: userId, role: selectedRole },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change role for {userName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Select the new role for this user:
          </p>
          <div className="flex gap-2">
            <Button
              variant={selectedRole === "USER" ? "default" : "outline"}
              onClick={() => setSelectedRole("USER")}
            >
              User
            </Button>
            <Button
              variant={selectedRole === "ADMIN" ? "default" : "outline"}
              onClick={() => setSelectedRole("ADMIN")}
            >
              Admin
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateMutation.isPending || selectedRole === currentRole}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
