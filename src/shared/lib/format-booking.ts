export function formatBookingDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatBookingTimeRange(slots: string[]): string {
  if (slots.length === 0) {
    return "—";
  }

  const start = slots[0];
  const end = slots[slots.length - 1];
  const [endHours] = end.split(":");
  const endTime = `${String(Number(endHours) + 1).padStart(2, "0")}:00`;

  return `${start} - ${endTime}`;
}
