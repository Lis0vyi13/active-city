import { SearchX } from "lucide-react";

import { CourtCard, type Court } from "@/entities/court";
import {
  filterCourts,
  type CourtFilters,
} from "@/features/court-filter";
import {
  CATALOG_PAGE_SIZE,
  clampPage,
  getTotalPages,
  paginateItems,
} from "@/shared/lib/paginate";

import { CourtCatalogControls } from "./court-catalog-controls";
import { CourtCatalogHero } from "./court-catalog-hero";
import { CourtCatalogPagination } from "./court-catalog-pagination";

interface CourtCatalogProps {
  courts: Court[];
  filters: CourtFilters;
  page: number;
}

export function CourtCatalog({ courts, filters, page }: CourtCatalogProps) {
  const filteredCourts = filterCourts(courts, filters);
  const totalPages = getTotalPages(filteredCourts.length, CATALOG_PAGE_SIZE);
  const currentPage = clampPage(page, totalPages);
  const paginatedCourts = paginateItems(
    filteredCourts,
    currentPage,
    CATALOG_PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <CourtCatalogHero filters={filters} />
      <CourtCatalogControls filters={filters} />

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

            <CourtCatalogPagination
              filters={filters}
              page={currentPage}
              totalPages={totalPages}
              totalItems={filteredCourts.length}
              pageSize={CATALOG_PAGE_SIZE}
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
