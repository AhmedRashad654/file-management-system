"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageLoader } from "@/components/page-loader";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated ? "/files" : "/login");
  }, [isAuthenticated, router]);

  return <PageLoader />;
}
