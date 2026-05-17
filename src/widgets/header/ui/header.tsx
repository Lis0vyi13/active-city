import Link from "next/link";
import { Activity } from "lucide-react";

import { HeaderAuthButton } from "./header-auth-button";
import { HeaderCatalogLink } from "./header-catalog-link";

export function Header() {
  return (
    <header className="relative z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex cursor-pointer items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            ActiveCity
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <HeaderCatalogLink />
          <HeaderAuthButton />
        </div>
      </div>
    </header>
  );
}
