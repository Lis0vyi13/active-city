"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { savePendingBooking } from "@/entities/booking";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import type { Court } from "@/entities/court";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatSelectedTime,
  getSlotRange,
  getTimeSlots,
  getToday,
  isRangeAvailable,
  isSlotOccupied,
  isSlotPast,
  isSlotSelectable,
  startOfDay,
  type TimeSlot,
} from "../lib/booking-utils";
import { BookingCalendar } from "./booking-calendar";

interface BookingPanelProps {
  court: Court;
}

export function BookingPanel({ court }: BookingPanelProps) {
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const timeSlots = getTimeSlots();
  const total = calculateBookingTotal(court.pricePerHour, selectedSlots);

  const handleDateChange = (date: Date) => {
    setSelectedDate(startOfDay(date));
    setSelectedSlots([]);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!isSlotSelectable(court.id, selectedDate, slot)) {
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    if (selectedSlots.length === 1 && selectedSlots[0] === slot) {
      setSelectedSlots([]);
      return;
    }

    const anchor = selectedSlots[0];
    const range = getSlotRange(anchor, slot);

    if (isRangeAvailable(court.id, selectedDate, range)) {
      setSelectedSlots(range);
      return;
    }

    setSelectedSlots([slot]);
  };

  const goToCheckout = () => {
    if (selectedSlots.length === 0) {
      return;
    }

    const bookingDate = selectedDate.toISOString().split("T")[0];

    savePendingBooking({
      courtId: court.id,
      courtName: court.name,
      bookingDate,
      timeSlots: selectedSlots,
      totalPrice: total,
      pricePerHour: court.pricePerHour,
    });

    if (!user) {
      requireAuth(() => router.push("/checkout"));
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <div className="w-full min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/40 sm:p-6">
        <div className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
          <Calendar className="size-4 shrink-0 text-primary" />
          Оберіть дату та час
        </div>

        <div className="mb-5">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Дата</p>
          <BookingCalendar selected={selectedDate} onSelect={handleDateChange} />
        </div>

        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-foreground">
            Доступні години
          </span>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full border border-border bg-white" />
              Вільний
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#f9fafc]" />
              Зайнятий
            </span>
          </div>
        </div>

        <div className="booking-scroll mb-6 max-h-52 min-w-0 overflow-y-auto pr-1 sm:max-h-60 md:max-h-none md:overflow-visible md:pr-0">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {timeSlots.map((slot) => {
              const occupied = isSlotOccupied(court.id, selectedDate, slot);
              const past = isSlotPast(selectedDate, slot);
              const unavailable = occupied || past;
              const isSelected = selectedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={unavailable}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    "min-w-0 cursor-pointer rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors",
                    unavailable
                      ? "cursor-not-allowed border-transparent bg-[#f9fafc] text-muted-foreground"
                      : isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/40"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="shrink-0 text-muted-foreground">Вартість за годину</span>
            <span className="text-right font-medium text-foreground">
              {court.pricePerHour} ₴
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="shrink-0 text-muted-foreground">Дата</span>
            <span className="text-right font-medium text-foreground">
              {formatBookingDate(selectedDate)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="shrink-0 text-muted-foreground">Обраний час</span>
            <span className="text-right font-medium text-foreground">
              {formatSelectedTime(selectedSlots)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="shrink-0 font-semibold text-foreground">До сплати</span>
            <span className="text-lg font-bold text-primary">{total} ₴</span>
          </div>
        </div>

        <Button
          disabled={selectedSlots.length === 0}
          onClick={goToCheckout}
          className="mt-5 h-11 w-full rounded-xl text-sm sm:text-base"
        >
          {selectedSlots.length > 0
            ? "Перейти до оплати"
            : "Оберіть час для оплати"}
        </Button>
      </div>

    </>
  );
}
