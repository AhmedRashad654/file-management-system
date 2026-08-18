import { AuthGuard } from "@/components/auth-guard";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-full">
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center border-b px-4 py-2 lg:hidden">
            <MobileNav />
          </div>
          <main className="flex-1 overflow-auto p-6 w-full max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
