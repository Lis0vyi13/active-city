export interface CourtRow {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string | null;
  lat: number;
  lng: number;
  sport_type: string;
  price_per_hour: number;
  images: string[];
  amenities: string[];
  is_available: boolean;
  owner_id: string;
  rating: number;
  review_count: number;
  created_at: string;
}
