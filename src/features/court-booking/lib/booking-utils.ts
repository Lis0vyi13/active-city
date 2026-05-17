const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
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

export const MAX_BOOKING_DAYS_AHEAD = 90;

export const UK_WEEKDAYS_HEADER = [
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
  "Нд",
] as const;

export const UK_MONTHS = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
] as const;

export function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function getToday(): Date {
  return startOfDay(new Date());
}

export function getMaxBookableDate(): Date {
  const max = getToday();
  max.setDate(max.getDate() + MAX_BOOKING_DAYS_AHEAD);
  return max;
}

export function isDateBookable(date: Date): boolean {
  const normalized = startOfDay(date);
  return (
    normalized >= getToday() && normalized <= getMaxBookableDate()
  );
}

export function getMonthLabel(month: Date): string {
  return `${UK_MONTHS[month.getMonth()]} ${month.getFullYear()}`;
}

export function getCalendarDays(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startPadding = (firstDay.getDay() + 6) % 7;

  const cells: (Date | null)[] = Array.from({ length: startPadding }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }

  return cells;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(month: Date, count: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + count, 1);
}

export function formatBookingDate(date: Date): string {
  return `${date.getDate()} ${UK_MONTHS_FULL[date.getMonth()]}`;
}

export function getTimeSlots(): TimeSlot[] {
  return [...TIME_SLOTS];
}

export function isValidTimeSlot(value: string): value is TimeSlot {
  return TIME_SLOTS.includes(value as TimeSlot);
}

export function toBookingDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isSlotPast(date: Date, slot: TimeSlot): boolean {
  const today = getToday();
  if (!isSameDay(date, today)) {
    return false;
  }

  const [hours, minutes] = slot.split(":").map(Number);
  const slotStart = new Date();
  slotStart.setHours(hours, minutes, 0, 0);

  return slotStart.getTime() < Date.now();
}

export function isSlotBooked(
  slot: TimeSlot,
  occupiedSlots: ReadonlySet<string>
): boolean {
  return occupiedSlots.has(slot);
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
  date: Date,
  slot: TimeSlot,
  occupiedSlots: ReadonlySet<string>
): boolean {
  return !isSlotPast(date, slot) && !isSlotBooked(slot, occupiedSlots);
}

export function isRangeAvailable(
  date: Date,
  slots: TimeSlot[],
  occupiedSlots: ReadonlySet<string>
): boolean {
  return slots.every((slot) => isSlotSelectable(date, slot, occupiedSlots));
}

export function calculateBookingTotal(
  pricePerHour: number,
  slots: TimeSlot[]
): number {
  return slots.length * pricePerHour;
}
