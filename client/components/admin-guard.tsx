"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageLoader } from "@/components/page-loader";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/files");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user && user.role !== "ADMIN")) return <PageLoader />;

  return <>{children}</>;
}
