"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearPendingBooking } from "@/entities/booking";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isSuccess = Boolean(sessionId);

  useEffect(() => {
    if (isSuccess) {
      clearPendingBooking();
    }
  }, [isSuccess]);

  if (!isSuccess) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
        <XCircle className="mx-auto mb-4 size-12 text-destructive" />
        <h1 className="text-xl font-bold text-foreground">
          Не вдалося підтвердити оплату
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Перевірте «Мої бронювання» або спробуйте ще раз.
        </p>
        <Button className="mt-6 rounded-xl" render={<Link href="/" />}>
          До каталогу
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
      <CheckCircle2 className="mx-auto mb-4 size-16 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">Оплата успішна!</h1>
      <p className="mt-2 text-muted-foreground">
        Оплату успішно завершено. Бронювання з&apos;явиться в розділі «Мої
        бронювання».
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button className="rounded-xl" render={<Link href="/bookings" />}>
          Мої бронювання
        </Button>
        <Button
          variant="outline"
          className="rounded-xl"
          render={<Link href="/" />}
        >
          До каталогу
        </Button>
      </div>
    </div>
  );
}
