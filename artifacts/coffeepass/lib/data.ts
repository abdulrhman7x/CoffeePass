export type PlanId = "basic" | "plus" | "premium";
export const PLAN_IDS: readonly PlanId[] = ["basic", "plus", "premium"];
export const isPlanId = (value: unknown): value is PlanId =>
  typeof value === "string" && PLAN_IDS.includes(value as PlanId);

export type Plan = {
  id: PlanId;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  cups: number;
  price: number;
  rollover: number;
  image: string;
};
export const perCup = (p: Plan) => (p.price / p.cups).toFixed(3);

export type Cafe = {
  id: string;
  en: string;
  ar: string;
  description: { en: string; ar: string };
};
export const CAFES: Cafe[] = [
  {
    id: "caribou",
    en: "Caribou",
    ar: "كاريبو",
    description: {
      en: "A quick, familiar pause before the day gets busy.",
      ar: "استراحة قهوة سريعة قبل أن ينشغل يومك.",
    },
  },
  {
    id: "starbucks",
    en: "Starbucks",
    ar: "ستاربكس",
    description: {
      en: "An easy meet-up point between errands and plans.",
      ar: "موعد قهوة بسيط بين مشاويرك وخططك.",
    },
  },
  {
    id: "tobys",
    en: "Toby\u2019s Estate",
    ar: "توبيز إستيت",
    description: {
      en: "A slower coffee break for afternoons that can wait.",
      ar: "استراحة هادئة لعصر يسمح لك بالتأنّي.",
    },
  },
  {
    id: "arabica",
    en: "% Arabica",
    ar: "% أرابيكا",
    description: {
      en: "A short pause while you explore another part of town.",
      ar: "توقّف قصير وأنت تستكشف جهة جديدة من المدينة.",
    },
  },
  {
    id: "coffeebean",
    en: "Coffee Bean",
    ar: "كوفي بين",
    description: {
      en: "A coffee or tea break to share with a friend.",
      ar: "قهوة أو شاي لمحادثة خفيفة مع صديق.",
    },
  },
  {
    id: "costa",
    en: "Costa Coffee",
    ar: "كوستا كوفي",
    description: {
      en: "A familiar cup for the drive between stops.",
      ar: "كوب مألوف في طريقك بين المشاوير.",
    },
  },
  {
    id: "hornet",
    en: "Hornet",
    ar: "هورنت",
    description: {
      en: "A new name to add to your next café wander.",
      ar: "اسم جديد تضيفه لجولتك القادمة بين المقاهي.",
    },
  },
  {
    id: "barton",
    en: "Barton",
    ar: "بارتون",
    description: {
      en: "A calm coffee pause in the middle of a full day.",
      ar: "استراحة هادئة وسط يوم مليء بالمهام.",
    },
  },
  {
    id: "ananas",
    en: "Ananas",
    ar: "أناناس",
    description: {
      en: "A different stop to try on your next outing.",
      ar: "وجهة مختلفة لتجربها في زيارتك القادمة.",
    },
  },
  {
    id: "pick",
    en: "Pick",
    ar: "بيك",
    description: {
      en: "A quick pick-me-up while you\u2019re on the move.",
      ar: "جرعة نشاط سريعة أثناء تنقّلك.",
    },
  },
];
