"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-border/60 bg-white text-foreground shadow-lg",
          title: "font-medium",
          description: "text-muted-foreground",
          success: "border-primary/30",
          error: "border-destructive/30",
        },
      }}
    />
  );
}
