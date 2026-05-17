"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPendingBooking, type PendingBooking } from "@/entities/booking";
import { AuthModal, useAuth } from "@/features/auth";
import { CheckoutForm } from "./checkout-form";

export function CheckoutPageContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [booking, setBooking] = useState<PendingBooking | null>(null);
  const [ready, setReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setBooking(getPendingBooking());
    setReady(true);
  }, []);

  if (!ready || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
        <p className="text-muted-foreground">Немає даних для оплати.</p>
        <Button className="mt-4 rounded-xl" render={<Link href="/" />}>
          До каталогу
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
          <p className="text-muted-foreground">
            Увійдіть, щоб завершити бронювання.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button className="rounded-xl" onClick={() => setAuthOpen(true)}>
              Увійти
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push(`/courts/${booking.courtId}`)}
            >
              Назад
            </Button>
          </div>
        </div>
        <AuthModal
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={() => router.refresh()}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/courts/${booking.courtId}`}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Назад до майданчика
      </Link>
      <CheckoutForm booking={booking} />
    </div>
  );
}
