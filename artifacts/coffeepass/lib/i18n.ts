import { cookies } from "next/headers";
import { dict, type Lang } from "./dict";

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  return c.get("cp_lang")?.value === "ar" ? "ar" : "en";
}
export async function getT() {
  const lang = await getLang();
  return { lang, t: dict[lang] };
}
