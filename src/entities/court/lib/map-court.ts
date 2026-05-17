import { SPORT_TYPES, type SportType } from "@/shared/config/sport-types";
import type { CourtRow } from "../model/database";
import type { Court, CourtAmenity } from "../model/types";

const AMENITIES: CourtAmenity[] = [
  "lighting",
  "changing_rooms",
  "shower",
  "indoor",
  "stands",
];

function isSportType(value: string): value is SportType {
  return SPORT_TYPES.includes(value as SportType);
}

function isAmenity(value: string): value is CourtAmenity {
  return AMENITIES.includes(value as CourtAmenity);
}

export function mapCourtRow(row: CourtRow): Court {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    location: {
      address: row.address,
      city: row.city,
      district: row.district ?? undefined,
      lat: row.lat,
      lng: row.lng,
    },
    sportType: isSportType(row.sport_type) ? row.sport_type : "football",
    pricePerHour: row.price_per_hour,
    images: row.images,
    amenities: row.amenities.filter(isAmenity),
    isAvailable: row.is_available,
    ownerId: row.owner_id,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    createdAt: row.created_at,
  };
}
