"use client";
import Link from "next/link";
import type { Plan, PlanId } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { StampRow } from "./StampRow";

type Labels = { names: Record<PlanId, { name: string; line: string }>; select: string; selected: string; popular: string; continue: string; kwd: string; cups: string; perMonth: string; perCup: string; rollovers: Record<PlanId, string>; savedNote: string };

export function PlanPicker({ plans, l }: { plans: (Plan & { per: string; cupsLabel: string; priceLabel: string })[]; l: Labels }) {
  const { state, update } = useDemo();
  return (
    <div>
      <div role="radiogroup" className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => {
          const on = state.plan === p.id;
          const pop = p.id === "plus";
          return (
              <button key={p.id} type="button" data-testid={`button-plan-${p.id}`} aria-pressed={on} onClick={() => update((s) => ({ ...s, plan: p.id }))}
              className={`lift relative flex flex-col gap-5 rounded-[28px] p-6 text-start transition-colors ${on ? "bg-roast text-cream ring-2 ring-clay" : pop ? "bg-paper ring-1 ring-bean/15" : "bg-sand/60 ring-1 ring-bean/10"}`}>
              {pop ? <span className="absolute -top-3 start-6 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-roast">{l.popular}</span> : null}
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-3xl">{l.names[p.id].name}</h3>
                <span className={`text-sm ${on ? "text-cream/70" : "text-bean/60"}`}>{p.cupsLabel} {l.cups}</span>
              </div>
              <p className="flex items-baseline gap-2"><span className="font-display text-5xl tabular-nums">{p.priceLabel}</span><span className="text-sm">{l.kwd} {l.perMonth}</span></p>
              <StampRow total={p.cups} filled={on ? p.cups : 0} size="sm" animateFrom={on ? 0 : -1} />
              <p className={on ? "text-cream/80" : "text-bean/80"}>{l.names[p.id].line}</p>
              <ul className={`space-y-1 text-sm ${on ? "text-cream/70" : "text-bean/70"}`}>
                <li>{p.per} {l.kwd} {l.perCup}</li>
                <li>{l.rollovers[p.id]}</li>
              </ul>
              <span className={`mt-auto rounded-full py-3 text-center text-sm font-semibold ${on ? "bg-clay text-cream" : "bg-roast/90 text-cream"}`}>{on ? l.selected : l.select}</span>
            </button>
          );
        })}
      </div>
      <div className={`mt-8 flex flex-col items-center gap-2 transition-opacity ${state.plan ? "opacity-100" : "opacity-40"}`}>
        {state.plan ? (
          <Link href="/checkout" data-testid="link-continue-checkout" className="rounded-full bg-clay px-8 py-4 font-semibold text-cream transition hover:bg-bean">{l.continue}</Link>
        ) : (
          <button type="button" disabled data-testid="button-continue-checkout-disabled" className="cursor-not-allowed rounded-full bg-clay px-8 py-4 font-semibold text-cream opacity-60">{l.continue}</button>
        )}
        <p className="text-xs text-bean/60">{l.savedNote}</p>
      </div>
    </div>
  );
}
