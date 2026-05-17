import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CourtRow } from "../model/database";
import type { Court } from "../model/types";
import { mapCourtRow } from "../lib/map-court";

export async function getCourts(): Promise<Court[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch courts:", error?.message);
    return [];
  }

  return (data as CourtRow[]).map(mapCourtRow);
}

export async function getCourtById(id: string): Promise<Court | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch court:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapCourtRow(data as CourtRow);
}
