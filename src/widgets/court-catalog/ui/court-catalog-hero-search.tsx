"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourtFilters } from "@/features/court-filter";
import { buildCatalogQuery } from "@/features/court-filter/lib/parse-catalog-search-params";

interface CourtCatalogHeroSearchProps {
  filters: CourtFilters;
}

function HeroSearchField({
  filters,
  onApply,
  isPending,
}: {
  filters: CourtFilters;
  onApply: (search: string) => void;
  isPending: boolean;
}) {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  return (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Назва або район..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onApply(searchDraft);
            }
          }}
          className="h-12 rounded-full border-0 bg-white pl-12 text-base shadow-sm"
        />
      </div>
      <Button
        type="button"
        disabled={isPending}
        className="h-12 gap-2 rounded-full px-6 text-base"
        onClick={() => onApply(searchDraft)}
      >
        <Search className="size-4" />
        Знайти
      </Button>
    </>
  );
}

export function CourtCatalogHeroSearch({ filters }: CourtCatalogHeroSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const applySearch = (search: string) => {
    const nextFilters = { ...filters, search };

    startTransition(() => {
      router.push(`${pathname}${buildCatalogQuery(nextFilters, 1)}`);
    });
  };

  return (
    <div
      key={filters.search}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <HeroSearchField
        filters={filters}
        onApply={applySearch}
        isPending={isPending}
      />
    </div>
  );
}
