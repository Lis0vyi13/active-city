"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/entities/profile/model/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

import type { ServerSession } from "@/lib/auth/get-server-session";

import { AuthModal } from "./auth-modal";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isConfigured: boolean;
  authModalOpen: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  syncSession: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  requireAuth: (action?: () => void) => boolean;
}

const defaultValue: AuthContextValue = {
  user: null,
  profile: null,
  isConfigured: false,
  authModalOpen: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  syncSession: async () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
  requireAuth: () => false,
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession: ServerSession;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(initialSession.user);
  const [profile, setProfile] = useState<Profile | null>(initialSession.profile);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
  }, []);

  const syncSession = useCallback(async () => {
    if (!configured) {
      setUser(null);
      setProfile(null);
      return;
    }

    const supabase = createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (currentUser) {
      await fetchProfile(currentUser.id);
    } else {
      setProfile(null);
    }
  }, [configured, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    await fetchProfile(user.id);
  }, [fetchProfile, user]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        void fetchProfile(nextUser.id);
      } else {
        setProfile(null);
      }

      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [configured, fetchProfile, router]);

  const openAuthModal = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    pendingActionRef.current = null;
  }, []);

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (user) {
        action?.();
        return true;
      }

      pendingActionRef.current = action ?? null;
      queueMicrotask(() => {
        setAuthModalOpen(true);
      });
      return false;
    },
    [user]
  );

  const handleAuthSuccess = useCallback(async () => {
    await syncSession();
    setAuthModalOpen(false);
    router.refresh();

    const pending = pendingActionRef.current;
    pendingActionRef.current = null;

    if (pending) {
      pending();
      return;
    }

    router.push("/");
  }, [router, syncSession]);

  const signOut = useCallback(async () => {
    pendingActionRef.current = null;

    if (!configured) {
      setUser(null);
      setProfile(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out:", error.message);
    }

    setUser(null);
    setProfile(null);
    router.refresh();
  }, [configured, router]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isConfigured: configured,
      authModalOpen,
      signOut,
      refreshProfile,
      syncSession,
      openAuthModal,
      closeAuthModal,
      requireAuth,
    }),
    [
      user,
      profile,
      configured,
      authModalOpen,
      signOut,
      refreshProfile,
      syncSession,
      openAuthModal,
      closeAuthModal,
      requireAuth,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={authModalOpen}
        onOpenChange={(open) => {
          if (open) {
            setAuthModalOpen(true);
            return;
          }
          closeAuthModal();
        }}
        onSuccess={() => void handleAuthSuccess()}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
