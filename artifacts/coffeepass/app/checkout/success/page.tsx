import type { Metadata } from "next";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getT } from "@/lib/i18n";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.checkout.success.eyebrow };
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const [{ lang, t }, user, params] = await Promise.all([
    getT(),
    getAuthenticatedUser(),
    searchParams,
  ]);
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : null;

  let order:
    | {
        status: string;
        total: number;
        items: { productName?: string; productNameAr?: string }[];
      }
    | null = null;
  if (user && sessionId) {
    try {
      await connectDB();
      order = await Order.findOne({
        user: user.id,
        stripeCheckoutSessionId: sessionId,
      })
        .select("status total items.productName items.productNameAr")
        .lean()
        .exec();
    } catch {
      order = null;
    }
  }

  const copy = t.checkout.success;
  const paid = order?.status === "paid";
  const title = !user || !order
    ? copy.unavailableTitle
    : paid
      ? copy.paidTitle
      : copy.pendingTitle;
  const amount = order
    ? new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(order.total)
    : null;
  const productName =
    lang === "ar"
      ? order?.items[0]?.productNameAr
      : order?.items[0]?.productName;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
      <div className="rise overflow-hidden rounded-[28px] bg-paper shadow-[0_30px_60px_-40px_rgb(43_26_18/.5)] ring-1 ring-bean/10">
        <div className="h-3.5 bg-mint" />
        <div className="p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-clay">{copy.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl text-roast sm:text-5xl">{title}</h1>
          <p className="mt-5 rounded-2xl bg-mint/25 px-5 py-4 text-sm leading-7 text-mintdeep" aria-live="polite">
            {!user || !order ? copy.unavailable : paid ? copy.paid : copy.pending}
          </p>
          {user && order ? (
            <dl className="mt-6 divide-y divide-bean/10 rounded-2xl border border-bean/10 px-4">
              {productName ? (
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-bean/70">{copy.plan}</dt>
                  <dd className="text-end font-medium text-roast">{productName}</dd>
                </div>
              ) : null}
              {amount ? (
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-bean/70">{copy.total}</dt>
                  <dd className="font-medium text-roast">{amount} {t.kwd}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-bean/70">{copy.status}</dt>
                <dd className="font-medium text-roast">{paid ? copy.confirmed : copy.confirming}</dd>
              </div>
            </dl>
          ) : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/memberships" className="flex-1 rounded-full bg-roast px-6 py-4 text-center font-semibold text-cream transition hover:bg-bean">{copy.memberships}</Link>
            <Link href={user ? "/account" : "/login"} className="rounded-full border border-bean/25 px-6 py-4 text-center text-sm text-bean">{copy.account}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
