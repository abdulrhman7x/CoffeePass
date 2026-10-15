import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import type { PlanId } from "@/lib/data";
import { getMembershipCatalog } from "@/lib/products";
import { getAuthenticatedUser } from "@/lib/auth";
import { CheckoutClient } from "@/components/CheckoutClient";
import { DemoBanner, Eyebrow } from "@/components/Banner";
import { ProductsUnavailable } from "@/components/ProductsUnavailable";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.checkout.eyebrow };
}

export default async function Checkout() {
  const { lang, t: full } = await getT();
  const { rollover: _r, ...t } = full; void _r;
  const [catalog, user] = await Promise.all([
    getMembershipCatalog(),
    getAuthenticatedUser(),
  ]);
  const plans = catalog.available ? catalog.plans : [];
  const names = Object.fromEntries(plans.map((p) => [p.id, lang === "ar" ? p.nameAr : p.name])) as Record<PlanId, string>;
  const numberFormat = new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW");
  const rollovers = Object.fromEntries(plans.map((p) => [p.id, p.rollover ? full.rollover(numberFormat.format(p.rollover)) : t.noRollover])) as Record<PlanId, string>;
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
      <div className="rise"><Eyebrow>{t.checkout.eyebrow}</Eyebrow>
        <h1 className="font-display mt-3 text-4xl text-roast sm:text-5xl">{t.checkout.title}</h1>
      </div>
      <div className="rise d1 mt-6"><DemoBanner label={t.demo} text={t.checkout.banner} /></div>
      <div className="rise d2 mt-8">
        {catalog.available
          ? <CheckoutClient t={t} plans={plans} names={names} rollovers={rollovers} locale={lang === "ar" ? "ar-KW" : "en-KW"} isAuthenticated={Boolean(user)} />
          : <ProductsUnavailable message={t.catalogUnavailable} />}
      </div>
    </div>
  );
}
