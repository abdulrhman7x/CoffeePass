import Image from "next/image";
import Link from "next/link";
import { getT } from "@/lib/i18n";
import { CAFES } from "@/lib/data";
import { getMembershipCatalog } from "@/lib/products";
import { StampRow } from "@/components/StampRow";
import { Eyebrow } from "@/components/Banner";
import { BaristaDemo } from "@/components/BaristaDemo";
import { CupMark } from "@/components/Wordmark";
import { ProductsUnavailable } from "@/components/ProductsUnavailable";

export default async function Home() {
  const { lang, t } = await getT();
  const h = t.home;
  const catalog = await getMembershipCatalog();
  const plans = catalog.available ? catalog.plans : [];
  const numberFormat = new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW");
  const perCupFormat = new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const plusPlan = plans.find((plan) => plan.id === "plus");
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-16">
        <div>
          <div className="rise"><Eyebrow>{h.eyebrow}</Eyebrow></div>
          <h1 className="font-display mt-4 text-5xl leading-[1.02] tracking-tight text-roast sm:text-6xl lg:text-7xl">
            {h.title.map((line, i) => <span key={i} className={`rise d${i + 1} block ${i === 2 ? "text-clay italic" : ""}`}>{line}</span>)}
          </h1>
          <p className="rise d3 mt-6 max-w-md text-lg text-bean/80">{h.lede}</p>
          <div className="rise d4 mt-8 flex flex-wrap gap-3">
            <Link href="/memberships" data-testid="link-home-memberships" className="rounded-full bg-roast px-7 py-4 font-semibold text-cream transition hover:bg-clay">{h.ctaPrimary}</Link>
            <Link href="/cafes" data-testid="link-home-cafes" className="rounded-full border border-bean/25 px-7 py-4 font-semibold text-roast transition hover:bg-sand">{h.ctaSecondary}</Link>
          </div>
        </div>
        <div className="rise d2 relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] rounded-ss-[140px]">
            <Image src="/images/coffee-hero-v2.jpg" alt={h.heroAlt} fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 start-4 end-4 rounded-3xl bg-paper/95 p-4 shadow-[0_24px_50px_-30px_rgb(43_26_18/.6)] backdrop-blur sm:end-auto sm:w-80">
            {plusPlan ? (
              <>
                <div className="flex justify-between text-sm"><span className="font-semibold text-roast">{lang === "ar" ? plusPlan.nameAr : plusPlan.name}</span><span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-medium text-bean">{h.samplePass}</span></div>
                <p className="mt-1 flex flex-wrap items-center justify-end gap-1 text-xs text-bean/60" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <span dir="ltr">{numberFormat.format(plusPlan.price)} {t.kwd} {t.perMonth}</span>
                  <span aria-hidden="true">·</span>
                  <span>{numberFormat.format(plusPlan.cups)} {t.cups}</span>
                </p>
                <div className="mt-2"><StampRow total={plusPlan.cups} filled={3} size="sm" /></div>
              </>
            ) : <ProductsUnavailable message={t.catalogUnavailable} />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl text-roast sm:text-4xl">{h.howTitle}</h2>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-[28px] bg-bean/10 md:grid-cols-3">
          {h.how.map(([title, body], i) => (
            <li key={i} className="bg-cream p-6 md:p-8">
              <span className="font-display text-5xl text-clay/80">{(i + 1).toLocaleString(lang === "ar" ? "ar-KW" : "en")}</span>
              <h3 className="mt-4 text-lg font-semibold text-roast">{title}</h3>
              <p className="mt-1 text-bean/75">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 rounded-[32px] bg-sand p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <Eyebrow>{h.aiEyebrow}</Eyebrow>
            <h2 className="font-display mt-3 text-3xl leading-tight text-roast sm:text-4xl">{h.aiTitle}</h2>
            <p className="mt-3 text-bean/75">{h.aiLede}</p>
            <BaristaDemo buttonLabel={h.aiButton} notice={h.aiNotice} suggestions={h.aiSuggestions} />
          </div>
          <div className="hidden h-40 w-40 items-center justify-center rounded-full bg-paper text-clay md:flex" aria-hidden="true">
            <CupMark className="h-20 w-20" />
          </div>
        </div>
      </section>

      <section className="bg-roast py-20 text-cream">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mint">CoffeePass</p>
            <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">{h.daysTitle}</h2>
            <p className="mt-4 text-cream/70">{h.daysLede}</p>
          </div>
          <ol className="relative mt-12 border-s border-cream/15">
            {h.days.map(([time, title, body], i) => (
              <li key={i} className="group relative grid gap-2 py-6 ps-8 sm:grid-cols-[120px_1fr_1.4fr] sm:items-baseline sm:gap-8">
                <span className="absolute -start-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-clay bg-roast transition-colors group-hover:bg-clay" />
                <span className="font-mono text-sm text-mint" dir="ltr">{time}</span>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="text-cream/70">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 border-t border-cream/15 pt-9">
            <h3 className="font-display text-2xl text-cream sm:text-3xl">{h.audienceTitle}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {h.audiences.map(([title, body], i) => (
                <li key={title} className="rounded-2xl border border-cream/10 bg-cream/5 p-4">
                  <span className="font-mono text-xs tabular-nums text-mint">{(i + 1).toLocaleString(lang === "ar" ? "ar-KW" : "en")}</span>
                  <h4 className="mt-3 font-semibold text-cream">{title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-cream/65">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-roast sm:text-4xl">{h.cafesTitle}</h2>
          <Link href="/cafes" data-testid="link-home-all-cafes" className="text-sm font-semibold text-clay underline underline-offset-4">{h.cafesLink}</Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-bean/65">{h.cafesNote}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-display text-2xl text-bean sm:text-4xl">
          {CAFES.map((c, i) => <li key={c.id} className="flex items-center gap-6">{c[lang]}{i < CAFES.length - 1 ? <span className="h-2 w-2 rounded-full bg-clay/60" aria-hidden="true" /> : null}</li>)}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="font-display text-3xl text-roast sm:text-4xl">{h.valueTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[28px] bg-sand p-8">
            <h3 className="font-display text-3xl text-roast">{h.value[0][0]}</h3>
            <p className="mt-2 text-bean/75">{h.value[0][1]}</p>
            <div className="mt-6 space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-bean">{lang === "ar" ? p.nameAr : p.name}</span>
                  <span className="h-2 rounded-full bg-clay" style={{ width: `${(p.price / p.cups / 1.4) * 70}%` }} />
                  <span className="tabular-nums text-bean/70">{perCupFormat.format(p.price / p.cups)}</span>
                </div>
              ))}
              {!catalog.available ? <ProductsUnavailable message={t.catalogUnavailable} /> : null}
            </div>
          </div>
          <div className="grid gap-4">
            {h.value.slice(1).map(([a, b]) => (
              <div key={a} className="rounded-[28px] bg-paper p-6 ring-1 ring-bean/10"><h3 className="text-lg font-semibold text-roast">{a}</h3><p className="mt-1 text-bean/75">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[36px] bg-clay px-8 py-14 text-cream sm:px-14">
          <div className="absolute end-10 top-6 hidden flex-col gap-2 sm:flex" aria-hidden="true">
            {[0, 1, 2].map((i) => <span key={i} className="steam h-6 w-1.5 rounded-full bg-cream/40" style={{ animationDelay: `${i * 0.6}s` }} />)}
          </div>
          <h2 className="font-display max-w-xl text-4xl leading-tight sm:text-5xl">{h.closingTitle}</h2>
          <Link href="/memberships" data-testid="link-home-closing-cta" className="mt-8 inline-block rounded-full bg-cream px-7 py-4 font-semibold text-roast transition hover:bg-roast hover:text-cream">{h.closingCta}</Link>
        </div>
      </section>
    </>
  );
}
