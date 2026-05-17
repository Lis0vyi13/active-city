"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BookingRecord } from "@/entities/booking";
import { useAuth } from "@/features/auth";
import { createClient } from "@/lib/supabase/client";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(slots: string[]): string {
  if (slots.length === 0) {
    return "—";
  }

  const start = slots[0];
  const end = slots[slots.length - 1];
  const [endHours] = end.split(":");
  const endTime = `${String(Number(endHours) + 1).padStart(2, "0")}:00`;

  return `${start} - ${endTime}`;
}

export function BookingsList() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookings((data as BookingRecord[]) ?? []);
      setLoading(false);
    };

    void fetchBookings();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
        <p className="text-muted-foreground">Увійдіть, щоб переглянути бронювання.</p>
        <Button className="mt-4 rounded-xl" render={<Link href="/" />}>
          На головну
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40">
        <Calendar className="mx-auto mb-4 size-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">
          Бронювань ще немає
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Оберіть майданчик у каталозі та забронюйте час.
        </p>
        <Button className="mt-4 rounded-xl" render={<Link href="/" />}>
          До каталогу
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article
          key={booking.id}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border/40 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {booking.court_name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(booking.booking_date)} ·{" "}
                {formatTimeRange(booking.time_slots)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-lg font-bold text-primary">
                {booking.total_price} ₴
              </p>
              <span className="mt-1 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {booking.status === "paid" ? "Оплачено" : booking.status}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
