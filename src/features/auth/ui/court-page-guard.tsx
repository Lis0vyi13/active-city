"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./auth-provider";

interface CourtPageGuardProps {
  children: React.ReactNode;
}

export function CourtPageGuard({ children }: CourtPageGuardProps) {
  const router = useRouter();
  const { user, requireAuth, authModalOpen } = useAuth();
  const promptedRef = useRef(false);
  const modalWasOpenRef = useRef(false);

  useEffect(() => {
    if (user || promptedRef.current) {
      return;
    }

    promptedRef.current = true;
    requireAuth(() => {});
  }, [requireAuth, user]);

  useEffect(() => {
    if (authModalOpen) {
      modalWasOpenRef.current = true;
      return;
    }

    if (user || !modalWasOpenRef.current) {
      return;
    }

    modalWasOpenRef.current = false;
    router.replace("/");
  }, [authModalOpen, router, user]);

  if (!user) {
    return (
      <div className="pointer-events-none select-none opacity-40 blur-[2px]">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
