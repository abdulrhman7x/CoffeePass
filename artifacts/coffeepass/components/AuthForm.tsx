"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import type { Dict } from "@/lib/dict";

type AuthMode = "signup" | "login";
type AuthCopy = Dict["auth"];
type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

export function AuthForm({ mode, copy }: { mode: AuthMode; copy: AuthCopy }) {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isSignup = mode === "signup";

  const validationMessages: Record<string, string> = {
    NAME_TOO_SHORT: copy.nameTooShort,
    NAME_TOO_LONG: copy.nameTooLong,
    EMAIL_INVALID: copy.emailInvalid,
    PASSWORD_TOO_SHORT: copy.passwordTooShort,
    PASSWORD_TOO_LONG: copy.passwordTooLong,
    PASSWORD_REQUIRED: copy.passwordRequired,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const payload = isSignup
      ? {
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }
      : {
          email: formData.get("email"),
          password: formData.get("password"),
        };

    setPending(true);
    setMessage("");
    setFieldErrors({});

    try {
      const response = await fetch(`/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { error?: string; fields?: Record<string, string> } | null =
        await response.json().catch(() => null);

      if (!response.ok) {
        const errors: FieldErrors = {
          name: result?.fields?.name
            ? validationMessages[result.fields.name] ?? copy.requestFailed
            : undefined,
          email: result?.fields?.email
            ? validationMessages[result.fields.email] ?? copy.requestFailed
            : undefined,
          password: result?.fields?.password
            ? validationMessages[result.fields.password] ?? copy.requestFailed
            : undefined,
        };
        setFieldErrors(errors);

        const globalMessages: Record<string, string> = {
          EMAIL_EXISTS: copy.emailExists,
          INVALID_CREDENTIALS: copy.invalidCredentials,
          SERVICE_UNAVAILABLE: copy.serviceUnavailable,
          BODY_TOO_LARGE: copy.requestFailed,
          INVALID_INPUT: copy.requestFailed,
        };
        setMessage(
          globalMessages[result?.error ?? ""] ??
            (Object.values(errors).some(Boolean) ? "" : copy.requestFailed),
        );
        requestAnimationFrame(() => {
          if (errors.name) nameRef.current?.focus();
          else if (errors.email) emailRef.current?.focus();
          else if (errors.password) passwordRef.current?.focus();
        });
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch {
      setMessage(copy.requestFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {isSignup ? (
        <div>
          <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-roast">
            {copy.name}
          </label>
          <input
            ref={nameRef}
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
            className="min-h-12 w-full rounded-2xl border border-bean/20 bg-cream px-4 text-start text-roast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          />
          {fieldErrors.name ? (
            <p id="signup-name-error" className="mt-2 text-sm text-clay" aria-live="polite">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor={`${mode}-email`} className="mb-2 block text-sm font-medium text-roast">
          {copy.email}
        </label>
        <input
          ref={emailRef}
          id={`${mode}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete={isSignup ? "email" : "username"}
          spellCheck={false}
          required
          maxLength={254}
          dir="ltr"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? `${mode}-email-error` : undefined}
          className="min-h-12 w-full rounded-2xl border border-bean/20 bg-cream px-4 text-left text-roast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        />
        {fieldErrors.email ? (
          <p id={`${mode}-email-error`} className="mt-2 text-sm text-clay" aria-live="polite">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label htmlFor={`${mode}-password`} className="block text-sm font-medium text-roast">
            {copy.password}
          </label>
          {isSignup ? <span id="signup-password-hint" className="text-xs text-bean/60">{copy.passwordHint}</span> : null}
        </div>
        <input
          ref={passwordRef}
          id={`${mode}-password`}
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : 1}
          maxLength={72}
          dir="ltr"
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={[
            isSignup ? "signup-password-hint" : null,
            fieldErrors.password ? `${mode}-password-error` : null,
          ].filter(Boolean).join(" ") || undefined}
          className="min-h-12 w-full rounded-2xl border border-bean/20 bg-cream px-4 text-left text-roast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        />
        {fieldErrors.password ? (
          <p id={`${mode}-password-error`} className="mt-2 text-sm text-clay" aria-live="polite">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {message ? (
        <p role="status" aria-live="polite" className="rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-full bg-roast px-6 font-semibold text-cream transition-colors hover:bg-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {pending
          ? isSignup
            ? copy.creatingAccount
            : copy.loggingIn
          : isSignup
            ? copy.createAccount
            : copy.logIn}
      </button>

      <p className="text-center text-sm text-bean/70">
        {isSignup ? copy.haveAccount : copy.needAccount}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-clay underline underline-offset-4 hover:text-roast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          {isSignup ? copy.logInLink : copy.signUpLink}
        </Link>
      </p>
    </form>
  );
}
