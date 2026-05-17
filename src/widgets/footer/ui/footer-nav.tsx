"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth";

const linkClass =
  "w-fit cursor-pointer transition-colors hover:text-primary";

export function FooterNav() {
  const { user } = useAuth();
  const showBookings = Boolean(user);

  return (
    <nav aria-label="Футер" className="flex flex-col gap-2 text-sm text-white/70">
      <Link href="/" className={linkClass}>
        Каталог
      </Link>
      {showBookings ? (
        <Link href="/bookings" className={linkClass}>
          Мої бронювання
        </Link>
      ) : null}
    </nav>
  );
}
