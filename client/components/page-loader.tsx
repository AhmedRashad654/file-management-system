"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoader() {
  return (
    <div
      className="flex h-screen w-full bg-background"
    >
      <div className="hidden w-64 flex-col gap-4 border-r p-4 md:flex">
        <Skeleton className="h-8 w-32" />
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-[80%]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex-1 p-6">
          <Skeleton className="mb-6 h-6 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
