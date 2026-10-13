import type { Dict } from "@/lib/dict";
import { AuthForm } from "./AuthForm";
import { CupMark } from "./Wordmark";

export function AuthPage({
  mode,
  copy,
  brand,
  tagline,
}: {
  mode: "signup" | "login";
  copy: Dict["auth"];
  brand: string;
  tagline: string;
}) {
  const isSignup = mode === "signup";
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="grid overflow-hidden rounded-[32px] bg-roast shadow-[0_30px_60px_-40px_rgb(43_26_18/.55)] md:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative flex min-h-56 flex-col justify-between overflow-hidden p-7 text-cream sm:p-9 md:min-h-[560px] md:p-10">
          <div
            className="pointer-events-none absolute -end-20 -top-16 h-64 w-64 rounded-full border border-cream/10"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-mint" aria-hidden="true">
              <CupMark className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-semibold">{brand}</span>
          </div>
          <div className="relative mt-10 max-w-sm">
            <p className="text-sm leading-relaxed text-cream/70">{tagline}</p>
            <p className="mt-6 text-xs leading-relaxed text-cream/55">{copy.demoNote}</p>
          </div>
          <span className="absolute bottom-8 end-8 hidden text-mint/80 md:block" aria-hidden="true">
            <CupMark className="h-20 w-20" />
          </span>
        </aside>
        <section className="bg-paper p-6 sm:p-10 md:px-12 md:py-14">
          <p className="text-sm font-semibold text-clay">
            {isSignup ? copy.signupEyebrow : copy.loginEyebrow}
          </p>
          <h1 className="font-display mt-3 max-w-lg text-3xl leading-tight text-roast sm:text-4xl">
            {isSignup ? copy.signupTitle : copy.loginTitle}
          </h1>
          <div className="mt-8">
            <AuthForm mode={mode} copy={copy} />
          </div>
        </section>
      </div>
    </div>
  );
}
