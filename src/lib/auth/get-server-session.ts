import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/entities/profile/model/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ServerSession {
  user: User | null;
  profile: Profile | null;
}

export async function getServerSession(): Promise<ServerSession> {
  if (!isSupabaseConfigured()) {
    return { user: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile: profile ?? null };
}
