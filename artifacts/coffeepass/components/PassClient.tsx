"use client";
import Link from "next/link";
import type { Cafe, Plan, PlanId } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import type { Dict, Lang } from "@/lib/dict";
import { StampRow } from "./StampRow";
import { CupMark } from "./Wordmark";

function DemoCode() {
  // Deterministic decorative pattern, intentionally not a scannable code.
  const cells = Array.from({ length: 81 }, (_, i) => ((i * 37) % 11) % 3 === 0 || [0, 1, 9, 10, 7, 8, 16, 17, 63, 64, 72, 73].includes(i));
  return (
    <div className="relative grid h-28 w-28 grid-cols-9 gap-0.5 rounded-xl bg-cream p-2 opacity-80" aria-hidden="true">
      {cells.map((on, i) => <span key={i} className={on ? "bg-roast" : ""} />)}
      <span className="absolute inset-0 grid place-items-center"><span className="-rotate-12 rounded bg-clay px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cream">DEMO</span></span>
    </div>
  );
}

export function PassClient({ t, lang, names, plans, cafes }: { t: Omit<Dict, "rollover">; lang: Lang; names: Record<PlanId, string>; plans: Plan[]; cafes: Cafe[] }) {
  const { state, update, reset } = useDemo();
  const p = t.pass;
  const plan = plans.find((product) => product.id === state.plan);
  if (!plan || !state.active) {
    return (
      <div className="rounded-[28px] border-2 border-dashed border-bean/20 p-10 text-center">
        <p className="font-display text-2xl text-roast">{p.noPass}</p>
        <Link href={plan ? "/checkout" : "/memberships"} data-testid="link-demo-pass-next-step" className="mt-6 inline-block rounded-full bg-roast px-6 py-3 text-sm font-semibold text-cream">{plan ? t.checkout.confirm : p.noPassCta}</Link>
      </div>
    );
  }
  const used = Math.min(plan.cups, state.used);
  const left = Math.max(0, plan.cups - used);
  const numberFormat = new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW");
  const redeem = () => update((s) => {
    const cafe = cafes[(s.used * 3) % cafes.length];
    const timestamp = Math.max(Date.now(), (s.log[0]?.t ?? 0) + 1);
    return { ...s, used: Math.min(plan.cups, s.used + 1), log: [{ c: cafe.id, t: timestamp }, ...s.log].slice(0, 6) };
  });
  const fmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-KW" : "en-KW", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short", timeZone: "Asia/Kuwait" });
  const cafeName = (id: string) => { const c = cafes.find((x) => x.id === id); return c ? c[lang] : id; };
  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <article className="rise relative overflow-hidden rounded-[32px] bg-roast p-6 text-cream sm:p-8">
        <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-clay/30" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-cream/70"><CupMark className="h-4 w-4 text-mint" />{t.brand} · {names[plan.id]}</p>
            <p className="mt-6 text-xs uppercase tracking-widest text-cream/50">{p.balance}</p>
            <p className="font-display text-7xl tabular-nums leading-none" aria-live="polite" data-testid="text-pass-balance">{numberFormat.format(left)}<span className="ms-2 text-2xl text-cream/60">/ {numberFormat.format(plan.cups)}</span></p>
            <p className="mt-1 text-cream/70">{p.left}</p>
          </div>
          <DemoCode />
        </div>
        <div className="relative mt-8"><StampRow total={plan.cups} filled={used} animateFrom={used - 1} size={plan.cups > 10 ? "sm" : "md"} /></div>
        <dl className="relative mt-8 grid grid-cols-2 gap-4 border-t border-cream/15 pt-5 text-sm">
          <div><dt className="text-cream/50">{p.holder}</dt><dd>{p.guest}</dd></div>
          <div><dt className="text-cream/50">{p.status}</dt><dd className="flex items-center gap-2" data-testid="status-demo-pass"><span className="h-2 w-2 rounded-full bg-mint" />{p.active}</dd></div>
          <div><dt className="text-cream/50">{p.code}</dt><dd className="font-mono tracking-wider" dir="ltr">CP-DEMO-0000</dd></div>
          <div><dt className="text-cream/50">{p.used}</dt><dd className="tabular-nums">{numberFormat.format(used)}</dd></div>
        </dl>
      </article>
      <div className="flex flex-col gap-4">
        <div className="rounded-[28px] bg-paper p-6 ring-1 ring-bean/10">
          {left > 0 ? (
            <>
              <button type="button" data-testid="button-simulate-redemption" onClick={redeem} className="w-full rounded-full bg-clay py-4 font-semibold text-cream transition hover:bg-bean active:scale-[.98]">{p.redeem} <span className="ms-1 rounded bg-cream/20 px-1.5 text-xs">{t.demo}</span></button>
              <p className="mt-3 text-sm text-bean/70">{p.redeemNote}</p>
            </>
          ) : <p className="text-bean">{p.out}</p>}
        </div>
        <div className="rounded-[28px] bg-sand/60 p-6">
          <h2 className="font-display text-xl text-roast">{p.history}</h2>
          {state.log.length ? (
            <ul className="mt-3 divide-y divide-bean/10 text-sm">
              {state.log.map((e) => <li key={e.t} className="flex justify-between py-2.5"><span>{cafeName(e.c)} <span className="text-bean/50">({t.demo})</span></span><span className="text-bean/60">{fmt.format(e.t)}</span></li>)}
            </ul>
          ) : <p className="mt-3 text-sm text-bean/60">{p.noHistory}</p>}
        </div>
        <button type="button" data-testid="button-reset-demo-pass" onClick={reset} className="self-start text-sm text-bean/60 underline underline-offset-4 hover:text-clay">{p.reset}</button>
      </div>
    </div>
  );
}
