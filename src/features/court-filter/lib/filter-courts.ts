import type { Court } from "@/entities/court";
import type { CourtFilters } from "../model/types";

function matchesBudget(price: number, budget: CourtFilters["budget"]): boolean {
  switch (budget) {
    case "up_to_400":
      return price <= 400;
    case "up_to_500":
      return price <= 500;
    case "from_600":
      return price >= 600;
    default:
      return true;
  }
}

export function filterCourts(courts: Court[], filters: CourtFilters): Court[] {
  const query = filters.search.trim().toLowerCase();

  return courts.filter((court) => {
    if (filters.sportType !== "all" && court.sportType !== filters.sportType) {
      return false;
    }

    if (
      filters.amenity !== "all" &&
      !court.amenities.includes(filters.amenity)
    ) {
      return false;
    }

    if (!matchesBudget(court.pricePerHour, filters.budget)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      court.name,
      court.description,
      court.location.address,
      court.location.city,
      court.location.district,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
