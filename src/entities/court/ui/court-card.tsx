import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SPORT_TYPE_LABELS } from "@/shared/config/sport-types";
import type { Court } from "../model/types";

interface CourtCardProps {
  court: Court;
}

function formatLocation(court: Court): string {
  if (court.location.district) {
    return `${court.location.district}, ${court.location.address}`;
  }

  return `${court.location.city}, ${court.location.address}`;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Link href={`/courts/${court.id}`} className="group block h-full cursor-pointer">
      <Card className="h-full overflow-hidden border-0 bg-white p-0 shadow-sm ring-1 ring-border/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-primary/25">
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={court.images[0]}
            alt={court.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            {SPORT_TYPE_LABELS[court.sportType]}
          </span>
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium shadow-sm",
              court.isAvailable
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/80 text-white"
            )}
          >
            {court.isAvailable ? "• Вільний зараз" : "Зайнято"}
          </span>
        </div>

        <CardContent className="space-y-3 p-4">
          <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {court.name}
          </h3>

          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-2">{formatLocation(court)}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-primary">
              {court.pricePerHour} ₴/год
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-navy px-5 text-sm font-medium text-navy-foreground transition-colors group-hover:bg-navy/90">
              Бронювати
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
