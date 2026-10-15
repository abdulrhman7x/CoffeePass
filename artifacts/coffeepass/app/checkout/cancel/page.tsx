import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.checkout.cancel.eyebrow };
}

export default async function CheckoutCancelled() {
  const { t } = await getT();
  const copy = t.checkout.cancel;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
      <div className="rise overflow-hidden rounded-[28px] bg-paper shadow-[0_30px_60px_-40px_rgb(43_26_18/.5)] ring-1 ring-bean/10">
        <div className="h-3.5 bg-sand" />
        <div className="p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-clay">{copy.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl text-roast sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 leading-7 text-bean/80">{copy.body}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/checkout" className="flex-1 rounded-full bg-roast px-6 py-4 text-center font-semibold text-cream transition hover:bg-bean">{copy.retry}</Link>
            <Link href="/memberships" className="rounded-full border border-bean/25 px-6 py-4 text-center text-sm text-bean">{copy.memberships}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
