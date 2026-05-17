"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PendingBooking } from "@/entities/booking";
import { useAuth } from "@/features/auth";
import { formatSelectedTime } from "@/features/court-booking/lib/booking-utils";
import type { TimeSlot } from "@/features/court-booking/lib/booking-utils";

interface CheckoutFormProps {
  booking: PendingBooking;
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

export function CheckoutForm({ booking }: CheckoutFormProps) {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeLabel = formatSelectedTime(booking.timeSlots as TimeSlot[]);

  const handlePay = async () => {
    if (!user) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId: booking.courtId,
          courtName: booking.courtName,
          bookingDate: booking.bookingDate,
          timeSlots: booking.timeSlots,
          totalPrice: booking.totalPrice,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? "Не вдалося розпочати оплату");
        setProcessing(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Помилка з'єднання. Спробуйте ще раз.");
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_380px]">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border/40 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Оплата</h1>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          Натисніть кнопку нижче, щоб перейти на захищену сторінку оплати.
        </p>

        {error ? (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          disabled={processing}
          onClick={() => void handlePay()}
          className="h-12 w-full rounded-xl bg-navy text-base font-semibold text-navy-foreground hover:bg-navy/90"
        >
          {processing ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Перенаправлення...
            </>
          ) : (
            `Оплатити ${booking.totalPrice} ₴`
          )}
        </Button>
      </div>

      <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border/40">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Деталі замовлення
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Майданчик</span>
            <span className="text-right font-medium">{booking.courtName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Дата</span>
            <span className="font-medium">
              {formatDateLabel(booking.bookingDate)}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Час</span>
            <span className="font-medium">{timeLabel}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-border/60 pt-3">
            <span className="font-semibold text-foreground">До сплати</span>
            <span className="text-lg font-bold text-primary">
              {booking.totalPrice} ₴
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
