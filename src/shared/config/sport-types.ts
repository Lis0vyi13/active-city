export const SPORT_TYPES = [
  "football",
  "basketball",
  "tennis",
  "volleyball",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

export const SPORT_TYPE_LABELS: Record<SportType, string> = {
  football: "Футбол",
  basketball: "Баскетбол",
  tennis: "Теніс",
  volleyball: "Волейбол",
};

export const SPORT_TYPE_ICONS: Record<SportType, string> = {
  football: "⚽",
  basketball: "🏀",
  tennis: "🎾",
  volleyball: "🏐",
};
