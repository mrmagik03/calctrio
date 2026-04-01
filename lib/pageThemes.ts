import type { CSSProperties } from "react";

export type PageThemeType =
  | "salary-hourly"
  | "hourly-salary"
  | "salary-monthly"
  | "salary-biweekly"
  | "after-tax";

const PAGE_THEMES: Record<PageThemeType, CSSProperties> = {
  "salary-hourly": {
    "--accent-rgb": "96 165 250",
    "--accent-alt-rgb": "99 102 241",
    "--accent-soft-rgb": "56 189 248",
  } as CSSProperties,
  "hourly-salary": {
    "--accent-rgb": "14 165 233",
    "--accent-alt-rgb": "59 130 246",
    "--accent-soft-rgb": "6 182 212",
  } as CSSProperties,
  "salary-monthly": {
    "--accent-rgb": "129 140 248",
    "--accent-alt-rgb": "45 212 191",
    "--accent-soft-rgb": "99 102 241",
  } as CSSProperties,
  "salary-biweekly": {
    "--accent-rgb": "251 146 60",
    "--accent-alt-rgb": "244 63 94",
    "--accent-soft-rgb": "249 115 22",
  } as CSSProperties,
  "after-tax": {
    "--accent-rgb": "20 184 166",
    "--accent-alt-rgb": "59 130 246",
    "--accent-soft-rgb": "15 118 110",
  } as CSSProperties,
};

export const PAGE_IDENTITY_LABELS: Record<PageThemeType, string> = {
  "salary-hourly": "Salary to Hourly",
  "hourly-salary": "Hourly to Salary",
  "salary-monthly": "Salary to Monthly",
  "salary-biweekly": "Salary to Biweekly",
  "after-tax": "After-Tax by State",
};

export function getPageTheme(type: PageThemeType): CSSProperties {
  return PAGE_THEMES[type];
}
