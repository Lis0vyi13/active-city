import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function getOccupiedTimeSlotsForCourt(
  courtId: string,
  bookingDate: string
): Promise<string[]> {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("time_slots")
    .eq("court_id", courtId)
    .eq("booking_date", bookingDate)
    .eq("status", "paid");

  if (error || !data) {
    console.error("Failed to fetch occupied slots:", error?.message);
    return [];
  }

  const occupied = new Set<string>();

  for (const row of data) {
    for (const slot of row.time_slots as string[]) {
      occupied.add(slot);
    }
  }

  return [...occupied];
}
