//REF: https://github.com/custom-cards/custom-card-helpers/blob/master/src/datetime/relative_time.ts
//REF: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/relative_time.ts

import { selectUnit } from "@formatjs/intl-utils";

// REF: https://github.com/custom-cards/custom-card-helpers/blob/master/src/types.ts
// REF: https://github.com/home-assistant/frontend/blob/dev/src/data/translation.ts
enum NumberFormat {
    language = "language",
    system = "system",
    comma_decimal = "comma_decimal",
    decimal_comma = "decimal_comma",
    space_comma = "space_comma",
    none = "none",
}

export enum TimeFormat {
    language = "language",
    system = "system",
    am_pm = "12",
    twenty_four = "24",
}

interface MinBarFrontendLocaleData {
    language: string;
}

 const formatRelTimeMem =
  (locale: MinBarFrontendLocaleData) =>
    new Intl.RelativeTimeFormat(locale.language, { numeric: "auto" });

/**
 * Calculate a string representing a date object as relative time from now.
 *
 * Example output: 5 minutes ago, in 3 days.
 */
 export const relativeTime = (
  from: Date,
  locale: MinBarFrontendLocaleData,
  to?: Date,
  includeTense = true
): string => {
  const diff = selectUnit(from, to);
  if (includeTense) {
    return formatRelTimeMem(locale).format(diff.value, diff.unit);
  }
  return Intl.NumberFormat(locale.language, {
    style: "unit",
    unit: diff.unit,
    unitDisplay: "long",
  }).format(Math.abs(diff.value));
};
