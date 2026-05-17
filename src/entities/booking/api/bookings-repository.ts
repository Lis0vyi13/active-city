import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { BookingRecord } from "../model/types";

export async function getBookingsByUserId(
  userId: string
): Promise<BookingRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bookings:", error.message);
    return [];
  }

  return (data as BookingRecord[]) ?? [];
}
