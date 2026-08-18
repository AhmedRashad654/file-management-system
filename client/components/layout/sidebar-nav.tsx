"use client";

import { SidebarContent } from "./sidebar-content";

export function SidebarNav() {
  return (
    <aside className="hidden lg:flex min-h-screen w-56 flex-col border-r bg-card">
      <SidebarContent />
    </aside>
  );
}
