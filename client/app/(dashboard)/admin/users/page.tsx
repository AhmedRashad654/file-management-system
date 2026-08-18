"use client";

import * as React from "react";
import { useUsers } from "@/hooks/users/use-users";
import { useAuthStore } from "@/stores/auth-store";
import { UserDeleteDialog } from "@/components/admin/user-delete-dialog";
import { UserRoleDialog } from "@/components/admin/user-role-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User,
  Shield,
  ShieldOff,
  Trash2,
  Settings,
  Calendar,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { formatDate } from "@/utils";
import type { SafeUser, Role } from "@/lib/api-types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_LIMIT = 10;

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [roleFilter, setRoleFilter] = React.useState<Role | "">("");
  const [page, setPage] = React.useState(1);

  const [deleteItem, setDeleteItem] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [roleItem, setRoleItem] = React.useState<SafeUser | null>(null);

  const { data, isLoading } = useUsers({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setPage(1);
    }, 0);
  }, [debouncedSearch, roleFilter]);

  const users = data?.data ?? [];
  const meta = data?.meta;
  const isEmpty = users.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={"Search by name or email ..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                  {roleFilter || "All Roles"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setRoleFilter("")}>
                  ALL ROLES
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("USER")}>
                  USER
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("ADMIN")}>
                  ADMIN
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

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
              No users found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>is Active</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-24" >Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isCurrentUser = u.id === currentUser?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {u.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "ADMIN" ? "default" : "secondary"}
                        >
                          {u.role === "ADMIN" ? (
                            <Shield className="mr-1 h-3 w-3" />
                          ) : (
                            <ShieldOff className="mr-1 h-3 w-3" />
                          )}
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.isVerified ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(u.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!isCurrentUser && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setRoleItem(u)}
                              title="Change role"
                            >
                              <Settings className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                setDeleteItem({ id: u.id, name: u.name })
                              }
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
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

      {/* Delete Dialog */}
      <UserDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        userId={deleteItem?.id ?? null}
        userName={deleteItem?.name ?? null}
      />

      {/* Role Dialog */}
      <UserRoleDialog
        open={!!roleItem}
        onOpenChange={(open) => {
          if (!open) setRoleItem(null);
        }}
        userId={roleItem?.id ?? null}
        userName={roleItem?.name ?? null}
        currentRole={roleItem?.role ?? null}
      />
    </div>
  );
}
