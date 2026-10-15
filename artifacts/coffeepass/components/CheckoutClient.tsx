"use client";
import Link from "next/link";
import { useState } from "react";
import type { Plan, PlanId } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import type { Dict } from "@/lib/dict";

export function CheckoutClient({ t, plans, names, rollovers, locale, isAuthenticated }: { t: Omit<Dict, "rollover">; plans: Plan[]; names: Record<PlanId, string>; rollovers: Record<PlanId, string>; locale: string; isAuthenticated: boolean }) {
  const { state } = useDemo();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const plan = plans.find((product) => product.id === state.plan);
  const c = t.checkout;
  const numberFormat = new Intl.NumberFormat(locale);
  const moneyFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  if (!plan) {
    return (
      <div className="rounded-[28px] border-2 border-dashed border-bean/20 p-10 text-center">
        <p className="font-display text-2xl text-roast">{c.empty}</p>
        <Link href="/memberships" data-testid="link-empty-checkout-memberships" className="mt-6 inline-block rounded-full bg-roast px-6 py-3 text-sm font-semibold text-cream">{c.emptyCta}</Link>
      </div>
    );
  }
  const rows: [string, string][] = [
    [c.plan, names[plan.id]],
    [c.monthly, `${numberFormat.format(plan.cups)} ${t.cups}`],
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
          <span className="font-display text-4xl tabular-nums text-roast">{moneyFormat.format(plan.price)} <span className="text-base">{t.kwd}</span></span>
        </div>
        <div className="mt-6" aria-live="polite">
          {!isAuthenticated ? (
            <div className="space-y-3">
              <p className="rounded-2xl bg-paper px-4 py-3 text-sm text-bean">{c.loginRequired}</p>
              <Link href="/login" data-testid="link-checkout-login" className="block rounded-full bg-roast py-4 text-center font-semibold text-cream transition hover:bg-bean">{c.loginToContinue}</Link>
            </div>
          ) : (
            <>
              {error ? <p role="alert" className="mb-3 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-900">{error}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  data-testid="button-stripe-checkout"
                  disabled={pending}
                  onClick={async () => {
                    setPending(true);
                    setError("");
                    try {
                      const response = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ planId: plan.id }),
                      });
                      const result = await response.json() as { url?: string; error?: string };
                      if (!response.ok || !result.url) {
                        setError(result.error === "UNAUTHENTICATED" ? c.loginRequired : c.requestFailed);
                        return;
                      }
                      window.location.assign(result.url);
                    } catch {
                      setError(c.requestFailed);
                    } finally {
                      setPending(false);
                    }
                  }}
                  className="flex-1 rounded-full bg-clay py-4 font-semibold text-cream transition hover:bg-bean disabled:cursor-wait disabled:opacity-60"
                >
                  {pending ? c.processing : c.pay}
                </button>
                <Link href="/memberships" data-testid="link-change-membership" className="rounded-full border border-bean/25 px-6 py-4 text-center text-sm text-bean">{c.change}</Link>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-bean/60">{c.terms}</p>
      </div>
    </div>
  );
}
