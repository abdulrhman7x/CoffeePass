import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountActions } from "@/components/AccountActions";
import { ProductsUnavailable } from "@/components/ProductsUnavailable";
import { getAuthenticatedUser } from "@/lib/auth";
import { getCafePortalAccess } from "@/lib/cafe-portal";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.auth.accountTitle };
}

export default async function AccountPage() {
  const [{ lang, t }, userResult] = await Promise.all([
    getT(),
    getAuthenticatedUser().then(
      (user) => ({ user, failed: false as const }),
      () => ({ user: null, failed: true as const }),
    ),
  ]);

  if (userResult.failed) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <ProductsUnavailable message={t.auth.accountUnavailable} />
      </div>
    );
  }
  if (!userResult.user) redirect("/login");

  const user = userResult.user;
  const hasCafePortalAccess = await getCafePortalAccess(user.id)
    .then(Boolean)
    .catch(() => false);
  const memberSince = new Intl.DateTimeFormat(
    lang === "ar" ? "ar-KW" : "en-KW",
    { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuwait" },
  ).format(new Date(user.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <div className="rise max-w-2xl">
        <p className="text-sm font-semibold text-clay">{t.auth.accountEyebrow}</p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-roast sm:text-5xl">
          {t.auth.accountTitle}
        </h1>
      </div>

      <section className="rise d1 mt-8 rounded-[30px] bg-paper p-6 ring-1 ring-bean/10 sm:p-9">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-bean/60">{t.auth.nameField}</dt>
            <dd className="mt-1 break-words font-medium text-roast">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-bean/60">{t.auth.emailField}</dt>
            <dd className="mt-1 break-all font-medium text-roast" dir="ltr">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-bean/60">{t.auth.memberSince}</dt>
            <dd className="mt-1 font-medium text-roast">{memberSince}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 border-t border-bean/10 pt-6 sm:flex-row sm:items-center">
          <Link
            href="/pass"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-roast px-5 text-sm font-semibold text-cream transition-colors hover:bg-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
          >
            {t.auth.myPass}
          </Link>
          <Link
            href="/memberships"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-bean/20 px-5 text-sm font-semibold text-roast transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            {t.auth.memberships}
          </Link>
          {hasCafePortalAccess ? (
            <Link
              href="/cafe-portal"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-bean/20 px-5 text-sm font-semibold text-roast transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              {t.auth.cafePortal}
            </Link>
          ) : null}
          <div className="sm:ms-auto">
            <AccountActions copy={t.auth} />
          </div>
        </div>
      </section>
    </div>
  );
}
