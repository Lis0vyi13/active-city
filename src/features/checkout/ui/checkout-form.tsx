"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearPendingBooking,
  type PendingBooking,
} from "@/entities/booking";
import { useAuth } from "@/features/auth";
import { formatSelectedTime } from "@/features/court-booking/lib/booking-utils";
import type { TimeSlot } from "@/features/court-booking/lib/booking-utils";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeLabel = formatSelectedTime(booking.timeSlots as TimeSlot[]);

  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      court_id: booking.courtId,
      court_name: booking.courtName,
      booking_date: booking.bookingDate,
      time_slots: booking.timeSlots,
      total_price: booking.totalPrice,
      status: "paid",
    });

    setProcessing(false);

    if (error) {
      alert("Помилка збереження бронювання. Перевірте налаштування Supabase.");
      return;
    }

    clearPendingBooking();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
        <CheckCircle2 className="mx-auto mb-4 size-16 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Оплата успішна!</h1>
        <p className="mt-2 text-muted-foreground">
          Бронювання {booking.courtName} підтверджено.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            className="rounded-xl"
            onClick={() => router.push("/bookings")}
          >
            Мої бронювання
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/")}
          >
            До каталогу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_380px]">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border/40 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Оплата карткою</h1>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Номер картки
            </label>
            <Input
              placeholder="4242 4242 4242 4242"
              defaultValue="4242 4242 4242 4242"
              className="h-11 rounded-xl px-4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Термін дії
              </label>
              <Input
                placeholder="12/28"
                defaultValue="12/28"
                className="h-11 rounded-xl px-4"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                CVV
              </label>
              <Input
                placeholder="123"
                defaultValue="123"
                className="h-11 rounded-xl px-4"
                required
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Демо-оплата. Реальні кошти не списуються.
          </p>

          <Button
            type="submit"
            disabled={processing}
            className="mt-2 h-12 w-full rounded-xl bg-navy text-base font-semibold text-navy-foreground hover:bg-navy/90"
          >
            {processing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Обробка...
              </>
            ) : (
              `Оплатити ${booking.totalPrice} ₴`
            )}
          </Button>
        </form>
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
