import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import type { BookingRecord } from "@/entities/booking";
import { cn } from "@/lib/utils";
import {
  formatBookingDate,
  formatBookingTimeRange,
} from "@/shared/lib/format-booking";

interface BookingsContentProps {
  user: User | null;
  bookings: BookingRecord[];
}

const panelClass =
  "flex flex-1 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-border/40";

export function BookingsContent({ user, bookings }: BookingsContentProps) {
  if (!user) {
    return (
      <div className={panelClass}>
        <p className="text-muted-foreground">
          Увійдіть, щоб переглянути бронювання.
        </p>
        <Button className="mt-4 rounded-xl" render={<Link href="/" />}>
          На головну
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={panelClass}>
        <Calendar className="mb-4 size-12 text-muted-foreground/40" />
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
    <div className="flex flex-1 flex-col space-y-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/courts/${booking.court_id}`}
          className={cn(
            "group block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border/40 transition-all",
            "hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/25 sm:p-6"
          )}
        >
          <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {booking.court_name}
                </h2>
                <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatBookingDate(booking.booking_date)} ·{" "}
                {formatBookingTimeRange(booking.time_slots)}
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
          </article>
        </Link>
      ))}
    </div>
  );
}
