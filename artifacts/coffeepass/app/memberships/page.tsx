import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { PLANS, type PlanId } from "@/lib/data";
import { PlanPicker } from "@/components/PlanPicker";
import { Eyebrow } from "@/components/Banner";

export const metadata: Metadata = { title: "Memberships" };

export default async function Memberships() {
  const { lang, t } = await getT();
  const m = t.memberships;
  const locale = lang === "ar" ? "ar-KW" : "en-KW";
  const numberFormat = new Intl.NumberFormat(locale);
  const pricePerCupFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const rollovers = Object.fromEntries(PLANS.map((p) => [p.id, p.rollover ? t.rollover(numberFormat.format(p.rollover)) : t.noRollover])) as Record<PlanId, string>;
  const formattedPlans = PLANS.map((p) => ({
    ...p,
    cupsLabel: numberFormat.format(p.cups),
    priceLabel: numberFormat.format(p.price),
    per: pricePerCupFormat.format(p.price / p.cups),
  }));
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="rise max-w-2xl"><Eyebrow>{m.eyebrow}</Eyebrow>
        <h1 className="font-display mt-3 text-4xl leading-tight text-roast sm:text-5xl">{m.title}</h1>
        <p className="mt-4 text-bean/75">{m.lede}</p>
      </div>
      <div className="rise d2 mt-12">
        <PlanPicker plans={formattedPlans}
          l={{ names: t.plans, select: m.select, selected: m.selected, popular: m.popular, continue: m.continue, kwd: t.kwd, cups: t.cups, perMonth: t.perMonth, perCup: t.perCup, rollovers, savedNote: m.savedNote }} />
      </div>
      <section className="mt-20">
        <h2 className="font-display text-3xl text-roast">{m.compareTitle}</h2>
        <div className="mt-6 overflow-x-auto rounded-[24px] ring-1 ring-bean/10">
          <table className="w-full min-w-[520px] bg-paper text-sm">
            <caption className="sr-only">{m.compareTitle}</caption>
            <thead><tr className="bg-sand/70 text-roast"><th className="p-4 text-start font-medium" scope="col"><span className="sr-only">{m.compareTitle}</span></th>{PLANS.map((p) => <th key={p.id} scope="col" className="p-4 text-start font-display text-lg">{t.plans[p.id].name}</th>)}</tr></thead>
            <tbody className="divide-y divide-bean/10">
              {[
                PLANS.map((p) => numberFormat.format(p.cups)),
                PLANS.map((p) => `${numberFormat.format(p.price)} ${t.kwd}`),
                PLANS.map((p) => `${pricePerCupFormat.format(p.price / p.cups)} ${t.kwd}`),
                PLANS.map((p) => (p.rollover ? m.upTo4 : m.none)),
                PLANS.map(() => m.all10),
              ].map((cells, i) => (
                <tr key={i}><th scope="row" className="p-4 text-start font-normal text-bean/70">{m.rows[i]}</th>{cells.map((c, j) => <td key={j} className="p-4 tabular-nums text-roast">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
