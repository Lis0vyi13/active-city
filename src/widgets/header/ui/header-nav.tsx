"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

const navLinkClass =
  "cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-primary";

export function HeaderNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isBookings = pathname.startsWith("/bookings");

  if (!user) {
    return null;
  }

  return (
    <nav
      aria-label="Головна навігація"
      className="flex items-center gap-4 sm:gap-6"
    >
      <Link
        href="/bookings"
        className={cn(
          navLinkClass,
          isBookings && "font-semibold text-primary"
        )}
      >
        Мої бронювання
      </Link>
    </nav>
  );
}
