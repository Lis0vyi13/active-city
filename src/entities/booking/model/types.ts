export interface PendingBooking {
  courtId: string;
  courtName: string;
  bookingDate: string;
  timeSlots: string[];
  totalPrice: number;
  pricePerHour: number;
}

export interface BookingRecord {
  id: string;
  user_id: string;
  court_id: string;
  court_name: string;
  booking_date: string;
  time_slots: string[];
  total_price: number;
  status: string;
  created_at: string;
}

export const PENDING_BOOKING_KEY = "activecity_pending_booking";
