"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Plan, PlanId } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { StampRow } from "./StampRow";

type Labels = {
  names: Record<PlanId, { name: string; line: string }>;
  select: string;
  selected: string;
  popular: string;
  planChoices: string;
  confirmHeading: string;
  confirm: string;
  cancel: string;
  kwd: string;
  cups: string;
  perMonth: string;
  perCup: string;
  rollovers: Record<PlanId, string>;
  savedNote: string;
};

export function PlanPicker({ plans, l }: { plans: (Plan & { per: string; cupsLabel: string; priceLabel: string })[]; l: Labels }) {
  const { state, update } = useDemo();
  const router = useRouter();
  const [confirming, setConfirming] = useState<PlanId | null>(null);
  const [pending, startTransition] = useTransition();
  const confirmingPlan = plans.find((plan) => plan.id === confirming);

  const selectPlan = (planId: PlanId) => {
    update((current) => ({ ...current, plan: planId }));
    setConfirming(planId);
  };

  const continueToCheckout = () => {
    if (!confirmingPlan) return;
    startTransition(() => router.push("/checkout"));
  };

  return (
    <div>
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="sr-only">{l.planChoices}</legend>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => {
            const on = state.plan === p.id;
            const pop = p.id === "plus";
            return (
              <button
                key={p.id}
                type="button"
                data-testid={`button-plan-${p.id}`}
                aria-pressed={on}
                onClick={() => selectPlan(p.id)}
                className={`lift relative flex flex-col gap-3 rounded-[24px] p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                  on ? "bg-roast text-cream ring-2 ring-clay" : pop ? "bg-paper ring-1 ring-bean/15" : "bg-sand/60 ring-1 ring-bean/10"
                }`}
              >
                {pop ? <span className="absolute -top-3 start-6 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-roast">{l.popular}</span> : null}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl">{l.names[p.id].name}</h3>
                  <span className={`text-sm ${on ? "text-cream/70" : "text-bean/60"}`}>{p.cupsLabel} {l.cups}</span>
                </div>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-4xl tabular-nums">{p.priceLabel}</span>
                  <span className="text-sm">{l.kwd} {l.perMonth}</span>
                </p>
                <StampRow total={p.cups} filled={on ? p.cups : 0} size="sm" animateFrom={on ? 0 : -1} />
                <p className={on ? "text-sm text-cream/80" : "text-sm text-bean/80"}>{l.names[p.id].line}</p>
                <ul className={`space-y-1 text-sm ${on ? "text-cream/70" : "text-bean/70"}`}>
                  <li>{p.per} {l.kwd} {l.perCup}</li>
                  <li>{l.rollovers[p.id]}</li>
                </ul>
                <span className={`mt-auto rounded-full py-2.5 text-center text-sm font-semibold ${on ? "bg-clay text-cream" : "bg-roast/90 text-cream"}`}>
                  {on ? l.selected : l.select}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {confirmingPlan ? (
        <section
          data-testid="plan-confirmation"
          aria-live="polite"
          aria-atomic="true"
          className="rise mt-6 flex flex-col gap-4 rounded-[26px] bg-paper p-5 ring-1 ring-bean/10 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{l.confirmHeading}</p>
            <p className="mt-1 font-display text-2xl text-roast">
              {l.names[confirmingPlan.id].name}
              <span className="ms-2 font-sans text-base font-medium text-bean/75" dir="ltr">
                {confirmingPlan.priceLabel} {l.kwd} {l.perMonth}
              </span>
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              data-testid="button-cancel-plan-confirmation"
              onClick={() => setConfirming(null)}
              className="min-h-11 rounded-full px-5 text-sm font-semibold text-bean transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              {l.cancel}
            </button>
            <button
              type="button"
              data-testid="button-confirm-plan"
              onClick={continueToCheckout}
              disabled={pending}
              className="min-h-11 rounded-full bg-clay px-6 text-sm font-semibold text-white transition-colors hover:bg-bean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              {l.confirm}
            </button>
          </div>
        </section>
      ) : null}

      <div className="mt-4 flex justify-center">
        <p className="text-xs text-bean/60">{l.savedNote}</p>
      </div>
    </div>
  );
}
