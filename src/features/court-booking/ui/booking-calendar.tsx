"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  addMonths,
  formatBookingDate,
  getCalendarDays,
  getMaxBookableDate,
  getMonthLabel,
  getMonthStart,
  getToday,
  isDateBookable,
  isSameDay,
  MAX_BOOKING_DAYS_AHEAD,
  UK_WEEKDAYS_HEADER,
} from "../lib/booking-utils";

interface BookingCalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export function BookingCalendar({ selected, onSelect }: BookingCalendarProps) {
  const today = useMemo(() => getToday(), []);
  const maxDate = useMemo(() => getMaxBookableDate(), []);

  const [viewMonth, setViewMonth] = useState(() => getMonthStart(selected));

  const calendarDays = useMemo(
    () => getCalendarDays(viewMonth),
    [viewMonth]
  );

  const minMonth = getMonthStart(today);
  const maxMonth = getMonthStart(maxDate);

  const canGoPrev = viewMonth.getTime() > minMonth.getTime();
  const canGoNext = viewMonth.getTime() < maxMonth.getTime();

  return (
    <div className="rounded-2xl border border-border/60 bg-[#f8fafb] p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth((c) => addMonths(c, -1))}
          disabled={!canGoPrev}
          aria-label="Попередній місяць"
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-white text-foreground transition-colors hover:border-primary/40",
            !canGoPrev && "cursor-not-allowed opacity-40"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>

        <p className="text-center text-sm font-semibold text-foreground sm:text-base">
          {getMonthLabel(viewMonth)}
        </p>

        <button
          type="button"
          onClick={() => canGoNext && setViewMonth((c) => addMonths(c, 1))}
          disabled={!canGoNext}
          aria-label="Наступний місяць"
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-white text-foreground transition-colors hover:border-primary/40",
            !canGoNext && "cursor-not-allowed opacity-40"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {UK_WEEKDAYS_HEADER.map((weekday) => (
          <div
            key={weekday}
            className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const bookable = isDateBookable(day);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!bookable}
              onClick={() => onSelect(day)}
              className={cn(
                "aspect-square cursor-pointer rounded-xl text-sm font-medium transition-all",
                !bookable && "cursor-not-allowed text-muted-foreground/40",
                bookable &&
                  !isSelected &&
                  "text-foreground hover:bg-white hover:shadow-sm",
                isToday && !isSelected && "ring-1 ring-primary/30",
                isSelected &&
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Бронювання на {MAX_BOOKING_DAYS_AHEAD} днів — до {formatBookingDate(maxDate)}
      </p>
    </div>
  );
}
