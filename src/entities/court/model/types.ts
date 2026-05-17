import type { SportType } from "@/shared/config/sport-types";

export type CourtAmenity =
  | "lighting"
  | "changing_rooms"
  | "shower"
  | "indoor"
  | "stands";

export interface CourtLocation {
  address: string;
  city: string;
  district?: string;
  lat: number;
  lng: number;
}

export interface Court {
  id: string;
  name: string;
  description: string;
  location: CourtLocation;
  sportType: SportType;
  pricePerHour: number;
  images: string[];
  amenities: CourtAmenity[];
  isAvailable: boolean;
  ownerId: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
