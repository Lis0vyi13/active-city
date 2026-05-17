import { getOccupiedTimeSlotsForCourt } from "@/entities/booking/api/court-occupancy";
import type { PendingBooking } from "@/entities/booking";
import { getCourtById } from "@/entities/court/api/courts-repository";
import { isValidTimeSlot } from "@/features/court-booking/lib/booking-utils";

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

  if (!payload.timeSlots.every((slot) => isValidTimeSlot(slot))) {
    return { ok: false, error: "Невірний час бронювання" };
  }

  const occupied = await getOccupiedTimeSlotsForCourt(
    payload.courtId,
    payload.bookingDate
  );
  const occupiedSet = new Set(occupied);

  if (payload.timeSlots.some((slot) => occupiedSet.has(slot))) {
    return { ok: false, error: "Обраний час уже зайнятий. Оберіть інший слот." };
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
