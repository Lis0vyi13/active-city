import type { CourtAmenity } from "@/entities/court";
import { SPORT_TYPES, type SportType } from "@/shared/config/sport-types";

import {
  DEFAULT_FILTERS,
  type BudgetFilter,
  type CourtFilters,
} from "../model/types";

const BUDGET_VALUES: BudgetFilter[] = [
  "any",
  "up_to_400",
  "up_to_500",
  "from_600",
];

const AMENITY_VALUES: (CourtAmenity | "all")[] = [
  "all",
  "lighting",
  "changing_rooms",
  "shower",
  "indoor",
  "stands",
];

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

export function parseCatalogSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): { filters: CourtFilters; page: number } {
  const sport = readParam(searchParams, "sport");
  const amenity = readParam(searchParams, "amenity");
  const budget = readParam(searchParams, "budget");
  const pageRaw = readParam(searchParams, "page");

  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);

  const filters: CourtFilters = {
    search: readParam(searchParams, "q") ?? "",
    sportType:
      sport && SPORT_TYPES.includes(sport as SportType)
        ? (sport as SportType)
        : "all",
    amenity:
      amenity && AMENITY_VALUES.includes(amenity as CourtAmenity | "all")
        ? (amenity as CourtAmenity | "all")
        : "all",
    budget:
      budget && BUDGET_VALUES.includes(budget as BudgetFilter)
        ? (budget as BudgetFilter)
        : "any",
  };

  return { filters, page };
}

export function buildCatalogQuery(
  filters: CourtFilters,
  page: number
): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("q", filters.search.trim());
  }

  if (filters.sportType !== "all") {
    params.set("sport", filters.sportType);
  }

  if (filters.amenity !== "all") {
    params.set("amenity", filters.amenity);
  }

  if (filters.budget !== "any") {
    params.set("budget", filters.budget);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export { DEFAULT_FILTERS };
