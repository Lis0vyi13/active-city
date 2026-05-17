"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderCatalogLink() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-primary"
    >
      Каталог
    </Link>
  );
}
