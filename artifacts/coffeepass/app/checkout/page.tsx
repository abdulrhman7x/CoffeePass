import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { PLANS, type PlanId } from "@/lib/data";
import { CheckoutClient } from "@/components/CheckoutClient";
import { DemoBanner, Eyebrow } from "@/components/Banner";

export const metadata: Metadata = { title: "Demo checkout" };

export default async function Checkout() {
  const { lang, t: full } = await getT();
  const { rollover: _r, ...t } = full; void _r;
  const names = Object.fromEntries(PLANS.map((p) => [p.id, t.plans[p.id].name])) as Record<PlanId, string>;
  const numberFormat = new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW");
  const rollovers = Object.fromEntries(PLANS.map((p) => [p.id, p.rollover ? full.rollover(numberFormat.format(p.rollover)) : t.noRollover])) as Record<PlanId, string>;
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
      <div className="rise"><Eyebrow>{t.checkout.eyebrow}</Eyebrow>
        <h1 className="font-display mt-3 text-4xl text-roast sm:text-5xl">{t.checkout.title}</h1>
      </div>
      <div className="rise d1 mt-6"><DemoBanner label={t.demo} text={t.checkout.banner} /></div>
        <div className="rise d2 mt-8"><CheckoutClient t={t} names={names} rollovers={rollovers} locale={lang === "ar" ? "ar-KW" : "en-KW"} /></div>
    </div>
  );
}
