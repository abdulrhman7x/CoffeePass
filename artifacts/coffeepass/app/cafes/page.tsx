import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CAFES } from "@/lib/data";
import { Eyebrow } from "@/components/Banner";

export const metadata: Metadata = { title: "Partner cafés" };

export default async function Cafes() {
  const { lang, t } = await getT();
  const c = t.cafes;
  const num = (n: number) => n.toLocaleString(lang === "ar" ? "ar-KW" : "en", { minimumIntegerDigits: 2 });
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="rise grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl"><Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-4xl leading-tight text-roast sm:text-5xl">{c.title}</h1>
          <p className="mt-4 text-bean/75">{c.lede}</p>
        </div>
        <p className="font-display text-7xl text-clay">{num(CAFES.length)}<span className="ms-2 text-base text-bean">{c.count}</span></p>
      </div>
      <ol className="mt-12 border-t border-roast/80">
        {CAFES.map((cafe, i) => (
          <li key={cafe.id} className="rise group border-b border-bean/15" style={{ animationDelay: `${0.05 * i}s` }}>
            <div className="flex items-center gap-5 py-5 transition-[padding] duration-300 group-hover:ps-3 sm:py-7">
              <span className="w-8 font-mono text-sm text-bean/50">{num(i + 1)}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-3xl text-roast transition-colors group-hover:text-clay sm:text-5xl">{cafe[lang]}</p>
                <p className="mt-1 text-sm text-bean/50" lang={lang === "ar" ? "en" : "ar"}>{lang === "ar" ? cafe.en : cafe.ar}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2 rounded-full bg-mint/25 px-3 py-1.5 text-xs font-medium text-mintdeep"><span className="h-1.5 w-1.5 rounded-full bg-mintdeep" />{c.accepted}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
