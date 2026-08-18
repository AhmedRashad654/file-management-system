"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Separator } from "@/components/ui/separator";
import { Files, LayoutDashboard, Shield, LogOut, UserShield, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth/use-logout";
import { ModeToggle } from "./mode-toggle";

const NAV_ITEMS = [
  { href: "/files", label: "My Files", icon: Files },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
] as const;

const ADMIN_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/files", label: "All Files", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
] as const;

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const loginMutation = useLogout();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    loginMutation.mutate();
  };

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3">
        <Files className="h-5 w-5 text-primary" />
        <span className="font-heading text-base font-semibold">
          FileManager
        </span>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <Separator className="my-2" />
            <span className="px-3 text-xs font-medium text-muted-foreground">
              Admin
            </span>
            {ADMIN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <Separator />

      <div className="space-y-1 p-2">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <ModeToggle />
        </div>
        <Link
          href="/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/profile"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <UserShield className="h-4 w-4" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </>
  );
}
