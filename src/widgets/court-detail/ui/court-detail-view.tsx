import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Court } from "@/entities/court";
import { BookingPanel } from "@/features/court-booking";
import { AMENITY_LABELS } from "@/shared/config/amenities";
import { SPORT_TYPE_LABELS } from "@/shared/config/sport-types";

interface CourtDetailViewProps {
  court: Court;
}

function formatLocation(court: Court): string {
  if (court.location.district) {
    return `${court.location.district}, ${court.location.address}`;
  }

  return `${court.location.city}, ${court.location.address}`;
}

export function CourtDetailView({ court }: CourtDetailViewProps) {
  return (
    <div className="min-w-0 space-y-6">
      <Link
        href="/"
        className="inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 shrink-0" />
        <span className="truncate">Повернутися до каталогу</span>
      </Link>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <div className="relative aspect-16/10 w-full min-w-0 overflow-hidden rounded-2xl">
            <Image
              src={court.images[0]}
              alt={court.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>

          <div className="min-w-0 space-y-4">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {SPORT_TYPE_LABELS[court.sportType]}
            </span>

            <div className="min-w-0 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight wrap-break-word text-foreground sm:text-3xl lg:text-4xl">
                {court.name}
              </h1>
              <div className="flex min-w-0 items-start gap-1.5 text-sm text-muted-foreground sm:text-base">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0 wrap-break-word">{formatLocation(court)}</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-10 w-full gap-2 rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 sm:w-auto"
            >
              <MessageCircle className="size-4 shrink-0" />
              Написати власнику
            </Button>
          </div>

          <div className="min-w-0 border-t border-border/60 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Зручності на локації</h2>
            <div className="flex flex-wrap gap-2">
              {court.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium wrap-break-word text-foreground sm:px-4 sm:py-2"
                >
                  <Check className="size-3.5 shrink-0 text-primary" />
                  {AMENITY_LABELS[amenity]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 w-full lg:sticky lg:top-24 lg:self-start">
          <BookingPanel court={court} />
        </div>
      </div>
    </div>
  );
}
