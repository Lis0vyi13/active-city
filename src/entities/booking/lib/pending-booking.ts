import type { PendingBooking } from "../model/types";
import { PENDING_BOOKING_KEY } from "../model/types";

export function savePendingBooking(booking: PendingBooking): void {
  sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking));
}

export function getPendingBooking(): PendingBooking | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingBooking;
  } catch {
    return null;
  }
}

export function clearPendingBooking(): void {
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
}
