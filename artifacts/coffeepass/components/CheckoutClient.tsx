"use client";
import Link from "next/link";
import { useState } from "react";
import { getPlan, type PlanId } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import type { Dict } from "@/lib/dict";

export function CheckoutClient({ t, names, rollovers }: { t: Omit<Dict, "rollover">; names: Record<PlanId, string>; rollovers: Record<PlanId, string> }) {
  const { state, update } = useDemo();
  const [done, setDone] = useState(false);
  const plan = getPlan(state.plan);
  const c = t.checkout;
  if (!plan) {
    return (
      <div className="rounded-[28px] border-2 border-dashed border-bean/20 p-10 text-center">
        <p className="font-display text-2xl text-roast">{c.empty}</p>
        <Link href="/memberships" className="mt-6 inline-block rounded-full bg-roast px-6 py-3 text-sm font-semibold text-cream">{c.emptyCta}</Link>
      </div>
    );
  }
  const rows: [string, string][] = [
    [c.plan, names[plan.id]],
    [c.monthly, `${plan.cups} ${t.cups}`],
    [c.rollover, rollovers[plan.id]],
  ];
  return (
    <div className="overflow-hidden rounded-[28px] bg-paper shadow-[0_30px_60px_-40px_rgb(43_26_18/.5)] ring-1 ring-bean/10">
      <dl className="divide-y divide-bean/10 px-6">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-4"><dt className="text-bean/70">{k}</dt><dd className="text-end font-medium text-roast">{v}</dd></div>
        ))}
      </dl>
      <div className="perf h-3.5 bg-sand" />
      <div className="bg-sand px-6 pb-6 pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-bean">{c.subtotal}</span>
          <span className="font-display text-4xl tabular-nums text-roast">{plan.price.toFixed(3)} <span className="text-base">{t.kwd}</span></span>
        </div>
        <div aria-live="polite">
          {done ? (
            <div className="mt-6 space-y-3">
              <p className="rounded-2xl bg-mint/30 px-4 py-3 text-sm text-mintdeep">{c.done}</p>
              <Link href="/pass" className="block rounded-full bg-roast py-4 text-center font-semibold text-cream">{c.viewPass}</Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { update((s) => ({ ...s, active: true, used: 0, log: [] })); setDone(true); }} className="flex-1 rounded-full bg-clay py-4 font-semibold text-cream transition hover:bg-bean">{c.confirm}</button>
              <Link href="/memberships" className="rounded-full border border-bean/25 px-6 py-4 text-center text-sm text-bean">{c.change}</Link>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-bean/60">{c.terms}</p>
      </div>
    </div>
  );
}
