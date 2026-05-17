"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourtCard, type Court } from "@/entities/court";
import {
  CourtFiltersPanel,
  DEFAULT_FILTERS,
  filterCourts,
  type CourtFilters,
} from "@/features/court-filter";
import {
  CATALOG_PAGE_SIZE,
  clampPage,
  getTotalPages,
  paginateItems,
} from "@/shared/lib/paginate";
import { Pagination } from "@/shared/ui/pagination";

interface CourtCatalogProps {
  courts: Court[];
}

export function CourtCatalog({ courts }: CourtCatalogProps) {
  const [filters, setFilters] = useState<CourtFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const filteredCourts = useMemo(
    () => filterCourts(courts, filters),
    [courts, filters]
  );

  const totalPages = getTotalPages(filteredCourts.length, CATALOG_PAGE_SIZE);
  const currentPage = clampPage(page, totalPages);

  const paginatedCourts = useMemo(
    () => paginateItems(filteredCourts, currentPage, CATALOG_PAGE_SIZE),
    [filteredCourts, currentPage]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const updateFilters = (patch: Partial<CourtFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-10 sm:px-10 sm:py-14">
        <Image
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1600&q=80"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 1216px"
        />
        <div className="absolute inset-0 bg-navy/80" />

        <div className="relative space-y-8">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Знайди ідеальний майданчик для своєї гри
            </h1>
            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              Бронюй найкращі спортивні локації міста в кілька кліків.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Назва або район..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="h-12 rounded-full border-0 bg-white pl-12 text-base shadow-sm"
              />
            </div>
            <Button className="h-12 gap-2 rounded-full px-6 text-base">
              <Search className="size-4" />
              Знайти
            </Button>
          </div>
        </div>
      </section>

      <CourtFiltersPanel filters={filters} onChange={setFilters} />

      <section className="space-y-6">
        {filteredCourts.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              Знайдено{" "}
              <span className="font-medium text-foreground">
                {filteredCourts.length}
              </span>{" "}
              {filteredCourts.length === 1
                ? "майданчик"
                : filteredCourts.length < 5
                  ? "майданчики"
                  : "майданчиків"}
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedCourts.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filteredCourts.length}
              pageSize={CATALOG_PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
            <SearchX className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">
              Майданчиків не знайдено
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Спробуйте змінити фільтри або скиньте пошук, щоб побачити більше
              варіантів.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
