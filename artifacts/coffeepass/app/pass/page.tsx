import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CAFES, PLANS, type PlanId } from "@/lib/data";
import { PassClient } from "@/components/PassClient";
import { DemoBanner, Eyebrow } from "@/components/Banner";

export const metadata: Metadata = { title: "My Pass (demo)" };

export default async function Pass() {
  const { lang, t: full } = await getT();
  const { rollover: _r, ...t } = full; void _r;
  const names = Object.fromEntries(PLANS.map((p) => [p.id, t.plans[p.id].name])) as Record<PlanId, string>;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="rise"><Eyebrow>{t.pass.eyebrow}</Eyebrow></div>
      <div className="rise d1 mt-4 max-w-3xl"><DemoBanner label={t.demo} text={t.pass.banner} /></div>
      <div className="mt-8"><PassClient t={t} lang={lang} names={names} cafes={CAFES} /></div>
    </div>
  );
}
