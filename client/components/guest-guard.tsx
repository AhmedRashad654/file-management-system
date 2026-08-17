"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageLoader } from "@/components/page-loader";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/files");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return <PageLoader />;

  return <>{children}</>;
}
