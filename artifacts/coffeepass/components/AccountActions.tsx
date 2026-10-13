"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dict } from "@/lib/dict";

export function AccountActions({ copy }: { copy: Dict["auth"] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function logOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/login");
      router.refresh();
    } catch {
      setError(copy.logoutFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={logOut}
        disabled={pending}
        className="min-h-11 rounded-full border border-bean/20 px-5 text-sm font-semibold text-roast transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? copy.loggingOut : copy.logout}
      </button>
      {error ? (
        <p role="status" aria-live="polite" className="text-sm text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
