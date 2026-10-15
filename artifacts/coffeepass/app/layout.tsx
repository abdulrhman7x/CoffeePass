import type { Metadata } from "next";
import { Fraunces, Outfit, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Nav } from "@/components/Nav";
import { getAuthenticatedUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz", "SOFT"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-arabic" });

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getT();
  return {
    title: {
      default: lang === "ar" ? "كوفي باس · الكويت" : "CoffeePass · Kuwait",
      template: `%s · ${t.brand}`,
    },
    description: lang === "ar"
      ? "نموذج دراسي ثنائي اللغة لفكرة اشتراك القهوة في الكويت. الدفع عبر Stripe Sandbox فقط، واستبدال الأكواب تجريبي."
      : "A bilingual course demo for a Kuwait coffee membership concept. Checkout uses Stripe Sandbox; café redemptions remain demo-only.",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ lang, t }, user] = await Promise.all([
    getT(),
    getAuthenticatedUser().catch(() => null),
  ]);
  const items = (["/", "/memberships", "/cafes", "/checkout", "/pass"] as const).map((href, i) => ({
    href, label: [t.nav.home, t.nav.memberships, t.nav.cafes, t.nav.checkout, t.nav.pass][i],
  }));
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={`${fraunces.variable} ${outfit.variable} ${arabic.variable}`}>
      <body className="antialiased">
        <Nav
          items={items}
          brand={t.brand}
          lang={lang}
          primaryLabel={t.primaryNav}
          mobileLabel={t.mobileNav}
          userName={user?.name ?? null}
          labels={{
            cart: t.nav.cart,
            cartSelected: t.nav.cartSelected,
            profile: t.nav.account,
            languageMenu: t.languageMenu,
            languages: t.languages,
          }}
        />
        <main className="pb-24 md:pb-0">{children}</main>
        <footer className="border-t border-bean/10 px-5 pb-28 pt-10 md:pb-10">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 text-sm text-bean/60 sm:flex-row">
            <p>{t.brand} · {t.footer.tag}</p>
            <p>{t.footer.credit}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
