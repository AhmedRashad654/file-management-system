"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: "text-sm",
      }}
    />
  );
}
