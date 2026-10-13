"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-store";
import type { Lang } from "@/lib/dict";
import { LanguageMenu } from "./LanguageMenu";
import { CupMark } from "./Wordmark";

type Item = { href: string; label: string };
type Labels = {
  cart: string;
  cartSelected: string;
  profile: string;
  languageMenu: string;
  languages: { en: string; ar: string };
};
const ICONS: Record<string, string> = {
  "/": "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  "/memberships": "M4 6h16v12H4zM4 10h16",
  "/cafes": "M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  "/checkout": "M5 7h14l-1.5 11h-11zM9 7a3 3 0 0 1 6 0",
  "/pass": "M4 5h16v14H4zM8 9h3v3H8zM13 9h3M13 12h3M8 15h8",
};

export function Nav({
  items,
  brand,
  lang,
  primaryLabel,
  mobileLabel,
  labels,
}: {
  items: Item[];
  brand: string;
  lang: Lang;
  primaryLabel: string;
  mobileLabel: string;
  labels: Labels;
}) {
  const path = usePathname();
  const { state } = useDemo();
  const desktopItems = items.filter((item) => item.href !== "/pass");
  const brandWords = brand.trim().split(/\s+/);
  const brandMain = brandWords.slice(0, -1).join(" ");
  const brandAccent = brandWords[brandWords.length - 1] ?? brand;
  const isOn = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bean/10 bg-cream/85 backdrop-blur-md">
        <div dir="ltr" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Link href="/" data-testid="link-brand-home" className="flex shrink-0 items-center gap-2 text-roast">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-roast text-cream shadow-sm ring-1 ring-mint/60">
              <CupMark className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              {brandMain ? <>{brandMain} </> : null}<span className="text-clay">{brandAccent}</span>
            </span>
          </Link>
          <nav aria-label={primaryLabel} className="hidden min-w-0 md:block">
            <ul className="flex items-center gap-1 rounded-full bg-sand/70 p-1">
              {desktopItems.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} aria-current={isOn(it.href) ? "page" : undefined} data-testid={`link-nav-${it.href === "/" ? "home" : it.href.slice(1)}`}
                    className={`block rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay ${isOn(it.href) ? "bg-roast text-cream" : "text-bean hover:bg-paper"}`}>
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/checkout"
              data-testid="link-cart-checkout"
              aria-label={state.plan ? labels.cartSelected : labels.cart}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-bean/20 bg-paper text-roast transition-colors hover:border-clay/50 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {state.plan ? (
                <span aria-hidden="true" className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold leading-none text-white">
                  {Number(1).toLocaleString(lang === "ar" ? "ar-KW" : "en")}
                </span>
              ) : null}
            </Link>
            <Link
              href="/pass"
              data-testid="link-nav-profile"
              aria-label={labels.profile}
              className="grid h-10 w-10 place-items-center rounded-full border border-bean/20 bg-paper text-roast transition-colors hover:border-clay/50 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
              </svg>
            </Link>
            <LanguageMenu
              lang={lang}
              labels={{ menu: labels.languageMenu, languages: labels.languages }}
            />
          </div>
        </div>
      </header>
      <nav aria-label={mobileLabel} className="fixed inset-x-0 bottom-0 z-40 border-t border-bean/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {items.map((it) => {
            const on = isOn(it.href);
            return (
              <li key={it.href}>
                <Link href={it.href} aria-current={on ? "page" : undefined} data-testid={`link-mobile-nav-${it.href === "/" ? "home" : it.href.slice(1)}`}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${on ? "text-clay" : "text-bean/70"}`}>
                  <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${on ? "-translate-y-0.5" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[it.href]} /></svg>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
