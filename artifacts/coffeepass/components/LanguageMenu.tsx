"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/dict";

type Labels = {
  menu: string;
  languages: { en: string; ar: string };
};

export function LanguageMenu({ lang, labels }: { lang: Lang; labels: Labels }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const chooseLanguage = (next: Lang) => {
    setOpen(false);
    triggerRef.current?.focus();
    if (next === lang) return;

    document.cookie = `cp_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    startTransition(() => router.refresh());
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        data-testid="button-language-menu"
        aria-label={labels.menu}
        aria-expanded={open}
        aria-controls="language-menu-options"
        onClick={() => setOpen((value) => !value)}
        disabled={pending}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-bean/20 bg-paper px-3 text-sm font-semibold text-roast transition-colors hover:border-clay/50 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17M12 3c2.5 2.4 3.5 5.4 3.5 9s-1 6.6-3.5 9c-2.5-2.4-3.5-5.4-3.5-9S9.5 5.4 12 3Z" />
        </svg>
        <span aria-hidden="true">{lang === "ar" ? "ع" : "EN"}</span>
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-bean/60" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m2.5 4.5 3.5 3 3.5-3" />
        </svg>
      </button>

      <div
        id="language-menu-options"
        role="group"
        aria-label={labels.menu}
        className={`lang-popover absolute end-0 top-[calc(100%+0.5rem)] z-50 w-48 rounded-2xl border border-bean/10 bg-paper p-2 shadow-[0_18px_40px_-24px_rgb(43_26_18/.55)] ${open ? "" : "hidden"}`}
      >
        {(["en", "ar"] as const).map((option) => {
          const selected = lang === option;
          return (
            <button
              key={option}
              type="button"
              data-testid={`button-language-${option}`}
              aria-pressed={selected}
              onClick={() => chooseLanguage(option)}
              disabled={pending}
              className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                selected ? "bg-sand font-semibold text-roast" : "text-bean hover:bg-sand/60"
              }`}
            >
              <span lang={option} dir={option === "ar" ? "rtl" : "ltr"}>{labels.languages[option]}</span>
              {selected ? <span aria-hidden="true" className="text-clay">✓</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
