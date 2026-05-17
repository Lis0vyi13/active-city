"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] pointer-events-none transition-opacity duration-200 data-[open]:pointer-events-auto data-[ending-style]:pointer-events-none data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function DialogPopup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-xl outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-[opacity,transform] duration-200 data-[ending-style]:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Popup>
  );
}

function DialogClose({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        "absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <X className="size-4" />}
    </DialogPrimitive.Close>
  );
}

export { Dialog, DialogPortal, DialogBackdrop, DialogPopup, DialogClose };
