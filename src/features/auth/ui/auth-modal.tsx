"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import type { AuthTab } from "../model/types";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: AuthTab;
  onSuccess?: () => void;
}

interface AuthTabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function AuthTabButton({ active, onClick, children }: AuthTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
        active
          ? "border border-foreground/15 bg-white text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function FieldLabel({
  htmlFor,
  children,
  action,
}: {
  htmlFor: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {children}
      </label>
      {action}
    </div>
  );
}

interface AuthModalFormProps {
  initialTab: AuthTab;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function AuthModalForm({
  initialTab,
  onOpenChange,
  onSuccess,
}: AuthModalFormProps) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();

    if (!isSupabaseConfigured()) {
      setError("Supabase не налаштовано. Додайте ключі у .env.local");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (tab === "register") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(
          signUpError.message.toLowerCase().includes("already")
            ? "Цей email вже зареєстрований"
            : signUpError.message
        );
        setLoading(false);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Невірний email або пароль");
        setLoading(false);
        return;
      }

      toast.success("Вітаємо! Ви успішно увійшли.");
    }

    setLoading(false);
    onOpenChange(false);
    router.refresh();
    onSuccess?.();
  };

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Activity className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {tab === "login" ? "З поверненням!" : "Створити акаунт"}
        </h2>
      </div>

      <div className="mt-6 rounded-2xl bg-muted/60 p-1">
        <div className="flex gap-1">
          <AuthTabButton active={tab === "login"} onClick={() => setTab("login")}>
            Вхід
          </AuthTabButton>
          <AuthTabButton
            active={tab === "register"}
            onClick={() => setTab("register")}
          >
            Реєстрація
          </AuthTabButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {tab === "register" && (
          <div>
            <FieldLabel htmlFor="fullName">Ім&apos;я та Прізвище</FieldLabel>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Олександр Лісовий"
              required
              className="h-11 rounded-xl bg-white px-4"
            />
          </div>
        )}

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            className="h-11 rounded-xl bg-white px-4"
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="password"
            action={
              tab === "login" ? (
                <button
                  type="button"
                  className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Забули пароль?
                </button>
              ) : undefined
            }
          >
            Пароль
          </FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            className="h-11 rounded-xl bg-white px-4"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded-xl bg-navy text-base font-semibold text-navy-foreground hover:bg-navy/90"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : tab === "login" ? (
            "Увійти"
          ) : (
            "Зареєструватися"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        Продовжуючи, ви погоджуєтеся з нашими{" "}
        <button
          type="button"
          className="cursor-pointer font-medium text-primary transition-colors hover:text-primary/80"
        >
          Умовами використання
        </button>
      </p>
    </>
  );
}

export function AuthModal({
  open,
  onOpenChange,
  initialTab = "login",
  onSuccess,
}: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            <DialogClose aria-label="Закрити" />
            <AuthModalForm
              key={initialTab}
              initialTab={initialTab}
              onOpenChange={onOpenChange}
              onSuccess={onSuccess}
            />
          </DialogPopup>
        </DialogPortal>
      ) : null}
    </Dialog>
  );
}
