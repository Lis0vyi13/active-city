import type { CourtAmenity } from "@/entities/court";
import type { SportType } from "@/shared/config/sport-types";

export type BudgetFilter = "any" | "up_to_400" | "up_to_500" | "from_600";

export interface CourtFilters {
  search: string;
  sportType: SportType | "all";
  amenity: CourtAmenity | "all";
  budget: BudgetFilter;
}

export const DEFAULT_FILTERS: CourtFilters = {
  search: "",
  sportType: "all",
  amenity: "all",
  budget: "any",
};
