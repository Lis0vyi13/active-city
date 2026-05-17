"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";
import type { CourtFilters } from "@/features/court-filter";
import { buildCatalogQuery } from "@/features/court-filter/lib/parse-catalog-search-params";
import { Pagination } from "@/shared/ui/pagination";

interface CourtCatalogPaginationProps {
  filters: CourtFilters;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function CourtCatalogPagination({
  filters,
  page,
  totalPages,
  totalItems,
  pageSize,
}: CourtCatalogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { requireAuth } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || isPending) {
      return;
    }

    requireAuth(() => {
      startTransition(() => {
        router.push(
          `${pathname}${buildCatalogQuery(filters, nextPage)}`
        );
      });
    });
  };

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={handlePageChange}
    />
  );
}
