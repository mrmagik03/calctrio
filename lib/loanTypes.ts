export type LoanType = "car" | "boat" | "rv";

export type LoanTheme = {
  label: string;
  routeBase: string;
  heroTitle: string;
  heroDescription: string;
  backgroundClassName: string;
  accentClassName: string;
};

export const LOAN_TYPES: Record<LoanType, LoanTheme> = {
  car: {
    label: "Car",
    routeBase: "/car-payment",
    heroTitle: "Car payment calculator",
    heroDescription:
      "Estimate monthly car payments based on loan amount, interest rate, and loan term.",
    backgroundClassName:
      "bg-[linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.85)),url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000')] bg-cover bg-center",
    accentClassName: "",
  },

  boat: {
    label: "Boat",
    routeBase: "/boat-payment",
    heroTitle: "Boat payment calculator",
    heroDescription:
      "Estimate monthly boat payments with a marine-style calculator.",
    backgroundClassName:
      "bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85)),url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2000')] bg-cover bg-center",
    accentClassName: "",
  },

  rv: {
    label: "RV",
    routeBase: "/rv-payment",
    heroTitle: "RV payment calculator",
    heroDescription:
      "Estimate monthly RV payments for road trips and long-term travel.",
    backgroundClassName:
      "bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000')] bg-cover bg-center",
    accentClassName: "",
  },
};

export function getLoanTheme(type: string): LoanTheme | null {
  if (type === "car") return LOAN_TYPES.car;
  if (type === "boat") return LOAN_TYPES.boat;
  if (type === "rv") return LOAN_TYPES.rv;
  return null;
}
