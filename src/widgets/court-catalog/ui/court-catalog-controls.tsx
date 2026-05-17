"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  CourtFiltersPanel,
  type CourtFilters,
} from "@/features/court-filter";
import { buildCatalogQuery } from "@/features/court-filter/lib/parse-catalog-search-params";

interface CourtCatalogControlsProps {
  filters: CourtFilters;
}

export function CourtCatalogControls({ filters }: CourtCatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const navigate = (nextFilters: CourtFilters, page = 1) => {
    startTransition(() => {
      router.push(`${pathname}${buildCatalogQuery(nextFilters, page)}`);
    });
  };

  return (
    <CourtFiltersPanel
      filters={filters}
      onChange={(next) => navigate(next, 1)}
    />
  );
}
