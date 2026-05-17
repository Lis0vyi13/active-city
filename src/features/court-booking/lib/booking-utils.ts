const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

const UK_MONTHS_SHORT = [
  "СІЧ",
  "ЛЮТ",
  "БЕР",
  "КВІ",
  "ТРА",
  "ЧЕР",
  "ЛИП",
  "СЕР",
  "ВЕР",
  "ЖОВ",
  "ЛИС",
  "ГРУ",
] as const;

const UK_MONTHS_FULL = [
  "Січня",
  "Лютого",
  "Березня",
  "Квітня",
  "Травня",
  "Червня",
  "Липня",
  "Серпня",
  "Вересня",
  "Жовтня",
  "Листопада",
  "Грудня",
] as const;

const UK_WEEKDAYS_SHORT = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;

export interface BookingDate {
  date: Date;
  label: string;
  isToday: boolean;
}

export function getBookingDates(count = 7): BookingDate[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isToday = index === 0;
    const weekday = UK_WEEKDAYS_SHORT[date.getDay()];
    const day = date.getDate();
    const month = UK_MONTHS_SHORT[date.getMonth()];

    return {
      date,
      label: isToday ? `Сьогд ${day} ${month}` : `${weekday} ${day}`,
      isToday,
    };
  });
}

export function formatBookingDate(date: Date): string {
  return `${date.getDate()} ${UK_MONTHS_FULL[date.getMonth()]}`;
}

export function getTimeSlots(): TimeSlot[] {
  return [...TIME_SLOTS];
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSlotPast(date: Date, slot: TimeSlot): boolean {
  const today = new Date();
  if (!isSameCalendarDay(date, today)) {
    return false;
  }

  const [hours, minutes] = slot.split(":").map(Number);
  const slotStart = new Date();
  slotStart.setHours(hours, minutes, 0, 0);

  return slotStart.getTime() < Date.now();
}

export function isSlotOccupied(
  courtId: string,
  date: Date,
  slot: TimeSlot
): boolean {
  const seed = `${courtId}-${date.toDateString()}-${slot}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100;
  }

  return hash < 28;
}

export function formatSelectedTime(slots: TimeSlot[]): string {
  if (slots.length === 0) {
    return "Не обрано";
  }

  const start = slots[0];
  const end = slots[slots.length - 1];
  const [endHours] = end.split(":");
  const endTime = `${String(Number(endHours) + 1).padStart(2, "0")}:00`;

  return `${start} - ${endTime}`;
}

export function getSlotRange(start: TimeSlot, end: TimeSlot): TimeSlot[] {
  const slots = getTimeSlots();
  const startIndex = slots.indexOf(start);
  const endIndex = slots.indexOf(end);
  const from = Math.min(startIndex, endIndex);
  const to = Math.max(startIndex, endIndex);

  return slots.slice(from, to + 1);
}

export function isSlotSelectable(
  courtId: string,
  date: Date,
  slot: TimeSlot
): boolean {
  return !isSlotPast(date, slot) && !isSlotOccupied(courtId, date, slot);
}

export function isRangeAvailable(
  courtId: string,
  date: Date,
  slots: TimeSlot[]
): boolean {
  return slots.every((slot) => isSlotSelectable(courtId, date, slot));
}

export function calculateBookingTotal(
  pricePerHour: number,
  slots: TimeSlot[]
): number {
  return slots.length * pricePerHour;
}
