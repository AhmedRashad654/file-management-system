"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";
import { PageLoader } from "@/components/page-loader";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, setAccessToken, clearSession, isAuthenticated } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(() => !isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;

    const restoreSession = async () => {
      try {
        const accessToken = await authService.refresh();
        setAccessToken(accessToken);
        const user = await authService.getProfile();
        setAuth(user, accessToken);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [clearSession, isAuthenticated, setAccessToken, setAuth]);

  if (isLoading) return <PageLoader />;

  return <>{children}</>;
}
