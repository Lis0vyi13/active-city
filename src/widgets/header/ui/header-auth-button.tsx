"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AuthModal, useAuth } from "@/features/auth";
import { getPendingBooking } from "@/entities/booking";
import { cn } from "@/lib/utils";

export function HeaderAuthButton() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleAuthSuccess = () => {
    const pending = getPendingBooking();
    if (pending) {
      router.push("/checkout");
    }
  };

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      await signOut();
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />;
  }

  if (user) {
    const displayName = profile?.full_name?.split(" ")[0] ?? "Профіль";

    return (
      <div className="flex items-center gap-3">
        <Link
          href="/bookings"
          className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Мої бронювання
        </Link>
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          {displayName}
        </span>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">
            {signingOut ? "Вихід..." : "Вийти"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        className="h-9 gap-1.5 rounded-full px-4"
        onClick={() => setOpen(true)}
      >
        <LogIn className="size-4" />
        Увійти
      </Button>
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
