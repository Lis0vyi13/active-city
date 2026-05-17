import Link from "next/link";
import { Activity } from "lucide-react";

import { FooterNav } from "./footer-nav";

const TEAM_MEMBERS = [
  "Лісовий Олександр Сергійович",
  "Горбатенко Максим Миколайович",
  "Шевченко Владислав Костянтинович",
  "Галушко Юрій Олександрович",
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex cursor-pointer items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Activity className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">ActiveCity</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Онлайн-платформа для бронювання спортивних майданчиків у вашому місті. Швидко, зручно
              та прозоро.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Навігація
            </h3>
            <FooterNav />
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Виконали
            </h3>
            <p className="text-sm font-medium text-white/85">Студенти групи 501-ТН</p>
            <ul className="space-y-2 text-sm text-white/70">
              {TEAM_MEMBERS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:flex-row sm:text-left">
          <p>© {year} ActiveCity. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
