import Image from "next/image";
import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CAFES } from "@/lib/data";
import { Eyebrow } from "@/components/Banner";
import { CupMark } from "@/components/Wordmark";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getT();
  return {
    title: lang === "ar" ? "المقاهي المختارة" : "Featured cafés",
    description: t.cafes.lede,
  };
}

const cardColors = ["bg-paper", "bg-sand/55", "bg-mint/20"] as const;

export default async function Cafes() {
  const { lang, t } = await getT();
  const c = t.cafes;
  const num = (n: number) => n.toLocaleString(lang === "ar" ? "ar-KW" : "en", { minimumIntegerDigits: 2 });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <header className="rise grid gap-8 md:grid-cols-[1.05fr_.95fr] md:items-center">
        <div className="max-w-2xl">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-4xl leading-tight text-roast sm:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-xl text-bean/75">{c.lede}</p>
          <p className="mt-6 inline-flex items-baseline gap-2">
            <span className="font-display text-5xl tabular-nums text-clay">{num(CAFES.length)}</span>
            <span className="text-sm font-medium text-bean">{c.count}</span>
          </p>
        </div>

        <figure className="relative min-h-[230px] overflow-hidden rounded-[30px] bg-sand sm:min-h-[270px]">
          <Image
            src="/images/coffee-hero-v2.jpg"
            alt={c.imageAlt}
            fill
            loading="eager"
            sizes="(min-width: 768px) 44vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-roast/50 via-transparent to-transparent" />
          <figcaption className="absolute bottom-4 start-4 rounded-full border border-white/40 bg-paper/90 px-4 py-2 text-xs font-semibold text-roast shadow-sm backdrop-blur">
            {c.moment}
          </figcaption>
        </figure>
      </header>

      <ol aria-label={c.count} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAFES.map((cafe, i) => (
          <li key={cafe.id} className="min-w-0">
            <article
              aria-labelledby={`cafe-${cafe.id}`}
              className={`lift rise flex h-full min-h-56 flex-col rounded-[24px] p-5 ring-1 ring-bean/10 ${cardColors[i % cardColors.length]}`}
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-bean/55">{num(i + 1)}</span>
                <span className="rounded-full bg-cream/75 px-3 py-1 text-[11px] font-medium text-bean/75">{c.featured}</span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-roast text-cream ring-1 ring-mint/50">
                  <CupMark className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h2 id={`cafe-${cafe.id}`} className="font-display truncate text-2xl text-roast" lang={lang}>
                    {cafe[lang]}
                  </h2>
                  <p className="truncate text-xs text-bean/55" lang={lang === "ar" ? "en" : "ar"} dir={lang === "ar" ? "ltr" : "rtl"}>
                    {lang === "ar" ? cafe.en : cafe.ar}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-bean/80">{cafe.description[lang]}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
