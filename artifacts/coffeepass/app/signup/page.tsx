import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/AuthPage";
import { getAuthenticatedUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.auth.signupEyebrow };
}

export default async function SignupPage() {
  const [{ t }, user] = await Promise.all([
    getT(),
    getAuthenticatedUser().catch(() => null),
  ]);
  if (user) redirect("/account");

  return (
    <AuthPage
      mode="signup"
      copy={t.auth}
      brand={t.brand}
      tagline={t.home.title.join(" ")}
    />
  );
}
