"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { CupMark } from "./Wordmark";

type Item = { href: string; label: string };
const ICONS: Record<string, string> = {
  "/": "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  "/memberships": "M4 6h16v12H4zM4 10h16",
  "/cafes": "M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  "/checkout": "M5 7h14l-1.5 11h-11zM9 7a3 3 0 0 1 6 0",
  "/pass": "M4 5h16v14H4zM8 9h3v3H8zM13 9h3M13 12h3M8 15h8",
};

export function Nav({ items, brand, langSwitch, langLabel, next }: { items: Item[]; brand: string; langSwitch: string; langLabel: string; next: "en" | "ar" }) {
  const path = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();
  const switchLang = () => {
    document.cookie = `cp_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    start(() => router.refresh());
  };
  const isOn = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bean/10 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2 text-roast">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-roast text-mint"><CupMark className="h-5 w-5" /></span>
            <span className="font-display text-xl font-semibold tracking-tight">{brand}</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full bg-sand/70 p-1">
              {items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} aria-current={isOn(it.href) ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-sm transition-colors ${isOn(it.href) ? "bg-roast text-cream" : "text-bean hover:bg-paper"}`}>
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button onClick={switchLang} aria-label={langLabel} disabled={pending}
            className="rounded-full border border-bean/25 px-4 py-2 text-sm font-semibold text-roast transition hover:bg-roast hover:text-cream disabled:opacity-50">
            {langSwitch}
          </button>
        </div>
      </header>
      <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-bean/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {items.map((it) => {
            const on = isOn(it.href);
            return (
              <li key={it.href}>
                <Link href={it.href} aria-current={on ? "page" : undefined}
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
