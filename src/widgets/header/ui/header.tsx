import Link from "next/link";
import { Activity } from "lucide-react";

import { HeaderAuthButton } from "./header-auth-button";
import { HeaderNav } from "./header-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/75 shadow-sm shadow-black/[0.03] backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link
            href="/"
            className="flex shrink-0 cursor-pointer items-center gap-2.5"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ActiveCity
            </span>
          </Link>
          <HeaderNav />
        </div>

        <HeaderAuthButton />
      </div>
    </header>
  );
}
