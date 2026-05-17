"use client";

import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

export function HeaderAuthButton() {
  const { user, profile, signOut, openAuthModal } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  if (user) {
    const displayName = profile?.full_name?.split(" ")[0] ?? "Користувач";

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden max-w-[100px] truncate text-sm font-medium text-foreground md:inline lg:max-w-[140px]">
          {displayName}
        </span>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-navy px-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90 sm:px-4",
            "disabled:cursor-not-allowed disabled:opacity-60"
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
    <button
      type="button"
      onClick={openAuthModal}
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      <LogIn className="size-4" />
      Увійти
    </button>
  );
}
