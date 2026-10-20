import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getCafeDemoDashboard, getCafePortalAccess } from "@/lib/cafe-portal";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.cafePortal.title };
}

export default async function CafePortalPage() {
  const [{ lang, t }, userResult] = await Promise.all([
    getT(),
    getAuthenticatedUser().then(
      (user) => ({ user, failed: false as const }),
      () => ({ user: null, failed: true as const }),
    ),
  ]);
  const c = t.cafePortal;

  if (userResult.failed) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p role="alert" className="rounded-2xl bg-paper p-5 text-bean">
          {c.unavailable}
        </p>
      </div>
    );
  }
  if (!userResult.user) redirect("/login");

  let access;
  try {
    access = await getCafePortalAccess(userResult.user.id);
  } catch {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p role="alert" className="rounded-2xl bg-paper p-5 text-bean">
          {c.unavailable}
        </p>
      </div>
    );
  }
  if (!access) notFound();

  let dashboard;
  try {
    dashboard = await getCafeDemoDashboard(access.cafeSlug);
  } catch {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p role="alert" className="rounded-2xl bg-paper p-5 text-bean">
          {c.unavailable}
        </p>
      </div>
    );
  }

  const locale = lang === "ar" ? "ar-KW" : "en-KW";
  const number = new Intl.NumberFormat(locale);
  const money = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kuwait",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 pb-12 md:py-14">
      <header className="grid gap-7 border-b border-bean/15 pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-clay">{c.eyebrow}</p>
          <h1 className="font-display mt-2 text-4xl leading-tight text-roast sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-bean/75">{c.intro}</p>
        </div>
        <div className="rounded-[28px] bg-roast px-6 py-5 text-cream sm:min-w-64 sm:px-8">
          <p className="text-sm text-cream/70">{c.estimatedEarnings}</p>
          <p className="font-display mt-2 text-4xl tabular-nums" dir="ltr">
            {money.format(dashboard.estimatedEarningsFils / 1000)}
            <span className="ms-2 text-base text-cream/70">{t.kwd}</span>
          </p>
        </div>
      </header>

      <aside className="mt-6 flex flex-col gap-1 rounded-2xl border border-clay/25 bg-clay/5 px-4 py-3 text-sm text-bean sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-clay">{c.demoBadge}</span>
        <span>{c.disclaimer}</span>
      </aside>

      <section aria-label={c.summary} className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-[24px] bg-paper p-5 ring-1 ring-bean/10 sm:p-6">
          <p className="text-sm text-bean/65">{c.redemptionCount}</p>
          <p className="font-display mt-2 text-4xl tabular-nums text-roast">
            {number.format(dashboard.redemptionCount)}
          </p>
        </article>
        <article className="rounded-[24px] bg-sand/65 p-5 ring-1 ring-bean/10 sm:p-6">
          <p className="text-sm text-bean/65">{c.cupCount}</p>
          <p className="font-display mt-2 text-4xl tabular-nums text-roast">
            {number.format(dashboard.cupCount)}
          </p>
        </article>
      </section>

      <section className="mt-9" aria-labelledby="cafe-demo-history">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-bean/15 pb-3">
          <h2 id="cafe-demo-history" className="font-display text-2xl text-roast">
            {c.history}
          </h2>
          <span className="rounded-full bg-mint/25 px-3 py-1 text-xs font-semibold text-mintdeep">
            {c.demoBadge}
          </span>
        </div>

        {dashboard.transactions.length === 0 ? (
          <p className="py-8 text-sm text-bean/65">{c.noTransactions}</p>
        ) : (
          <>
            <div className="hidden grid-cols-[1.4fr_1fr_.65fr_.9fr] gap-5 py-3 text-xs text-bean/55 sm:grid">
              <span>{c.activity}</span>
              <span>{c.recordType}</span>
              <span>{c.cups}</span>
              <span>{c.estimatedEarnings}</span>
            </div>
            <ul className="divide-y divide-bean/10">
              {dashboard.transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="grid gap-3 py-4 sm:grid-cols-[1.4fr_1fr_.65fr_.9fr] sm:items-center sm:gap-5"
                >
                  <div>
                    <p className="font-medium text-roast">
                      {lang === "ar" ? transaction.labelAr : transaction.label}
                    </p>
                    <p className="mt-1 text-xs text-bean/55">
                      {date.format(new Date(transaction.occurredAt))}
                    </p>
                  </div>
                  <p className="text-sm text-bean/70">
                    <span className="sm:hidden">{c.recordType}: </span>
                    <span className="font-medium text-clay">{c.demoBadge}</span>
                  </p>
                  <p className="text-sm text-bean/70">
                    <span className="sm:hidden">{c.cups}: </span>
                    {number.format(transaction.cups)}
                  </p>
                  <p className="text-sm font-semibold text-roast" dir="ltr">
                    <span className="me-1 font-normal text-bean/60 sm:hidden">
                      {c.estimatedEarnings}:
                    </span>
                    {money.format(transaction.estimatedEarningsFils / 1000)} {t.kwd}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
