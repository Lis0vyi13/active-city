"use client";

import {
  Activity,
  Check,
  Filter,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CourtAmenity } from "@/entities/court";
import {
  SPORT_TYPE_LABELS,
  SPORT_TYPES,
  type SportType,
} from "@/shared/config/sport-types";
import type { BudgetFilter, CourtFilters } from "../model/types";

interface CourtFiltersPanelProps {
  filters: CourtFilters;
  onChange: (filters: CourtFilters) => void;
}

const AMENITY_OPTIONS: { value: CourtAmenity; label: string }[] = [
  { value: "lighting", label: "Освітлення" },
  { value: "changing_rooms", label: "Роздягальні" },
  { value: "shower", label: "Душ" },
  { value: "indoor", label: "Крите приміщення" },
];

const BUDGET_OPTIONS: { value: BudgetFilter; label: string }[] = [
  { value: "up_to_400", label: "До 400 ₴" },
  { value: "up_to_500", label: "До 500 ₴" },
  { value: "from_600", label: "Від 600 ₴" },
];

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeVariant?: "primary" | "navy";
}

function FilterPill({
  active,
  onClick,
  children,
  activeVariant = "primary",
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? activeVariant === "primary"
            ? "bg-primary text-primary-foreground"
            : "bg-navy text-navy-foreground"
          : "bg-muted/60 text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

interface FilterGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function FilterGroup({ icon, label, children }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function CourtFiltersPanel({
  filters,
  onChange,
}: CourtFiltersPanelProps) {
  const update = (patch: Partial<CourtFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border/40 sm:p-6">
      <div className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
        <Filter className="size-4 text-primary" />
        Фільтри
      </div>

      <div className="space-y-5">
        <FilterGroup
          icon={<Activity className="size-4 text-muted-foreground" />}
          label="Вид спорту"
        >
          <FilterPill
            active={filters.sportType === "all"}
            onClick={() => update({ sportType: "all" })}
          >
            Всі
          </FilterPill>
          {SPORT_TYPES.map((type) => (
            <FilterPill
              key={type}
              active={filters.sportType === type}
              onClick={() => update({ sportType: type as SportType })}
            >
              {SPORT_TYPE_LABELS[type]}
            </FilterPill>
          ))}
        </FilterGroup>

        <div className="border-t border-border/60 pt-5">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <FilterGroup
              icon={<Check className="size-4 text-muted-foreground" />}
              label="Зручності"
            >
              <FilterPill
                active={filters.amenity === "all"}
                activeVariant="navy"
                onClick={() => update({ amenity: "all" })}
              >
                Всі
              </FilterPill>
              {AMENITY_OPTIONS.map((option) => (
                <FilterPill
                  key={option.value}
                  active={filters.amenity === option.value}
                  activeVariant="navy"
                  onClick={() => update({ amenity: option.value })}
                >
                  {option.label}
                </FilterPill>
              ))}
            </FilterGroup>

            <FilterGroup
              icon={<Wallet className="size-4 text-muted-foreground" />}
              label="Бюджет за годину"
            >
              <FilterPill
                active={filters.budget === "any"}
                activeVariant="navy"
                onClick={() => update({ budget: "any" })}
              >
                Будь-яка
              </FilterPill>
              {BUDGET_OPTIONS.map((option) => (
                <FilterPill
                  key={option.value}
                  active={filters.budget === option.value}
                  activeVariant="navy"
                  onClick={() => update({ budget: option.value })}
                >
                  {option.label}
                </FilterPill>
              ))}
            </FilterGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
