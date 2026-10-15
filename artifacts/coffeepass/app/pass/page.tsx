import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CAFES, type PlanId } from "@/lib/data";
import { getMembershipCatalog } from "@/lib/products";
import { PassClient, type PaidPassOrder } from "@/components/PassClient";
import { DemoBanner, Eyebrow } from "@/components/Banner";
import { ProductsUnavailable } from "@/components/ProductsUnavailable";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.pass.eyebrow };
}

export default async function Pass() {
  const [{ lang, t: full }, catalog, user] = await Promise.all([
    getT(),
    getMembershipCatalog(),
    getAuthenticatedUser(),
  ]);
  const { rollover: _r, ...t } = full; void _r;
  const plans = catalog.available ? catalog.plans : [];
  const names = Object.fromEntries(plans.map((p) => [p.id, lang === "ar" ? p.nameAr : p.name])) as Record<PlanId, string>;
  let purchases: PaidPassOrder[] = [];

  if (user) {
    await connectDB();
    const orders = await Order.find({ user: user.id, status: "paid" })
      .select("createdAt paidAt total items.productName items.productNameAr items.quantity")
      .sort({ paidAt: -1, createdAt: -1 })
      .lean()
      .exec();

    purchases = orders.map((order) => ({
      id: order._id.toString(),
      purchasedAt: (order.paidAt ?? order.createdAt).toISOString(),
      total: order.total,
      items: order.items.map((item: { productName?: string; productNameAr?: string; quantity: number }) => ({
        name: lang === "ar"
          ? item.productNameAr || item.productName || t.pass.membership
          : item.productName || item.productNameAr || t.pass.membership,
        quantity: item.quantity,
      })),
    }));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="rise"><Eyebrow>{t.pass.eyebrow}</Eyebrow></div>
      {purchases.length === 0 ? (
        <div className="rise d1 mt-4 max-w-3xl"><DemoBanner label={t.demo} text={t.pass.banner} /></div>
      ) : null}
      <div className="mt-8">
        {catalog.available || purchases.length > 0
          ? <PassClient t={t} lang={lang} names={names} plans={plans} cafes={CAFES} purchases={purchases} />
          : <ProductsUnavailable message={t.catalogUnavailable} />}
      </div>
    </div>
  );
}
