import { getCourtById } from "@/entities/court/api/courts-repository";
import type { PendingBooking } from "@/entities/booking";

export interface CheckoutPayload {
  courtId: string;
  courtName: string;
  bookingDate: string;
  timeSlots: string[];
  totalPrice: number;
}

export function isCheckoutPayload(
  value: unknown
): value is CheckoutPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as CheckoutPayload;

  return (
    typeof payload.courtId === "string" &&
    typeof payload.courtName === "string" &&
    typeof payload.bookingDate === "string" &&
    Array.isArray(payload.timeSlots) &&
    payload.timeSlots.length > 0 &&
    payload.timeSlots.every((slot) => typeof slot === "string") &&
    typeof payload.totalPrice === "number" &&
    payload.totalPrice > 0
  );
}

export async function validateCheckoutPayload(
  payload: CheckoutPayload
): Promise<{ ok: true; booking: PendingBooking } | { ok: false; error: string }> {
  const court = await getCourtById(payload.courtId);

  if (!court) {
    return { ok: false, error: "Майданчик не знайдено" };
  }

  const expectedTotal = court.pricePerHour * payload.timeSlots.length;

  if (expectedTotal !== payload.totalPrice) {
    return { ok: false, error: "Невірна сума оплати" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.bookingDate)) {
    return { ok: false, error: "Невірна дата бронювання" };
  }

  return {
    ok: true,
    booking: {
      courtId: payload.courtId,
      courtName: court.name,
      bookingDate: payload.bookingDate,
      timeSlots: payload.timeSlots,
      totalPrice: expectedTotal,
      pricePerHour: court.pricePerHour,
    },
  };
}
