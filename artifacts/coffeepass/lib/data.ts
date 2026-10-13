export type PlanId = "basic" | "plus" | "premium";
export type Plan = { id: PlanId; cups: number; price: number; rollover: number };
export const PLANS: Plan[] = [
  { id: "basic", cups: 5, price: 7, rollover: 0 },
  { id: "plus", cups: 10, price: 13, rollover: 4 },
  { id: "premium", cups: 20, price: 24, rollover: 0 },
];
export const getPlan = (id: string | null | undefined) => PLANS.find((p) => p.id === id);
export const perCup = (p: Plan) => (p.price / p.cups).toFixed(3);

export type Cafe = { id: string; en: string; ar: string };
export const CAFES: Cafe[] = [
  { id: "caribou", en: "Caribou", ar: "كاريبو" },
  { id: "starbucks", en: "Starbucks", ar: "ستاربكس" },
  { id: "tobys", en: "Toby\u2019s Estate", ar: "توبيز إستيت" },
  { id: "arabica", en: "% Arabica", ar: "% أرابيكا" },
  { id: "coffeebean", en: "Coffee Bean", ar: "كوفي بين" },
  { id: "costa", en: "Costa Coffee", ar: "كوستا كوفي" },
  { id: "hornet", en: "Hornet", ar: "هورنت" },
  { id: "barton", en: "Barton", ar: "بارتون" },
  { id: "ananas", en: "Ananas", ar: "أناناس" },
  { id: "pick", en: "Pick", ar: "بيك" },
];
