import Image from "next/image";

import type { CourtFilters } from "@/features/court-filter";

import { CourtCatalogHeroSearch } from "./court-catalog-hero-search";

interface CourtCatalogHeroProps {
  filters: CourtFilters;
}

export function CourtCatalogHero({ filters }: CourtCatalogHeroProps) {
  return (
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

        <CourtCatalogHeroSearch filters={filters} />
      </div>
    </section>
  );
}
