export type AccentTheme = {
  accentRgb: string;
  accentAltRgb: string;
  accentSoftRgb: string;
};

const DEFAULT_THEME: AccentTheme = {
  accentRgb: "96 165 250",
  accentAltRgb: "168 85 247",
  accentSoftRgb: "59 130 246",
};

const STATE_THEME_MAP: Record<string, AccentTheme> = {
  arizona: { accentRgb: "249 115 22", accentAltRgb: "245 158 11", accentSoftRgb: "234 88 12" },
  california: { accentRgb: "59 130 246", accentAltRgb: "99 102 241", accentSoftRgb: "14 165 233" },
  colorado: { accentRgb: "220 38 38", accentAltRgb: "37 99 235", accentSoftRgb: "147 51 234" },
  florida: { accentRgb: "14 165 233", accentAltRgb: "34 197 94", accentSoftRgb: "59 130 246" },
  georgia: { accentRgb: "239 68 68", accentAltRgb: "249 115 22", accentSoftRgb: "190 24 93" },
  illinois: { accentRgb: "37 99 235", accentAltRgb: "239 68 68", accentSoftRgb: "29 78 216" },
  massachusetts: { accentRgb: "99 102 241", accentAltRgb: "59 130 246", accentSoftRgb: "67 56 202" },
  michigan: { accentRgb: "14 116 144", accentAltRgb: "59 130 246", accentSoftRgb: "37 99 235" },
  "new-jersey": { accentRgb: "245 158 11", accentAltRgb: "59 130 246", accentSoftRgb: "249 115 22" },
  "new-york": { accentRgb: "59 130 246", accentAltRgb: "245 158 11", accentSoftRgb: "14 165 233" },
  "north-carolina": { accentRgb: "56 189 248", accentAltRgb: "37 99 235", accentSoftRgb: "59 130 246" },
  ohio: { accentRgb: "220 38 38", accentAltRgb: "59 130 246", accentSoftRgb: "239 68 68" },
  pennsylvania: { accentRgb: "29 78 216", accentAltRgb: "220 38 38", accentSoftRgb: "59 130 246" },
  texas: { accentRgb: "59 130 246", accentAltRgb: "220 38 38", accentSoftRgb: "147 51 234" },
  virginia: { accentRgb: "14 116 144", accentAltRgb: "245 158 11", accentSoftRgb: "37 99 235" },
  washington: { accentRgb: "34 197 94", accentAltRgb: "16 185 129", accentSoftRgb: "14 165 233" },
};

export function getThemeByStateSlug(slug?: string): AccentTheme {
  if (!slug) {
    return DEFAULT_THEME;
  }

  return STATE_THEME_MAP[slug] ?? DEFAULT_THEME;
}

export function themeToCssVars(theme: AccentTheme): Record<string, string> {
  return {
    "--accent-rgb": theme.accentRgb,
    "--accent-alt-rgb": theme.accentAltRgb,
    "--accent-soft-rgb": theme.accentSoftRgb,
  };
}
